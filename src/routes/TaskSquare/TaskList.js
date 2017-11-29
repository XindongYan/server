import React, { PureComponent } from 'react';
import { connect } from 'dva';
import querystring from 'querystring';
import { Card, message, Row, Spin } from 'antd';
import styles from './index.less';
import TaskCard from './TaskCard';
import io from 'socket.io-client';
import { ORIGIN } from '../../constants';

@connect(state => ({
  tasks: state.taskSquare.tasks,
  loading: state.taskSquare.tasksLoading,
  currentUser: state.user.currentUser,
}))

export default class TaskList extends PureComponent {
  state = {
   socket: null,
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    dispatch({
      type: 'taskSquare/fetchProjectTasks',
      payload: { project_id: query.project_id }
    });

    if (!this.state.socket) {
      const socket = io.connect(`${ORIGIN}/tasks`);
      socket.on('connect',function(){
        console.log('socket.io connect OK');
        socket.emit('join', { roomId: query.project_id });
      });
      socket.on('take', (data) => {
        console.log(data);
        dispatch({
          type: 'taskSquare/responseTasken',
          payload: {
            _id: data.task._id,
          },
        });
      });
      this.setState({ socket });
    }
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'taskSquare/clearProjectTasks',
    });
  }
  handleTake = (task) => {
    const { dispatch, currentUser } = this.props;
    this.props.dispatch({
      type: 'taskSquare/takeTask',
      payload: {
        _id: task._id,
        taker_id: currentUser._id,
      },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          message.success(result.msg);
          this.state.socket.emit('take', { task });
        }
      },
    });
  }
  componentWillReceiveProps(nextProps) {
    
  }

  
  render() {
    const { tasks: { list }, loading } = this.props;
    return (
      <Card bordered={false} bodyStyle={{ padding: "10px" }} className="myCard">
        <Spin spinning={loading}>
          <Row gutter={16}>
            {list.map((item,index) => 
              <TaskCard task={item} key={index} onTake={this.handleTake}/>)
            }
          </Row>
        </Spin>
      </Card>
    );
  }
}
