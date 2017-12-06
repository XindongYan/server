import React, { PureComponent } from 'react';
import { connect } from 'dva';
import querystring from 'querystring';
import { Card } from 'antd';
import $ from 'jquery';
import Editor from '../../components/Editor';
import Annotation from '../../components/Annotation';
import ApproveLog from '../../components/ApproveLog';
import WeitaoForm from '../../components/Forms/WeitaoForm';
import ZhiboForm from '../../components/Forms/ZhiboForm';
import TaskChat from '../../components/TaskChat';
import { TASK_APPROVE_STATUS } from '../../constants';
import styles from './TableList.less';


@connect(state => ({
  formData: state.task.formData,
  approveData: state.task.approveData,
  currentUser: state.user.currentUser,
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
      }
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: false,
    });
  }
  handleSubmit = () => {
  }
  handleChange = (task) => {
    this.setState({ task: { ...this.state.task, ...task } }, () => {
    });
  }
  render() {
    const { formData, approveData, currentUser } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    const operation = 'view';
    const showApproveLog = formData.approvers && formData.approvers[0] && formData.approvers[0].indexOf(currentUser._id) >= 0;
    const showAnnotation = formData.approve_status === TASK_APPROVE_STATUS.passed || formData.approve_status === TASK_APPROVE_STATUS.rejected;
    return (
      <Card bordered={false} title="" style={{ background: 'none' }} bodyStyle={{ padding: 0 }}>
        <div className={styles.taskOuterBox} ref="taskOuterBox">
          { (formData.channel_name === '淘宝头条' || formData.channel_name === '微淘') &&
            <WeitaoForm
              role="approve"
              operation={operation}
              style={{ width: 650 }}
              formData={this.state.task}
              onChange={this.handleChange}
            />
          }
          { formData.channel_name === '直播脚本' &&
            <ZhiboForm
              role="approve"
              operation={operation}
              style={{ width: 650 }}
              formData={this.state.task}
              onChange={this.handleChange}
            />
          }
          { showAnnotation &&
            <div className={styles.taskComment}>
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
        <TaskChat taskId={query._id} />
        { showApproveLog && <ApproveLog approveData={approveData}/> }
      </Card>
    );
  }
}
