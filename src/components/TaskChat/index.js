import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Popover, Button, Badge } from 'antd';
import io from 'socket.io-client';
import { ORIGIN } from '../../constants';

@connect(state => ({
  currentUser: state.user.currentUser,
}))

export default class TaskChat extends PureComponent {
  state = {
    visible: false,
    taskChatMsgNum: 0,
    socket: null,
  }
  componentDidMount() {
    if (!this.state.socket) {
      const socket = io.connect(`${ORIGIN}/taskChat`);
      socket.on('connect', () => {
        socket.emit('join', { roomId: this.props.taskId });
      });
      socket.on('message', (data) => {
        if (data.from_user_id._id !== this.props.currentUser._id) {
          this.setState({ taskChatMsgNum: this.state.taskChatMsgNum + 1 });
        }
      });
      this.setState({ socket });
    }
  }
  hide = () => {
    this.setState({
      visible: false,
    });
  }
  handleVisibleChange = (visible) => {
    if (visible) {
      this.setState({ taskChatMsgNum: 0, visible });
    } else {
      this.setState({ visible });
    }
  }

  render() {
    const { taskId } = this.props;
    const { visible, taskChatMsgNum } = this.state;
    return (
      <div style={{ position: 'fixed', top: 80, right: 20, zIndex: 8 }}>
        <Popover
          content={
            <iframe
              title="taskChat"
              src={`${ORIGIN}/wechat/taskChat?task_id=${taskId}`}
              style={{ width: 320, height: '500px' }}
            >
            </iframe>
          }
          title="聊天窗口"
          trigger="click"
          placement="bottomRight"
          visible={visible}
          onVisibleChange={this.handleVisibleChange}
        >
          <Badge count={taskChatMsgNum}>
            <Button type="default" shape="circle" icon="message" size="large" />
          </Badge>
        </Popover>
      </div>
    );
  }
}
