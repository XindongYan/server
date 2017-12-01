import React, { PureComponent } from 'react';
import { connect } from 'dva';
import querystring from 'querystring';
import { Card } from 'antd';
import $ from 'jquery';
import Editor from '../../components/Editor';
import Annotation from '../../components/Annotation';
import WeitaoForm from '../../components/Forms/WeitaoForm';
import TaskChat from '../../components/TaskChat';
import { TASK_APPROVE_STATUS } from '../../constants';
import styles from './TableList.less';


@connect(state => ({
  formData: state.task.formData,
}))

export default class TaskView extends PureComponent {
  state = {
    task: {
      title: '',
      task_desc: '',
      cover_img: '',
      approve_notes: [],
    },
  }
  componentDidMount() {
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch({
      type: 'task/fetchTask',
      payload: query,
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      task: {
        title: nextProps.formData.title,
        task_desc: nextProps.formData.task_desc,
        cover_img: nextProps.formData.cover_img,
        approve_notes: nextProps.formData.approve_notes,
      }
    });
  }
  handleSubmit = () => {
  }
  handleChange = (task) => {
    this.setState({ task: { ...this.state.task, ...task } }, () => {
    });
  }
  render() {
    const { formData } = this.props;
    const taskOuterBoxHeight = $(this.refs.taskOuterBox).outerHeight() || 0;
    const showAnnotation = formData.approve_status === TASK_APPROVE_STATUS.passed || formData.approve_status === TASK_APPROVE_STATUS.rejected;
    return (
      <Card bordered={false} title="" style={{ background: 'none' }} bodyStyle={{ padding: 0 }}>
        <div className={styles.taskOuterBox} ref="taskOuterBox">
          <WeitaoForm operation="view" style={{ width: 650 }} formData={this.state.task} onChange={this.handleChange}/>
          { showAnnotation &&
            <div className={styles.taskComment} style={{height: taskOuterBoxHeight - 40}}>
              <Annotation viewStatus="view" value={this.state.task.approve_notes} onChange={this.handleChange}/>
            </div>
          }
          {this.state.grade > 0 &&
            <div className={styles.submitBox}>
              <dl className={styles.showGradeBox}>
              <dt>分数</dt>
              {grades.map((item) => 
                <dd key={item.name}><span>{item.name}：</span><span>{item.value}</span></dd>)
              }
              </dl>
            </div>
          }
        </div>
        <TaskChat task={formData} />
      </Card>
    );
  }
}
