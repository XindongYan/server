import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import querystring from 'querystring';
import { Card, Button, Popconfirm, message } from 'antd';
import $ from 'jquery';
import Annotation from '../../components/Annotation';
import WeitaoForm from '../../components/Forms/WeitaoForm';
import TaskChat from '../../components/TaskChat';
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
      approve_notes: [],
    },
    grade: 0,
    grades: [],
  }
  componentDidMount() {
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch({
      type: 'task/fetchTask',
      payload: { _id: query._id },
    });
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: true,
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      task: {
        title: nextProps.formData.title,
        task_desc: nextProps.formData.task_desc,
        cover_img: nextProps.formData.cover_img,
        approve_notes: nextProps.formData.approve_notes || [],
      },
      grade: nextProps.formData.grade,
      grades: nextProps.formData.grades,
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: false,
    });
  }
  handleSubmit = () => {
    const { task } = this.state;
    if (!task.title || !task.title.replace(/\s+/g, '')) {
      message.warn('请填写标题');
    } else if (!task.task_desc) {
      message.warn('请填写内容');
    } else if (!task.cover_img) {
      message.warn('请选择封面图');
    } else {
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
                  this.props.dispatch(routerRedux.push(`/writer/task/handin/success?_id=${query._id}`));
                }
              }
            });
          }
        }
      });
    }
  }
  handleSave = () => {
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
    const taskOuterBoxHeight = $(this.refs.taskOuterBox).outerHeight() || 0;
    const query = querystring.parse(this.props.location.search.substr(1));
    return (
      <Card bordered={false} title="" style={{ background: 'none' }} bodyStyle={{ padding: 0 }}>
        <div className={styles.taskOuterBox} ref="taskOuterBox">
          <WeitaoForm role="writer" operation="edit" style={{ width: 650 }} formData={this.state.task} onChange={this.handleChange} />
          <div className={styles.taskComment}>
            <Annotation viewStatus="view" value={this.state.task.approve_notes} />
          </div>
          <div className={styles.submitBox}>
            {this.state.grade > 0 &&
              <dl className={styles.showGradeBox}>
                <dt>分数</dt>
                {this.state.grades.map((item) => 
                  <dd key={item.name}><span>{item.name}：</span><span>{item.value}</span></dd>)
                }
              </dl>
            }
            <Popconfirm placement="top" title="确认已经写完并提交给审核人员?" onConfirm={this.handleSubmit} okText="确认" cancelText="取消">
              <Button>提交</Button>
            </Popconfirm>
            <Button onClick={this.handleSave}>保存</Button>
          </div>
        </div>
        <TaskChat taskId={query._id} />
      </Card>
    );
  }
}
