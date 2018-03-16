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
    formData: {},
    merchant_tag: '',
    needValidateFieldNames: [],
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
            merchant_tag: result.task.merchant_tag,
            needValidateFieldNames: result.task.children.filter(item => item.component === 'Input').map(item => item.name),
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
  handleMerchantTagChange = (value) => {
    // console.log(value);
    this.setState({ merchant_tag: value.join(',') });
  }
  extractAuctionIds = (children) => {
    const auctionIds = [];
    const body = children.find(item => item.name === 'body');
    if (body) {
      if (body.component === 'Editor' && body.props.value.entityMap) {
        const entityMap = body.props.value.entityMap;
        Object.keys(entityMap).forEach(item => {
          if (entityMap[item].type === 'SIDEBARSEARCHITEM') {
            auctionIds.push(Number(entityMap[item].data.itemId));
          } else if (entityMap[item].type === 'SIDEBARADDSPU') {
            auctionIds.push(Number(entityMap[item].data.spuId));
          }
        });
      } else if (body.component === 'AnchorImageList' && body.props.value[0]) {
        body.props.value.forEach(({ anchors }) => {
          anchors.forEach(item => {
            auctionIds.push(item.data.itemId);
          });
        });
      } else if (body.component === 'CreatorAddItem' && body.props.value[0]) {
        auctionIds.push(body.props.value[0].itemId);
      } else if (body.component === 'CreatorAddSpu' && body.props.value[0]) {
        auctionIds.push(body.props.value[0].spuId);
      }
    }
    return auctionIds;
  }
  handleSave = () => {
    const { approve_notes, merchant_tag } = this.state;
    const query = querystring.parse(this.props.location.search.substr(1));
    const { formData } = this.props;
    this.props.form.validateFieldsAndScroll(['title'], (err, vals) => {
      if (!err) {
        const children = Object.assign([], this.state.children);
        const title = children.find(item => item.name === 'title').props.value;
        let name = formData.name;
        if (!formData.project_id) {
          name = title;
        }
        
        let auctionIds = [];
        auctionIds = this.extractAuctionIds(children);
        if (!title.trim()) {
          message.warn('请输入标题');
        } else {
          const newChildren = children.map(item => {
            return {
              component: item.component,
              name: item.name,
              value: item.props.value,
            };
          });
          const values = { name, children: newChildren, auctionIds };
          this.props.dispatch({
            type: 'task/update',
            payload: {
              ...values,
              merchant_tag,
              _id: query._id,
              approve_notes: approve_notes,
            },
            callback: (result) => {
              if (result.error) {
                message.error(result.msg);
              } else {
                message.success(result.msg);
              }
            }
          });
        }
      }
    });
  }
  validate = (fieldNames, callback) => {
    const query = querystring.parse(this.props.location.search.substr(1));
    const { formData } = this.props;
    this.props.form.validateFieldsAndScroll(fieldNames, (err, values) => {
      if (!err) {
        const children = Object.assign([], this.state.children);
        const title = children.find(item => item.name === 'title').props.value;
        let name = formData.name;
        if (!formData.project_id) {
          name = title;
        }
        
        let auctionIds = [];
        auctionIds = this.extractAuctionIds(children);
        if (!title.trim()) {
          message.warn('请输入标题');
        } else {
          let msg = '';
          children.forEach(child => {
            if (child.component === 'CascaderSelect' && !child.props.value) {
              const required = child.rules.find(r => r.required);
              if (required) msg = required.message;
            } else if (child.component === 'CreatorAddImage' && child.name === 'standardCoverUrl' && child.props.value.length === 0) {
              msg = '请上传封面图';
            } else if (child.component === 'CreatorAddItem' && child.props.value.length === 0) {
              msg = '请添加一个宝贝';
            } else if (child.component === 'CreatorAddSpu' && child.props.value.length === 0) {
              msg = '请添加一个产品';
            } else if (child.component === 'AddTag') {
              const min = child.rules.find(item => item.min) ? child.rules.find(item => item.min).min : null;
              const max = child.rules.find(item => item.max) ? child.rules.find(item => item.max).max : null;
              if (min && child.props.value.length < min) msg = `请选择至少${min}个${child.label}`;
              else if (max && child.props.value.length > max) msg = `最多允许${max}个${child.label}`;
            } else if (child.component === 'TagPicker') {
              const min = child.rules.find(item => item.min) ? child.rules.find(item => item.min).min : null;
              const max = child.rules.find(item => item.max) ? child.rules.find(item => item.max).max : null;
              if (min && child.props.value.length < min) msg = `请选择至少${min}个分类`;
              else if (max && child.props.value.length > max) msg = `最多允许${max}个分类`;
            } else if (child.component === 'AnchorImageList' && child.props.value.length === 0) {
              msg = '请添加搭配图';
            } else if (child.component === 'StructCanvas') {
              const len = child.props.value.length - 1;
              if (child.props.value[0].data && child.props.value[0].data.features.length === 0) msg = '宝贝亮点最少2条';
              else if (len < 2) msg = '请添加至少2个宝贝段落';
              else if (len > 5) msg = '请添加最多5个宝贝段落';
            }
          });
          if (msg) {
            message.warn(msg);
          } else {
            const newChildren = children.map(item => {
              return {
                component: item.component,
                name: item.name,
                value: item.props.value,
              };
            });
            if (callback) callback(err, { name, children: newChildren, auctionIds });
          }
        }
      }
    });
  }
  handleSubmit = (status) => {
    const query = querystring.parse(this.props.location.search.substr(1));
    this.validate(this.state.needValidateFieldNames, (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'task/update',
          payload: {
            ...values,
            merchant_tag: this.state.merchant_tag,
            _id: query._id,
          },
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
    });
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
    const { approve_notes, formData: { activityId, template } } = this.state;
    const showApproveLog = formData.approvers && formData.approvers[0] && formData.approvers[0].indexOf(currentUser._id) >= 0;
    const operation = 'edit';

    return (
      <Card bordered={false} title="" style={{ background: 'none' }} bodyStyle={{ padding: 0 }}>
        <div className={styles.taskOuterBox} ref="taskOuterBox" style={{ width: template === 'item2' ? 730 : 1000 }}>
          <div style={{ width: template === 'item2' ? 375 : 650 }}>
            <NicaiForm form={this.props.form} children={this.state.children} operation={operation} onChange={this.handleChange} activityId={activityId}
            extraProps={{
              merchant_tag: {
                value: this.state.merchant_tag ? this.state.merchant_tag.split(',') : [],
                onChange: this.handleMerchantTagChange
              }
            }}
            />
          </div>
          <div className={styles.taskComment}>
            <Annotation
              approve_step={formData.approve_step}
              approve_status={formData.approve_status}
              viewStatus={operation}
              value={approve_notes}
              onChange={this.changeApproveNode}
              approve_note={formData.approve_note}
            />
          </div>
          { (formData.approve_status === TASK_APPROVE_STATUS.waitingForApprove || formData.approve_status === TASK_APPROVE_STATUS.passed || formData.approve_status === TASK_APPROVE_STATUS.waitingToTaobao ) &&
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
        {/* showApproveLog && <TaskChat taskId={query._id} /> */}
        { showApproveLog && <ApproveLog approveData={approveData}/> }
      </Card>
    );
  }
}
