import React, { PureComponent } from 'react';
import { connect } from 'dva';
import querystring from 'querystring';
import NicaiForm from '../../components/Form/index';
import { Card, Button, message, Popover, Slider, Popconfirm, Form } from 'antd';
import { RIGHTS, APPROVE_ROLES, ROLES, TASK_APPROVE_STATUS } from '../../constants';
import { routerRedux } from 'dva/router';
import TaskChat from '../../components/TaskChat';
import ApproveLog from '../../components/ApproveLog';
import styles from './TableList.less';
import Annotation from '../../components/Annotation';

// import styles from './Project.less';
const FormItem = Form.Item;
@connect(state => ({
  formData: state.task.formData,
  approveData: state.task.approveData,
  currentUser: state.user.currentUser,
}))
@Form.create()

export default class TaskEdit extends PureComponent {
  state = {
    children: [],
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
  changeApproveNode = (commentContent) => {
    this.setState({
      approve_notes: [...commentContent],
    })
  }
  handleChange = (children) => {
    this.setState({ children });
  }
  handleSave = () => {
    const { formData } = this.props;
    const { approve_notes } = this.state;
    const query = querystring.parse(this.props.location.search.substr(1));
    const name = '';
    if (name.trim()) {
      const values = {
        _id: query._id,
        approve_notes: approve_notes,
      }

      if (!formData.project_id) {
        // values.name =  name;
      }
      this.props.dispatch({
        type: 'task/update',
        payload: values,
        callback: (result) => {
          if (result.error) {
            message.error(result.msg);
          } else {
            message.success(result.msg);
          }
        }
      });
    } else {
      message.warn('请输入标题');
    }
  }
  validate = () => {
    
  }
  handleSubmit = (status) => {
    const query = querystring.parse(this.props.location.search.substr(1));
    const { formData } = this.props;

    
    if (this.validate()) {
      const values = {
        _id: query._id,
      }

      if (!formData.project_id) {
        values.name =  name;
      }
      this.props.dispatch({
        type: 'task/update',
        payload: values,
        callback: (result) => {
          if (result.error) {
            message.error(result.msg);
          } else {
            this.props.dispatch({
              type: 'task/approve',
              payload: {
                _id: query._id,
                approve_status: status,
                approver_id: this.props.currentUser._id,
                approve_notes: this.state.approve_notes,
              },
              callback: (result1) => {
                if (result1.error) {
                  message.error(result1.msg);
                } else {
                  message.success(result1.msg);
                  this.props.dispatch(routerRedux.push('/approve/approve-list'));
                }
              }
            });
          }
        }
      });
    }
  }
  handleReject = () => {
    const { dispatch, formData, currentUser } = this.props;
    dispatch({
      type: 'task/reject',
      payload: { _id: formData._id, approver_id: currentUser._id },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          message.success(result.msg);
          this.props.dispatch(routerRedux.push(`/approve/approve-list`));
        }
      },
    }); 
  }
  render() {
    const { formData, approveData, currentUser } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    const { approve_notes } = this.state;
    const showApproveLog = formData.approvers && formData.approvers[0] && formData.approvers[0].indexOf(currentUser._id) >= 0;
    const operation = 'edit';

    return (
      <Card bordered={false} title="" style={{ background: 'none' }} bodyStyle={{ padding: 0 }}>
        <div className={styles.taskOuterBox} ref="taskOuterBox" style={{ width: formData.channel_name === '有好货' ? 730 : 1000 }}>
          <div style={{ width: formData.channel_name === '有好货' ? 375 : 650 }}>
            <NicaiForm form={this.props.form} children={this.state.children} operation={operation} onChange={this.handleChange}/>
          </div>
          <div className={styles.taskComment}>
            <Annotation
              approve_step={formData.approve_step}
              approve_status={formData.approve_status}
              viewStatus={operation}
              value={approve_notes}
              onChange={this.changeApproveNode}
            />
          </div>
          { ((formData.approve_status === TASK_APPROVE_STATUS.waitingForApprove || showApproveLog) || formData.approve_status === TASK_APPROVE_STATUS.waitingToTaobao ) &&
            <div className={styles.submitBox}>
              <div id="subButton">
                { formData.approve_status !== 1 && formData.approve_status !== 3 ?
                  <span>
                    <Popconfirm
                      overlayClassName={styles.popConfirm}
                      placement="top"
                      title="确认提交？"
                      onConfirm={() => this.handleSubmit(TASK_APPROVE_STATUS.rejected)}
                      getPopupContainer={() => document.getElementById('subButton')}
                    >
                      <Button>不通过</Button>
                    </Popconfirm>
                    <Popconfirm
                      overlayClassName={styles.popConfirm}
                      placement="top"
                      title="确认提交？"
                      onConfirm={() => this.handleSubmit(TASK_APPROVE_STATUS.passed)}
                      getPopupContainer={() => document.getElementById('subButton')}
                    >
                      <Button>通过</Button>
                    </Popconfirm>
                  </span>
                  :
                  <Popconfirm
                    overlayClassName={styles.popConfirm}
                    placement="top"
                    title={`确认退回?`}
                    onConfirm={() => this.handleReject()}
                    okText="确认"
                    cancelText="取消"
                    getPopupContainer={() => document.getElementById('subButton')}
                  >
                    <Button>退回</Button>
                  </Popconfirm>
                }
              </div> 
              <Button onClick={this.handleSave}>保存</Button>
            </div>
          }
        </div>
        { showApproveLog && <TaskChat taskId={query._id} /> }
        { showApproveLog && <ApproveLog approveData={approveData}/> }
      </Card>
    );
  }
}
