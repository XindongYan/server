import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import querystring from 'querystring';
import { Card, Button, Popconfirm, message, Modal, Form, Select, Input, Tooltip } from 'antd';
import $ from 'jquery';
import WeitaoForm from '../../components/Forms/WeitaoForm';
import ZhiboForm from '../../components/Forms/ZhiboForm';
import GoodProductionForm from '../../components/Forms/GoodProductionForm';
import MerchantTag from '../../components/Forms/MerchantTag';
import { TASK_APPROVE_STATUS } from '../../constants';
import TaskChat from '../../components/TaskChat';
import styles from './TableList.less';
import { queryConvertedTasks } from '../../services/task';

const FormItem = Form.Item;
const Option = Select.Option;
@connect(state => ({
  suggestionUsers: state.team.suggestionUsers,
  formData: state.task.formData,
  currentUser: state.user.currentUser,
  teamUser: state.user.teamUser,
}))
@Form.create()
export default class TaskCreate extends PureComponent {
  state = {
    task: {
      crowd: [],
      title: '',
      task_desc: '',
      cover_img: '',
      merchant_tag: '',
    },
    haveGoodsTask: {
      crowd: [],
      title: '',
      task_desc: '',
      product_url: '', // 商品图片
      product_img: '', // 商品图片
      cover_imgs: [], // 封面图
      white_bg_img: '', // 白底图
      long_advantage: [], // 亮点
      short_advantage: [], // 短亮点
      industry_title: '', // 行业标题
      industry_introduction: '', // 行业介绍
      industry_img: '', // 行业图
      brand_name: '', // 品牌名称
      brand_introduction: '', // 品牌介绍
      brand_logo: '', // 商品logo
    },
    modalVisible: false,
    phone: '',
    approver_id: '',
    approver_id2: '',
    suggestionUsers: [],
    suggestionUsers2: [],
  }
  componentDidMount() {
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: true,
    });
    if (query._id) {
      this.props.dispatch({
        type: 'task/fetchTask',
        payload: { _id: query._id },
        callback: (result) => {
          this.setState({
            task: {
              crowd: result.task.crowd,
              merchant_tag: result.task.merchant_tag,
              title: result.task.title,
              task_desc: result.task.task_desc,
              cover_img: result.task.cover_img,
            },
            haveGoodsTask: { ...result.task.haveGoods }
          }, () => {
            if (result.task.channel_name === '有好货') {
              this.handleCreatGoodForm();
            }
          });
        }
      });
    } else {
      if (query.channel_name === '有好货') {
        this.handleCreatGoodForm();
      }
    }
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: false,
    });
  }

  handleCreatGoodForm = () => {
    const fieldsValue = {
      title: this.state.haveGoodsTask.title,
      task_desc: this.state.haveGoodsTask.task_desc,
      industry_title: this.state.haveGoodsTask.industry_title,
      industry_introduction: this.state.haveGoodsTask.industry_introduction,
      brand_name: this.state.haveGoodsTask.brand_name,
      brand_introduction: this.state.haveGoodsTask.brand_introduction,
    };
    this.props.form.setFieldsValue(fieldsValue);
  }
  handleShowAddTeamUserModal = () => {
    const query = querystring.parse(this.props.location.search.substr(1));
    const { task } = this.state;
    if (this.validate()) {
      if (query.project_id) {
        this.handleSubmitTask();
      } else {
        this.setState({ modalVisible: true, });
      }
    }
  }
  validate = () => {
    const query = querystring.parse(this.props.location.search.substr(1));
    const { task, haveGoodsTask } = this.state;
    if (query.channel_name === '有好货') {
      let bOk = true;
      this.props.form.validateFields(['title','task_desc','industry_title','industry_introduction','brand_name','brand_introduction'], (err, val) => {
        if (!err) {
          if (!task.merchant_tag) {
            message.warn('请填写商家标签');
            bOk = false;
          } else if (!haveGoodsTask.product_url) {
            message.warn('请选择商品宝贝');
            bOk = false;
          } else if (!haveGoodsTask.cover_imgs || haveGoodsTask.cover_imgs.length < 3) {
            message.warn('请选择至少三张封面图');
            bOk = false;
          } else if (!haveGoodsTask.white_bg_img) {
            message.warn('请选择一张白底图');
            bOk = false;
          } else if (!haveGoodsTask.long_advantage || haveGoodsTask.long_advantage.length < 2) {
            message.warn('请输入至少2条长亮点');
            bOk = false;
          } else if (!haveGoodsTask.short_advantage || haveGoodsTask.short_advantage.length < 2) {
            message.warn('请输入至少2条短亮点');
            bOk = false;
          } else if (!haveGoodsTask.industry_img) {
            message.warn('请选择一张行业配图');
            bOk = false;
          } else if (!haveGoodsTask.brand_logo) {
            message.warn('请上传品牌logo');
            bOk = false;
          }
        } else {
          bOk = false;
        }
      })
      return bOk;
    } else {
      if (!task.merchant_tag) {
        message.warn('请填写商家标签');
        return false;
      } else if (!task.title || !task.title.replace(/\s+/g, '')) {
        message.warn('请填写标题');
        return false;
      } else if (task.title && task.title.length > 19) {
        message.warn('标题字数不符合要求');
        return false;
      } else if (!task.task_desc) {
        message.warn('请填写内容');
        return false;
      } else if (!task.cover_img && query.channel_name !== '直播脚本') {
        message.warn('请选择封面图');
        return false;
      } else {
        return true;
      }
    }
  }
  handleSpecifyApprover = () => {
    const { dispatch } = this.props;
    const { approver_id, approver_id2 } = this.state;
    const approvers = [ approver_id ];
    if(approver_id2){
      approvers.push(approver_id2);
    }
    this.props.form.validateFields(['approver', 'approver2'], (err, values) => {
      if (!err) {
        if (approver_id) {
          this.setState({ modalVisible: false });
          this.handleSubmit(approvers);
        } else {
          message.warn('请根据手机号选择审核人员！');
        }
      }
    });
  }
  handleChange = (task) => {
    this.setState({ task: { ...this.state.task, ...task } });
  }
  handleChangeGoods = (task) => {
    this.setState({ haveGoodsTask: { ...this.state.haveGoodsTask, ...task } });
  }
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }
  onSearch = (value) => {
    this.setState({
      approver_id: '',
    })
    if (value.length == 11) {
      this.props.dispatch({
        type: 'team/fetchUsersByPhone',
        payload: {
          phone: value
        },
        callback: (res) => {
          this.setState({
            suggestionUsers: res.users || [],
          })
        }
      });
    }
  }
  onSearch2 = (value) => {
    this.setState({
      approver_id2: '',
    })
    if (value.length == 11) {
      this.props.dispatch({
        type: 'team/fetchUsersByPhone',
        payload: {
          phone: value
        },
        callback: (res) => {
          this.setState({
            suggestionUsers2: res.users || [],
          })
        }
      });
    }
  }
  onSelect = (value) => {
    this.setState({
      approver_id: value,
    })
  }
  onSelect2 = (value) => {
    this.setState({
      approver_id2: value,
    })
  }
  handleSubmit = (approvers) => {
    const { currentUser, teamUser } = this.props;
    const { task, haveGoodsTask, approver_id } = this.state;
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch({
      type: 'task/addByWriter',
      payload: {
        ...this.state.task,
        haveGoods: this.state.haveGoodsTask,
        name: task.title || haveGoodsTask.title,
        approve_status: TASK_APPROVE_STATUS.taken,
        channel_name: query.channel_name === '直播脚本' ? '' : query.channel_name,
        task_type: query.task_type ? Number(query.task_type) : 1,
        team_id: teamUser ? teamUser.team_id : null,
        publisher_id: currentUser._id,
        taker_id: currentUser._id,
        take_time: new Date(),
        creator_id: currentUser._id,
        current_approvers: [ approver_id ],
        approvers: [ ...approvers ],
      },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          this.props.dispatch({
            type: 'task/handin',
            payload: { _id: result.task._id, user_id: currentUser._id },
            callback: (result1) => {
              if (result1.error) {
                message.error(result1.msg);
              } else {
                this.props.dispatch(routerRedux.push(`/writer/task/handin/success?_id=${result.task._id}`));
              }
            }
          });
        }
      },
    });
  }
  handleSave = () => {
    const query = querystring.parse(this.props.location.search.substr(1));
    const { currentUser, teamUser } = this.props;
    const { task, haveGoodsTask, approver_id } = this.state;
    if (!task.title && !haveGoodsTask.title) {
      message.warn('请输入标题');
    } else {
      if (query._id) {
        this.props.dispatch({
          type: 'task/update',
          payload: {
            ...this.state.task,
            haveGoods: this.state.haveGoodsTask,
            _id: query._id,
            name: task.title || haveGoodsTask.title,
          },
          callback: (result) => {
            if (result.error) {
              message.error(result.msg);
            } else {
              message.success(result.msg);
            }
          }
        });
      } else {
        this.props.dispatch({
          type: 'task/addByWriter',
          payload: {
            ...this.state.task,
            haveGoods: this.state.haveGoodsTask,
            name: task.title || haveGoodsTask.title,
            approve_status: TASK_APPROVE_STATUS.taken,
            channel_name: query.channel_name === '直播脚本' ? '' : query.channel_name,
            task_type: query.task_type ? Number(query.task_type) : 1,
            team_id: teamUser ? teamUser.team_id : null,
            publisher_id: currentUser._id,
            publish_time: new Date(),
            taker_id: currentUser._id,
            take_time: new Date(),
            creator_id: currentUser._id,
            daren_id: currentUser._id,
            daren_time: new Date(),
            project_id: query.project_id || undefined,
          },
          callback: (result) => {
            if (result.error) {
              message.error(result.msg);
            } else {
              message.success(result.msg);
              query._id = result.task._id;
              this.props.dispatch(routerRedux.push(`/writer/task/create?${querystring.stringify(query)}`));
            }
          },
        });
      }
    }
  }
  handleSubmitTask = () => {
    const { currentUser, teamUser } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    const payload = {
      name: this.state.task.title || this.state.haveGoodsTask.title,
      project_id: query.project_id,
      creator_id: currentUser._id,
    };
    this.props.dispatch({
      type: 'task/add',
      payload: {
        ...payload,
      },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          this.props.dispatch({
            type: 'task/update',
            payload: {
              ...this.state.task,
              haveGoods: this.state.haveGoodsTask,
              _id: result.task._id,
              approve_status: TASK_APPROVE_STATUS.taken,
              publisher_id: currentUser._id,
              taker_id: currentUser._id,
              take_time: new Date(),
            },
            callback: (result1) => {
              if (result1.error) {
                message.error(result1.msg);
              } else {
                this.props.dispatch({
                  type: 'task/handin',
                  payload: { _id: result.task._id, user_id: currentUser._id },
                  callback: (result2) => {
                    if (result2.error) {
                      message.error(result2.msg);
                    } else {
                      message.success(result2.msg);
                      this.props.dispatch(routerRedux.push(`/writer/task/handin/success?_id=${result.task._id}`));
                    }
                  }
                });
              }
            }
          });
        }
      },
    });
  }
  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { modalVisible, task, haveGoodsTask, suggestionUsers, suggestionUsers2 } = this.state;
    const query = querystring.parse(this.props.location.search.substr(1));
    return (
      <Card bordered={false} title="" style={{ background: 'none' }} bodyStyle={{ padding: 0 }}>
        <div className={styles.taskOuterBox} style={{ width: 942 }} ref="taskOuterBox">
          <div style={{ width: 720 }}>
            <MerchantTag merchant_tag={task.merchant_tag} onChange={this.handleChange} />
            { (query.channel_name === '淘宝头条' || query.channel_name === '微淘') &&
              <WeitaoForm
                role="writer"
                operation="create"
                formData={task}
                onChange={this.handleChange}
              />
            }
            { query.channel_name === '直播脚本' &&
              <ZhiboForm
                role="writer"
                operation="create"
                formData={task}
                onChange={this.handleChange}
              />
            }
            { query.channel_name === '有好货' &&
              <GoodProductionForm
                form={this.props.form}
                role="writer"
                operation="create"
                formData={haveGoodsTask}
                onChange={this.handleChangeGoods}
              />
            }
          </div>
          <div className={styles.taskComment} style={{ width: 200 }}>
            <p className={styles.titleDefult}>爆文写作参考</p>
            <ul className={styles.tPrompt}>
              <li>1. 从小知识小技巧着手. 淘宝头条讲了个概念叫”随手有用书”,即生活中有很多一般人不注意的小知识小技巧. 比如大部分人都晾错内衣, 尤其是第二种方式这条,结合着推内衣这个点很不错.</li>
              <li>2. 从风格化, 场景化着手入手, 即内容针对目标人群.想一想目标针对用户有什么样的特点? 会对什么样的内容感兴趣?要去倒推.</li>
              <li>3. 从时下热点,八卦,新闻等角度着手.反正总之就是一句话:要用户产生觉得“有用”“感兴趣”等特别的感觉.</li>
            </ul>
          </div>
          <div className={styles.submitBox}>
            <Tooltip placement="top" title="提交到平台审核方进行审核">
            { query.project_id ?
              <Popconfirm placement="top" title="确认提交审核?" okText="确认" cancelText="取消" onConfirm={this.handleShowAddTeamUserModal}>
                <Button>提交审核</Button>
              </Popconfirm>
              :
              <Button onClick={this.handleShowAddTeamUserModal}>提交审核</Button>
            }
            </Tooltip>
            <Tooltip placement="top" title="保存到待完成列表">
              <Button onClick={this.handleSave}>保存</Button>
            </Tooltip>
          </div>
        </div>
        <Modal
          title="选择审核人员"
          visible={modalVisible}
          onOk={this.handleSpecifyApprover}
          onCancel={() => this.handleModalVisible(false)}
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
                  placeholder="搜索电话指定审核人员"
                  notFoundContent=""
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  onSearch={this.onSearch}
                  onSelect={this.onSelect}
                >
                  {suggestionUsers.map(item => <Option value={item._id} key={item.phone}>{item.name}</Option>)}
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
                  placeholder="搜索电话指定审核人员"
                  notFoundContent=""
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  onSearch={this.onSearch2}
                  onSelect={this.onSelect2}
                >
                  {suggestionUsers2.map(item => <Option value={item._id} key={item.phone}>{item.name}</Option>)}
                </Select>
              )}
            </FormItem>
        </Modal>
      </Card>
    );
  }
}
