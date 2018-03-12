import React, { PureComponent } from 'react';
import { connect } from 'dva';
import querystring from 'querystring';
import { Card, Form } from 'antd';
import Annotation from '../../components/Annotation';
import ApproveLog from '../../components/ApproveLog';
import TaskChat from '../../components/TaskChat';
import { TASK_APPROVE_STATUS } from '../../constants';
import NicaiForm from '../../components/Form/index';
import styles from './TableList.less';


@connect(state => ({
  formData: state.task.formData,
  approveData: state.task.approveData,
  currentUser: state.user.currentUser,
}))
@Form.create()

export default class TaskView extends PureComponent {
  state = {
    children: [],
    formData: {},
    approve_notes: [],
  }
  componentWillMount() {
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch({
      type: 'task/fetchTask',
      payload: query,
      callback: (result) => {
        if (!result.error) {
          this.setState({
            children: result.task.children,
            formData: result.task.formData,
            approve_notes: result.task.approve_notes || [],
          });
        }
      }
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'task/clearFormData'
    });
  }
  handleSubmit = () => {
  }
  render() {
    const { formData, approveData, currentUser } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    const { formData: { activityId, template } } = this.state;
    const operation = 'view';
    const showApproveLog = formData.approvers && formData.approvers[0] && formData.approvers[0].indexOf(currentUser._id) >= 0;
    const showAnnotation = showApproveLog;
    return (
      <Card bordered={false} title="" style={{ background: 'none' }} bodyStyle={{ padding: 0 }}>
        <div className={styles.taskOuterBox} ref="taskOuterBox" style={{ width: template === 'item2' ? 730 : 1000 }}>
          <div style={{ width: template === 'item2' ? 375 : 650 }}>
            <NicaiForm form={this.props.form} children={this.state.children} operation={operation} activityId={activityId} />
          </div>  
          { showAnnotation &&
            <div className={styles.taskComment}>
              <Annotation viewStatus="view" value={this.state.approve_notes}/>
            </div>
          }
        </div>
        {/* showApproveLog && <TaskChat taskId={query._id} /> */}
        { showApproveLog && <ApproveLog approveData={approveData}/> }
      </Card>
    );
  }
}
