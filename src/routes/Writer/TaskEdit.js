import React, { PureComponent } from 'react';
import { connect } from 'dva';
import querystring from 'querystring';
import { Card, Button, message } from 'antd';
import $ from 'jquery';
import Editor from '../../components/Editor';
import Annotation from '../../components/Annotation';
import WeitaoForm from '../../components/Forms/WeitaoForm';
import styles from './TableList.less';

// import styles from './Project.less';

@connect(state => ({
  formData: state.task.formData,
}))

export default class TaskEdit extends PureComponent {
  state = {
    task: {
      title: '',
      task_desc: '',
      cover_img: '',
    },
  }
  componentDidMount() {
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch({
      type: 'task/fetchTask',
      payload: { _id: query._id },
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      task: {
        title: nextProps.formData.title,
        task_desc: nextProps.formData.task_desc,
        cover_img: nextProps.formData.cover_img,
      }
    });
  }
  handleSubmit = () => {
    console.log(this.state.task);
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch({
      type: 'task/update',
      payload: { ...this.state.task, _id: query._id },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          this.props.dispatch({
            type: 'task/handin',
            payload: { _id: query._id },
            callback: (result1) => {
              if (result1.error) {
                message.error(result1.msg);
              } else {
                message.success(result1.msg);
              }
            }
          });
        }
      }
    });
  }
  handleSave = () => {
    console.log(this.state.task);
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch({
      type: 'task/update',
      payload: { ...this.state.task, _id: query._id },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          message.success(result.msg);
        }
      }
    });
  }
  handleChange = (task) => {
    this.setState({ task: { ...this.state.task, ...task } });
  }
  render() {
    const { formData } = this.props;
    const taskOuterBoxHeight = $(this.refs.taskOuterBox).outerHeight() || 0;
    return (
      <Card bordered={false} title="" style={{ background: 'none' }} bodyStyle={{ padding: 0 }}>
        <div className={styles.taskOuterBox} ref="taskOuterBox">
          <WeitaoForm operation="edit" style={{ width: 650 }} formData={this.state.task} onChange={this.handleChange}/>
          <div className={styles.taskComment} style={{height: taskOuterBoxHeight - 40}}>
            <div className={styles.commentTitle}>
              批注
            </div>
            <Annotation style={{height: '100%'}} />
          </div>
          <Button onClick={this.handleSubmit} style={{ position: 'fixed' }}>提交</Button>
          <Button onClick={this.handleSave} style={{ position: 'fixed', left: 300 }}>保存</Button>
        </div>
        
      </Card>
    );
  }
}
