import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import querystring from 'querystring';
import { Card, Button, Popconfirm, message, Modal, Form, Select, Tooltip, Icon } from 'antd';
import Annotation from '../../components/Annotation';
import NicaiForm from '../../components/Form/index';

import { TASK_APPROVE_STATUS, SOURCE, CHANNELS, TASK_TYPES } from '../../constants';
import TaskChat from '../../components/TaskChat';
import styles from './TableList.less';
import { queryTaskRender } from '../../services/task';

const FormItem = Form.Item;
const Option = Select.Option;
@connect(state => ({
  suggestionUsers: state.team.suggestionUsers,
  formData: state.task.formData,
  currentUser: state.user.currentUser,
  teamUser: state.user.teamUser,
}))
@Form.create()

export default class TaskForm extends PureComponent {
  state = {
    children: [],
    formData: {},
    needValidateFieldNames: [],
    approveModalVisible: false,
    approver_id: {
      first: '',
      second: '',
    },
    suggestionApproves: {
      first: [],
      second: [],
    },
    saveLoading: false,
    submitLoading: false,
    times: null,
  }
  componentWillMount() {
    window.onbeforeunload = () => {
      return "确认离开页面?";
    }
    const query = querystring.parse(this.props.location.search.substr(1));
    if (query._id) {
      this.props.dispatch({
        type: 'task/fetchTask',
        payload: { _id: query._id },
        callback: (result) => {
          if (!result.error) {
            this.setState({ children: result.task.children, formData: result.task.formData, needValidateFieldNames: result.task.children.filter(item => item.component === 'Input').map(item => item.name) });
          }
        }
      });
    } else {
      const params = {
        template: query.template
      }
      if (query.activityId && (Number(query.activityId) > 0 || Number(query.activityId) === -21)) params.activityId = query.activityId;
      queryTaskRender(params).then(result => {
        if (!result.error) {
          this.setState({ children: result.children, formData: result.formData, needValidateFieldNames: result.children.filter(item => item.component === 'Input').map(item => item.name) });
        }
      });
    }

    setTimeout(() => {
      const taskForm = JSON.parse(localStorage.getItem('taskForm')) || [];
      const index = this.handleGetTaskFormIndex(taskForm);
      if (index >= 0) {
        Modal.confirm({
          title: '有自动保存的信息',
          content: (<div>发现本地有自动保存未提交的内容，点击『确认』将会恢复未提交数据。</div>),
          onOk: () => {
            this.setState({ children: taskForm[index].children, formData: taskForm[index].formData, });
            taskForm.splice(index, 1);
            localStorage.setItem('taskForm', JSON.stringify(taskForm));
          },
          onCancel: () => {
            taskForm.splice(index, 1);
            localStorage.setItem('taskForm', JSON.stringify(taskForm));
          },
        });
      }
    }, 1500);
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'task/clearFormData'
    });
    window.onbeforeunload = null;
    console.log('clear');
    clearInterval(this.state.times);
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
  handleSubmitTask = () => {
    const { channel_name, channel } = this.getChannel();
    this.validate(this.state.needValidateFieldNames, (err, values) => {
      const query = querystring.parse(this.props.location.search.substr(1));
      const { currentUser } = this.props;
      this.setState({
        submitLoading: true,
      });
      if (query._id) {
        this.props.dispatch({
          type: 'task/update',
          payload: {
            ...values,
            _id: query._id,
            approve_status: TASK_APPROVE_STATUS.taken,
            publisher_id: currentUser._id,
            taker_id: currentUser._id,
          },
          callback: (result1) => {
            if (result1.error) {
              message.error(result1.msg);
            } else {
              this.handleHandin(query._id);
              this.handleTaskFormRemove();
            }
            this.setState({
              submitLoading: false,
            });
          }
        });
      } else {
        this.props.dispatch({
          type: 'task/add',
          payload: {
            ...values,
            channel,
            channel_name,
            formData: this.state.formData,
            source: SOURCE.deliver,
            project_id: query.project_id,
            creator_id: currentUser._id,
            take_time: new Date(),
            approve_status: TASK_APPROVE_STATUS.taken,
            publisher_id: currentUser._id,
            taker_id: currentUser._id,
          },
          callback: (result) => {
            if (result.error) {
              message.error(result.msg);
            } else {
              this.handleHandin(result.task._id);
              this.handleTaskFormRemove();
            }
            this.setState({
              submitLoading: false,
            });
          },
        });
      }
    });  
  }
  
  handleSpecifyApprover = () => {
    const { approver_id } = this.state;
    this.props.form.validateFields(['approver', 'approver2'], (err, values) => {
      if (!err) {
        if (approver_id.first) {
          const approvers = [ [approver_id.first] ];
          if(approver_id.second){
            approvers.push([approver_id.second]);
          }
          this.setState({
            modalVisible: false,
            submitLoading: true,
          });
          this.handleSubmit(approvers);
        } else {
          message.warn('请选择审核人')
        }
      }
    });
  }
  handleModalVisible = (flag) => {
    this.setState({
      approveModalVisible: !!flag,
    });
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
          // } else if (entityMap[item].type === 'SIDEBARADDSPU') {
          //   auctionIds.push(Number(entityMap[item].data.spuId));
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
      // else if (body.component === 'StructCanvas' && body.props.value[0]) {

      // }
    }
    return auctionIds;
  }
  handleSave = () => {
    const query = querystring.parse(this.props.location.search.substr(1));
    const { currentUser, teamUser, formData } = this.props;
    const { formData: { template } } = this.state;
    const task_type = TASK_TYPES.find(item => item.template === template);
    const { channel_name, channel } = this.getChannel();
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
          this.setState({
            saveLoading: true,
          });
          if (query._id) {
            this.props.dispatch({
              type: 'task/update',
              payload: {
                ...values,
                _id: query._id,
              },
              callback: (result) => {
                if (result.error) {
                  message.error(result.msg);
                } else {
                  this.setState({
                    saveLoading: false,
                  })
                  message.success(result.msg);
                  this.handleTaskFormRemove();
                }
              }
            });
          } else {
            if (query.project_id) {
              this.props.dispatch({
                type: 'task/add',
                payload: {
                  ...values,
                  formData: this.state.formData,
                  source: SOURCE.deliver,
                  approve_status: TASK_APPROVE_STATUS.taken,
                  channel,
                  channel_name,
                  task_type: task_type.value,
                  team_id: teamUser ? teamUser.team_id : null,
                  publisher_id: currentUser._id,
                  publish_time: new Date(),
                  taker_id: currentUser._id,
                  take_time: new Date(),
                  creator_id: currentUser._id,
                  project_id: query.project_id,
                },
                callback: (result) => {
                  if (result.error) {
                    message.error(result.msg);
                  } else {
                    this.setState({
                      saveLoading: false,
                    })
                    message.success('保存成功');
                    query._id = result.task._id;
                    this.props.dispatch(routerRedux.push(`/writer/task/edit?${querystring.stringify(query)}`));
                    this.handleTaskFormRemove();
                  }
                },
              });
            } else {
              this.props.dispatch({
                type: 'task/addByWriter',
                payload: {
                  ...values,
                  formData: this.state.formData,
                  source: SOURCE.create,
                  approve_status: TASK_APPROVE_STATUS.taken,
                  channel,
                  channel_name,
                  task_type: task_type.value,
                  team_id: teamUser ? teamUser.team_id : null,
                  publisher_id: currentUser._id,
                  publish_time: new Date(),
                  taker_id: currentUser._id,
                  take_time: new Date(),
                  creator_id: currentUser._id,
                },
                callback: (result) => {
                  if (result.error) {
                    message.error(result.msg);
                  } else {
                    this.setState({
                      saveLoading: false,
                    })
                    message.success('保存成功');
                    query._id = result.task._id;
                    this.props.dispatch(routerRedux.push(`/writer/task/edit?${querystring.stringify(query)}`));
                    this.handleTaskFormRemove();
                  }
                }
              });
            }
          }
        }
      }
    });
  }
  handleSubmit = (approvers) => {
    const query = querystring.parse(this.props.location.search.substr(1));
    const { currentUser, teamUser } = this.props;
    const { formData: { template } } = this.state;
    const task_type = TASK_TYPES.find(item => item.template === template);
    const { channel_name, channel } = this.getChannel();
    this.validate(this.state.needValidateFieldNames, (err, values) => {
      if (!err) {
        if (query._id) {
          this.props.dispatch({
            type: 'task/update',
            payload: {
              ...values,
              _id: query._id,
              current_approvers: approvers[0],
              approvers: approvers,
            },
            callback: (result) => {
              if (result.error) {
                message.error(result.msg);
              } else {
                this.handleTaskFormRemove();
                this.handleHandin(query._id);
              }
              this.setState({
                submitLoading: false,
              });
            },
          });
        } else {
          this.props.dispatch({
            type: 'task/addByWriter',
            payload: {
              ...values,
              formData: this.state.formData,
              source: SOURCE.create,
              approve_status: TASK_APPROVE_STATUS.taken,
              channel,
              channel_name,
              task_type: task_type.value,
              team_id: teamUser ? teamUser.team_id : null,
              publisher_id: currentUser._id,
              publish_time: new Date(),
              taker_id: currentUser._id,
              take_time: new Date(),
              creator_id: currentUser._id,
              project_id: query.project_id || undefined,
              current_approvers: approvers[0],
              approvers: approvers,
            },
            callback: (result) => {
              if (result.error) {
                message.error(result.msg);
              } else {
                this.handleHandin(result.task._id);
                this.handleTaskFormRemove();
              }
            }
          });
        }
      }
    });
  }
  handleHandin = (_id, callback) => {
    const { currentUser } = this.props;
    this.props.dispatch({
      type: 'task/handin',
      payload: { _id: _id, user_id: currentUser._id },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          this.props.dispatch(routerRedux.push(`/writer/task/handin/success?_id=${_id}`));
          window.scroll(0, 0);
        }
        if (callback) callback(result);
      }
    });
  }
  handleShowSpecifyApproversModal = () => {
    const query = querystring.parse(this.props.location.search.substr(1));
    this.validate(this.state.needValidateFieldNames, (err, values) => {
      if (!err) {
        this.setState({ approveModalVisible: true, });
      }
    });
  }
  handleApproveSearch = (value, key) => {
    const { teamUser } = this.props;
    const data = {};
    data[key] = '';
    this.setState({
      approver_id: { ...this.state.approver_id, ...data },
    })
    if (value) {
      this.props.dispatch({
        type: 'team/searchTeamUsers',
        payload: {
          team_id: teamUser.team_id,
          nickname: value,
        },
        callback: (res) => {
          data[key] = res.list || [];
          this.setState({
            suggestionApproves: { ...this.state.suggestionApproves, ...data },
          })
        }
      });
    }
  }
  handelApproveSelect = (value, key) => {
    const data = {};
    data[key] = value;
    this.setState({
      approver_id: { ...this.state.approver_id, ...data },
    })
  }
  getChannel = () => {
    const { operation, formData } = this.props;
    if (operation === 'create') {
      const query = querystring.parse(this.props.location.search.substr(1));
      const channel = CHANNELS.find(item => item.id === Number(query.channelId));
      const activity = channel.activityList.find(item => item.id === Number(query.activityId));
      return { channel_name: channel.name, channel: [ Number(query.channelId), Number(query.activityId) ] };
      
    }
    return { channel_name: formData.channel_name, channel: formData.channel };
  }
  handleChangePushDaren = (value) => {
    const index = this.state.children.findIndex(item => item.name === 'pushDaren');
    if (index >= 0) {
      const children = Object.assign([], this.state.children);
      children[index].props.value = value;
      this.handleChange(children);;
    }
  }
  handleChange = (children) => {
    this.setState({ children });
    setTimeout(() => {
      if (!this.state.times) {
        console.log('start');
        clearInterval(this.state.times)
        const times = setInterval(this.handleTaskFormSave, 1000 * 20);
        this.setState({
          times,
        });
      }
    }, 200);
  }
  handleTaskFormSave = () => {
    console.log(1);
    const query = querystring.parse(this.props.location.search.substr(1));
    const { children, formData } = this.state;
    const taskForm = JSON.parse(localStorage.getItem('taskForm')) || [];
    const data = {children, formData};
    const index = this.handleGetTaskFormIndex(taskForm);
    if (query._id) {
      data._id = query._id;
    }
    if (index === -1) {
      taskForm.push(data);
    } else {
      taskForm.splice(index, 1, data);
    }
    localStorage.setItem('taskForm', JSON.stringify(taskForm));
  }
  handleTaskFormRemove = () => {
    const taskForm = JSON.parse(localStorage.getItem('taskForm')) || [];
    const index = this.handleGetTaskFormIndex(taskForm);
    if (index >= 0) {
      taskForm.splice(index, 1);
    }
    localStorage.setItem('taskForm', JSON.stringify(taskForm));
  }
  handleGetTaskFormIndex = (taskForm) => {
    const query = querystring.parse(this.props.location.search.substr(1));
    const activityId = query.activityId && (Number(query.activityId) > 0 || Number(query.activityId) === -21) ? Number(query.activityId) : '';
    let index = -1;
    if (query._id) {
      index = taskForm.findIndex(item => item._id === query._id);
    } else {
      index = taskForm.findIndex(item => {
        if (activityId) {
          return item.formData.activityId === activityId && item.formData.template === query.template;
        } else {
          return !item.formData.activityId && item.formData.template === query.template;
        }
      });
    }
    return index;
  }
  render() {
    const { form: { getFieldDecorator }, operation, formData } = this.props;
    const { approveModalVisible, formData: { activityId, template }, suggestionApproves } = this.state;
    const query = querystring.parse(this.props.location.search.substr(1));
    const writeTips = (
      <div className={styles.taskComment} style={{ width: 200, marginRight: 0 }}>
        <p className={styles.titleDefult}>爆文写作参考</p>
        <ul className={styles.tPrompt}>
          <li>1. 从小知识小技巧着手. 淘宝头条讲了个概念叫”随手有用书”,即生活中有很多一般人不注意的小知识小技巧. 比如大部分人都晾错内衣, 尤其是第二种方式这条,结合着推内衣这个点很不错.</li>
          <li>2. 从风格化, 场景化着手入手, 即内容针对目标人群.想一想目标针对用户有什么样的特点? 会对什么样的内容感兴趣?要去倒推.</li>
          <li>3. 从时下热点,八卦,新闻等角度着手.反正总之就是一句话:要用户产生觉得“有用”“感兴趣”等特别的感觉.</li>
        </ul>
      </div>
    );
    const pushDaren = this.state.children.find(item => item.name === 'pushDaren');
    let formRight = null;
    let outerWidth = 1000;
    if (operation === 'create') {
      formRight = writeTips;
      outerWidth = 868;
    } else if (operation === 'edit') {
      if (this.props.formData.approve_status === TASK_APPROVE_STATUS.rejected) {
        formRight = (
          <div className={styles.taskComment}>
            <Annotation viewStatus="view" value={formData.approve_notes} />
          </div>
        );
      } else if (this.props.formData.approve_status === TASK_APPROVE_STATUS.taken) {
        formRight = writeTips;
        outerWidth = 868;
      }
    } else if (operation === 'view') {
      if (formData.approve_status === TASK_APPROVE_STATUS.passed || formData.approve_status === TASK_APPROVE_STATUS.rejected) {
        formRight = (
          <div className={styles.taskComment}>
            <Annotation viewStatus="view" value={formData.approve_notes} />
          </div>
        );
      } else {
        formRight = writeTips;
        outerWidth = 868;
      }
    }
    if (template === 'item2') {
      outerWidth = 730;
    }
    return (
      <Card bordered={false} title="" style={{ background: 'none', paddingBottom: 60 }} bodyStyle={{ padding: 0 }}>
        <div className={styles.taskOuterBox} style={{ width: outerWidth }} ref="taskOuterBox">
          <div style={{ width: template === 'item2' ? 375 : 650 }}>
            <NicaiForm form={this.props.form} children={this.state.children} operation={operation} onChange={this.handleChange} activityId={activityId || 0} />
          </div>
          {formRight}
          { operation !== 'view' && <div className={styles.submitBox}>
            {pushDaren &&
              <div style={{ float: 'left', margin: '-6px 50px 0 0' }}>
                <div style={{ fontSize: 12 }}>推送到</div>
                <div className={styles.CreatorPush} onClick={() => this.handleChangePushDaren(!pushDaren.props.value)}>
                  <Tooltip placement="top" title={pushDaren.props.value ? pushDaren.props.html : pushDaren.props.html2}>
                    <img src={pushDaren.props.value ? pushDaren.props.iconActiveUrl : pushDaren.props.iconUrl} style={{ width: '100%' }}/>
                  </Tooltip>
                </div>
              </div>}
            { (query.project_id || formData.project_id || formData.approve_status === TASK_APPROVE_STATUS.rejected) ?
              <Tooltip placement="top" title="提交到平台审核方进行审核" getPopupContainer={() => document.getElementById('subButton')}>
                <Popconfirm overlayClassName={styles.popConfirm} getPopupContainer={() => document.getElementById('subButton')} placement="top" title="确认提交审核?" okText="确认" cancelText="取消" onConfirm={this.handleSubmitTask}>
                  <Button id="subButton" loading={this.state.submitLoading}>提交审核</Button>
                </Popconfirm>
              </Tooltip>
              :
              <Tooltip placement="top" title="提交到平台审核方进行审核" getPopupContainer={() => document.getElementById('subButton1')}>
                <Button id="subButton1" onClick={this.handleShowSpecifyApproversModal} loading={this.state.submitLoading}>提交审核</Button>
              </Tooltip>
            }
            <Tooltip placement="top" title="保存到待完成列表">
              <Button onClick={() => this.handleSave()} loading={this.state.saveLoading}>保存</Button>
            </Tooltip>
          </div>}
        </div>
        {approveModalVisible && <Modal
          title="选择审核人员"
          visible={approveModalVisible}
          onCancel={() => {this.setState({ approveModalVisible: false, submitLoading: false })}}
          footer={[
            <Button key="取消" onClick={() => {this.setState({ approveModalVisible: false, submitLoading: false })}}>取消</Button>,
            <Button key="确定" type="primary" loading={this.state.submitLoading} onClick={this.handleSpecifyApprover}>
              确定
            </Button>,
          ]}
        >
          <FormItem
              label="一审"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
            >
              {getFieldDecorator('approver', {
                initialValue: '',
                rules: [{ required: true, message: '请选择审核人员！' }],
              })(
                <Select
                  style={{ width: '100%' }}
                  mode="combobox"
                  optionLabelProp="children"
                  placeholder="搜索昵称指定审核人员"
                  notFoundContent=""
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  onSearch={(value) => this.handleApproveSearch(value, 'first')}
                  onSelect={(value) => this.handelApproveSelect(value, 'first')}
                >
                  {suggestionApproves.first.map(item => <Option value={item._id} key={item._id}>{item.nickname}</Option>)}
                </Select>
              )}
            </FormItem>
            <FormItem
              label="二审"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
            >
              {getFieldDecorator('approver2', {
                initialValue: '',
                rules: [{ required: false, message: '请选择审核人员！' }],
              })(
                <Select
                  style={{ width: '100%' }}
                  mode="combobox"
                  optionLabelProp="children"
                  placeholder="搜索昵称指定审核人员"
                  notFoundContent=""
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  onSearch={(value) => this.handleApproveSearch(value, 'second')}
                  onSelect={(value) => this.handelApproveSelect(value, 'second')}
                >
                  {suggestionApproves.second.map(item => <Option value={item._id} key={item._id}>{item.nickname}</Option>)}
                </Select>
              )}
            </FormItem>
        </Modal>}
      </Card>
    );
  }
}
