import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import querystring from 'querystring';
import { Card, Button, Popconfirm, message, Modal, Form, Select, Tooltip, Icon } from 'antd';
import $ from 'jquery';
import Annotation from '../../components/Annotation';
import * as NicaiForm from '../../components/Forms/FormParts/index';

import { TASK_APPROVE_STATUS, SOURCE } from '../../constants';
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
    form: [],
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
  }
  componentDidMount() {
    // window.onbeforeunload = () => {
    //   return "确认离开页面?";
    // }
    // window.addEventListener('popstate',this.closeModal,false);
    const query = querystring.parse(this.props.location.search.substr(1));
    if (query._id) {
      this.props.dispatch({
        type: 'task/fetchTask',
        payload: { _id: query._id },
        callback: (result) => {
          if (!result.error) {
            this.setState({ form: result.task.form });
          }
        }
      });
    } else {
      queryTaskRender({ channel_name: query.channel_name }).then(result => {
        if (!result.error) {
          this.setState({ form: result.form });
        }
      });
    }
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'task/clearFormData'
    });
    // window.removeEventListener('popstate',this.closeModal,false);
  }

  addEventHandler = () => {
    history.pushState({},'')
  }

  removeEventHandler = () => {
  }

  closeModal = (e) => {
    Modal.confirm({
      title: '确定吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => history.back(),
    });
  }

  validate = () => {
    const query = querystring.parse(this.props.location.search.substr(1));
    const { weitao, haveGoods, lifeResearch, globalFashion, ifashion, buyWorld, toutiao, zhibo } = this.state;
    const channel_name = this.getChannelName();
    if (channel_name === '有好货') {
      let bOk = true;
      this.props.form.validateFieldsAndScroll(['title'], {scroll: {alignWithTop: true}}, (err, val) => {
        if (!err) {
          if (!haveGoods.body || !haveGoods.body.length) {
            message.warn('请选择商品宝贝');
            bOk = false;
          } else if (!haveGoods.body[0].extraBanners || haveGoods.body[0].extraBanners.length < 3) {
            message.warn('请选择至少三张封面图');
            bOk = false;
          } else if (!haveGoods.bodyStruct0 || haveGoods.bodyStruct0.length < 2) {
            message.warn('请输入宝贝亮点');
            bOk = false;
          } else if (!haveGoods.duanliangdian || haveGoods.duanliangdian.length < 2) {
            message.warn('请输入至少2条短亮点');
            bOk = false;
          } else if (!haveGoods.bodyStruct || haveGoods.bodyStruct.length < 2) {
            message.warn('请编写至少2个段落');
            bOk = false;
          } else {
            for (var i = haveGoods.bodyStruct.length - 1; i >= 0; i--) {
              (!haveGoods.bodyStruct[i] || !haveGoods.bodyStruct[i].title) ? haveGoods.bodyStruct.splice(i, 1) : '';
            }
            if (haveGoods.bodyStruct.length < 2) {
              message.warn('请编写至少2个段落');
              bOk = false;
            }
          }
        } else {
          bOk = false;
        }
      })
      return bOk;
    } else if (channel_name === '生活研究所') {
      let bOk = true;
      this.props.form.validateFieldsAndScroll(['title', 'sub_title', 'summary', 'crowd'], {scroll: {alignWithTop: true}}, (err, val) => {
        if (!err) {
          if (!lifeResearch.task_desc) {
            message.warn('请填写内容');
            bOk = false;
          } else if (!lifeResearch.crowd || lifeResearch.crowd.length <= 0) {
            message.warn('请选择目标人群');
            bOk = false;
          } else if (!lifeResearch.cover_img) {
            message.warn('请上传封面图');
            bOk = false;
          }
        } else {
          bOk = false;
        }
      })
      return bOk;
    } else if (channel_name === '全球时尚') {
      let bOk = true;
      this.props.form.validateFieldsAndScroll(['title', 'crowd', 'summary'], {scroll: {alignWithTop: true}}, (err, val) => {
        if (!err) {
          if (!globalFashion.task_desc) {
            message.warn('请填写内容');
            bOk = false;
          } else if (!globalFashion.cover_img) {
            message.warn('请选择封面图');
            bOk = false;
          } else if (globalFashion.classification.length <= 0) {
            message.warn('请选择潮流热点分类');
            bOk = false;
          } else if (globalFashion.classification && globalFashion.classification.length > 1) {
            message.warn('潮流热点只能选择一个');
            bOk = false;
          }
        } else {
          bOk = false;
        }
      })
      return bOk;
    } else if (channel_name === '买遍全球') {
      let bOk = true;
      this.props.form.validateFieldsAndScroll(['title', 'sub_title', 'crowd', 'summary'], {scroll: {alignWithTop: true}}, (err, val) => {
        if (!err) {
          if (!buyWorld.task_desc) {
            message.warn('请填写内容');
            bOk = false;
          } else if (!buyWorld.cover_img) {
            message.warn('请选择封面图');
            bOk = false;
          } else if (buyWorld.classification.length <= 0) {
            message.warn('请选择分类');
            bOk = false;
          } else if (buyWorld.classification && buyWorld.classification.length > 1) {
            message.warn('只能选择一个分类标签');
            bOk = false;
          }
        } else {
          bOk = false;
        }
      })
      return bOk;
    } else if (channel_name === 'ifashion') {
      let bOk = true;
      this.props.form.validateFieldsAndScroll(['title','sub_title','summary'], {scroll: {alignWithTop: true}}, (err, val) => {
        if (!err) {
          if (!ifashion.title || !ifashion.title.replace(/\s+/g, '')) {
            message.warn('请填写标题');
            bOk = false;
          } else if (ifashion.title && ifashion.title.length > 11) {
            message.warn('标题字数不符合要求');
            bOk = false;
          } else if (!ifashion.summary) {
            message.warn('请填写推荐理由');
            bOk = false;
          } else if (ifashion.classification.length <= 0) {
            message.warn('请选择潮流热点分类');
            bOk = false;
          } else if (ifashion.classification && ifashion.classification.length > 1) {
            message.warn('潮流热点只能选择一个');
            bOk = false;
          } else {
            bOk = true;
          }
        } else {
          bOk = false;
        }
      });
      return bOk;
    } else if (channel_name === '微淘') {
      if (!weitao.title || !weitao.title.replace(/\s+/g, '')) {
        message.warn('请填写标题');
        return false;
      } else if (weitao.title && (weitao.title.length > 19 || weitao.title.length < 4)) {
        message.warn('标题字数不符合要求');
        return false;
      } else if (!weitao.summary) {
        message.warn('请填写引文');
        return false;
      } else if (weitao.summary.length > 100 || weitao.summary.length < 10) {
        message.warn('引文字数必须在10 - 100字之间');
        return false;
      } else if (!weitao.task_desc) {
        message.warn('请填写内容');
        return false;
      } else if (!weitao.cover_img) {
        message.warn('请选择封面图');
        return false;
      } else {
        return true;
      }
    } else if (channel_name === '淘宝头条') {
      if (!toutiao.title || !toutiao.title.replace(/\s+/g, '')) {
        message.warn('请填写标题');
        return false;
      } else if (toutiao.title && (toutiao.title.length > 19 || toutiao.title.length < 4)) {
        message.warn('标题字数不符合要求');
        return false;
      } else if (!toutiao.summary) {
        message.warn('请填写引文');
        return false;
      } else if (toutiao.summary.length > 100 || toutiao.summary.length < 10) {
        message.warn('引文字数必须在10 - 100字之间');
        return false;
      } else if (!toutiao.task_desc) {
        message.warn('请填写内容');
        return false;
      } else if (!toutiao.cover_img) {
        message.warn('请选择封面图');
        return false;
      } else {
        return true;
      }
    } else if (channel_name === '直播脚本') {
      if (!zhibo.title || !zhibo.title.replace(/\s+/g, '')) {
        message.warn('请填写标题');
        return false;
      } else if (zhibo.title && zhibo.title.length > 19) {
        message.warn('标题字数不符合要求');
        return false;
      } else if (!zhibo.task_desc) {
        message.warn('请填写内容');
        return false;
      } else {
        return true;
      }
    }
  }
  handleSubmitTask = () => {
    if (this.validate()) {
      const query = querystring.parse(this.props.location.search.substr(1));
      const { currentUser, teamUser, operation, formData } = this.props;
      const { haveGoods, approver_id, lifeResearch, globalFashion, ifashion, buyWorld, weitao, toutiao, zhibo } = this.state;
      const title = haveGoods.title || lifeResearch.title || globalFashion.title || ifashion.title || buyWorld.title || weitao.title || toutiao.title || zhibo.title;
      let name;
      if (operation === 'create') {
        name = title;
      } else if (operation === 'edit') {
        if (formData.source === SOURCE.deliver || formData.source === SOURCE.create) {
          name = title;
        }
      }
      const values = {};
      const channel_name = this.getChannelName();
      let auctionIds = [];
      if (channel_name === '有好货') {
        values.haveGoods = this.state.haveGoods;
      } else if (channel_name === '生活研究所') {
        values.lifeResearch = this.state.lifeResearch;
        auctionIds = this.extractAuctionIds(values.lifeResearch.task_desc);
      } else if (channel_name === '全球时尚') {
        values.globalFashion = this.state.globalFashion;
        auctionIds = this.extractAuctionIds(values.globalFashion.task_desc);
      } else if (channel_name === 'ifashion') {
        values.ifashion = this.state.ifashion;
      } else if (channel_name === '买遍全球') {
        values.buyWorld = this.state.buyWorld;
        auctionIds = this.extractAuctionIds(values.buyWorld.task_desc);
      } else if (channel_name === '微淘') {
        values.weitao = this.state.weitao;
        auctionIds = this.extractAuctionIds(values.weitao.task_desc);
      } else if (channel_name === '淘宝头条') {
        values.toutiao = this.state.toutiao;
        auctionIds = this.extractAuctionIds(values.toutiao.task_desc);
      } else if (channel_name === '直播脚本') {
        values.zhibo = this.state.zhibo;
      }
      if (query._id) {
        this.props.dispatch({
          type: 'task/update',
          payload: {
            ...values,
            auctionIds,
            _id: query._id,
            approve_status: TASK_APPROVE_STATUS.taken,
            publisher_id: currentUser._id,
            taker_id: currentUser._id,
            take_time: new Date(),
            name: name,
          },
          callback: (result1) => {
            if (result1.error) {
              message.error(result1.msg);
            } else {
              this.handleHandin(query._id);
            }
          }
        });
      } else {
        const payload = {
          source: SOURCE.deliver,
          name: name,
          project_id: query.project_id,
          creator_id: currentUser._id,
          auctionIds,
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
                  ...values,
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
                    this.handleHandin(result.task._id);
                  }
                }
              });
            }
          },
        });
      }
    }
      
  }
  
  handleSpecifyApprover = () => {
    const { dispatch } = this.props;
    const { approver_id } = this.state;
    this.props.form.validateFields(['approver', 'approver2'], (err, values) => {
      if (!err) {
        if (approver_id.first) {
          const approvers = [ [approver_id.first] ];
          if(approver_id.second){
            approvers.push([approver_id.second]);
          }
          this.setState({ modalVisible: false });
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
  extractAuctionIds = (task_desc) => {
    const auctionIds = [];
    const result = $(task_desc);
    result.each((index, e) => {
      if (e.children && e.children[0] && e.children[0].tagName === 'A' && $(e.children[0]).attr('_data')) {
        const _data = $(e.children[0]).attr('_data');
        const data = JSON.parse(decodeURIComponent(_data));
        console.log(data);
        auctionIds.push(Number(data.data.itemId || data.data.spuId));
      }
    });
    return auctionIds;
  }
  handleSave = () => {
    const query = querystring.parse(this.props.location.search.substr(1));
    const { currentUser, teamUser, operation, formData } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(err);
      console.log(values);
      if (!err) {
        const form = Object.assign([], this.state.form);
        Object.keys(values).forEach(item => {
          const index = this.state.form.findIndex(item1 => item1.name === item);
          if (form[index].name === 'crowdId') {
            form[index].props.value = (values[item] && values[item][1]) ? values[item][1] : '';
          } else {
            form[index].props.value = values[item];
          }
        });
        const title = this.state.form.find(item => item.name === 'title').props.value;
        let name;
        if (operation === 'create') {
          name = title;
        } else if (operation === 'edit') {
          if (formData.source === SOURCE.deliver || formData.source === SOURCE.create || formData.source === SOURCE.pass) {
            name = title;
          }
        }
        const channel_name = this.getChannelName();
        let auctionIds = [];
        auctionIds = this.extractAuctionIds('');
        if (!title.trim()) {
          message.warn('请输入标题');
        } else {
          this.setState({
            saveLoading: true,
          })
          if (query._id) {
            this.props.dispatch({
              type: 'task/update',
              payload: {
                form,
                auctionIds,
                _id: query._id,
                name: name,
              },
              callback: (result) => {
                if (result.error) {
                  message.error(result.msg);
                } else {
                  this.setState({
                    saveLoading: false,
                  })
                  message.success(result.msg);
                }
              }
            });
          } else {
            if (query.project_id) {
              this.props.dispatch({
                type: 'task/add',
                payload: {
                  form,
                  auctionIds,
                  source: SOURCE.deliver,
                  name: name,
                  approve_status: TASK_APPROVE_STATUS.taken,
                  channel_name: channel_name === '直播脚本' ? '' : channel_name,
                  task_type: channel_name === '直播脚本' ? 3 : 1,
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
                  }
                },
              });
            } else {
              this.props.dispatch({
                type: 'task/addByWriter',
                payload: {
                  form,
                  auctionIds,
                  source: SOURCE.create,
                  name: name,
                  approve_status: TASK_APPROVE_STATUS.taken,
                  channel_name: channel_name === '直播脚本' ? '' : channel_name,
                  task_type: channel_name === '直播脚本' ? 3 : 1,
                  team_id: teamUser ? teamUser.team_id : null,
                  publisher_id: currentUser._id,
                  publish_time: new Date(),
                  taker_id: currentUser._id,
                  take_time: new Date(),
                  creator_id: currentUser._id,
                  daren_id: currentUser._id,
                  daren_time: new Date(),
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
                  }
                }
              });
            }
          }
        }
        this.setState({ form });
      }
    });
    
  }
  handleSubmit = (approvers) => {
    const query = querystring.parse(this.props.location.search.substr(1));
    const { currentUser, teamUser, operation, formData } = this.props;
    const { haveGoods, approver_id, lifeResearch, globalFashion, ifashion, buyWorld, weitao, toutiao, zhibo } = this.state;
    const title = haveGoods.title || lifeResearch.title || globalFashion.title || ifashion.title || buyWorld.title || weitao.title || toutiao.title || zhibo.title;
    let name;
    if (operation === 'create') {
      name = title;
    } else if (operation === 'edit') {
      if (formData.source === SOURCE.deliver || formData.source === SOURCE.create) {
        name = title;
      }
    }
    const values = {};
    const channel_name = this.getChannelName();
    let auctionIds = [];
    if (channel_name === '有好货') {
      values.haveGoods = this.state.haveGoods;
    } else if (channel_name === '生活研究所') {
      values.lifeResearch = this.state.lifeResearch;
      auctionIds = this.extractAuctionIds(values.lifeResearch.task_desc);
    } else if (channel_name === '全球时尚') {
      values.globalFashion = this.state.globalFashion;
      auctionIds = this.extractAuctionIds(values.globalFashion.task_desc);
    } else if (channel_name === 'ifashion') {
      values.ifashion = this.state.ifashion;
    } else if (channel_name === '买遍全球') {
      values.buyWorld = this.state.buyWorld;
      auctionIds = this.extractAuctionIds(values.buyWorld.task_desc);
    } else if (channel_name === '微淘') {
      values.weitao = this.state.weitao;
      auctionIds = this.extractAuctionIds(values.weitao.task_desc);
    } else if (channel_name === '淘宝头条') {
      values.toutiao = this.state.toutiao;
      auctionIds = this.extractAuctionIds(values.toutiao.task_desc);
    } else if (channel_name === '直播脚本') {
      values.zhibo = this.state.zhibo;
    }
    if (query._id) {
      this.props.dispatch({
        type: 'task/update',
        payload: {
          _id: query._id,
          take_time: new Date(),
          current_approvers: approvers[0],
          approvers: approvers,
          name: name,
          auctionIds,
          ...values,
        },
        callback: (result) => {
          if (result.error) {
            message.error(result.msg);
          } else {
            this.handleHandin(query._id);
          }
        },
      });
    } else {
      this.props.dispatch({
        type: 'task/addByWriter',
        payload: {
          ...values,
          auctionIds,
          source: SOURCE.create,
          name: name,
          approve_status: TASK_APPROVE_STATUS.taken,
          channel_name: channel_name === '直播脚本' ? '' : channel_name,
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
          current_approvers: approvers[0],
          approvers: approvers,
        },
        callback: (result) => {
          if (result.error) {
            message.error(result.msg);
          } else {
            this.handleHandin(result.task._id);
          }
        }
      });
    }
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
    if (this.validate()) {
      this.setState({ approveModalVisible: true, });
    }
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
  getChannelName = () => {
    const query = querystring.parse(this.props.location.search.substr(1));
    const { operation, formData } = this.props;
    if (operation === 'create') {
      return query.channel_name;
    } else if (operation === 'edit') {
      if (formData.channel_name) {
        return formData.channel_name;
      } else if (formData.task_type === 3) {
        return '直播脚本';
      }
    } else if (operation === 'view') {
      if (formData.channel_name) {
        return formData.channel_name;
      } else if (formData.task_type === 3) {
        return '直播脚本';
      }
    }
    return formData.channel_name;
  }
  handleChangePushDaren = (value) => {
    this.handleChange('pushDaren', value);
  }
  handleChange = (name, value) => {
    const index = this.state.form.findIndex(item => item.name === name);
    if (index >= 0) {
      const form = Object.assign([], this.state.form);
      form[index].props.value = value;
      this.setState({ form });
    }
  }
  render() {
    const { form: { getFieldDecorator }, operation, formData } = this.props;
    const { approveModalVisible, haveGoods, suggestionApproves } = this.state;
    const query = querystring.parse(this.props.location.search.substr(1));
    const writeTips = (
      <div className={styles.taskComment} style={{ width: 200, marginRight: operation === 'view' ? 130 : 0 }}>
        <p className={styles.titleDefult}>爆文写作参考</p>
        <ul className={styles.tPrompt}>
          <li>1. 从小知识小技巧着手. 淘宝头条讲了个概念叫”随手有用书”,即生活中有很多一般人不注意的小知识小技巧. 比如大部分人都晾错内衣, 尤其是第二种方式这条,结合着推内衣这个点很不错.</li>
          <li>2. 从风格化, 场景化着手入手, 即内容针对目标人群.想一想目标针对用户有什么样的特点? 会对什么样的内容感兴趣?要去倒推.</li>
          <li>3. 从时下热点,八卦,新闻等角度着手.反正总之就是一句话:要用户产生觉得“有用”“感兴趣”等特别的感觉.</li>
        </ul>
      </div>
    );
    const channel_name = this.getChannelName();
    let form = [];
    const pushDaren = this.state.form.find(item => item.name === 'pushDaren');
    const coverCount = this.state.form.find(item => item.name === 'coverCount');
    const itemSpuOption = this.state.form.find(item => item.name === 'itemSpuOption');
    const tempForm = [...this.state.form];
    if (itemSpuOption && itemSpuOption.props.value === 'spu') {
      tempForm[1] = {
        "className": "creator-single-item-center creator-no-label",
        "component": "CreatorAddSpu",
        "label": "商品SPU",
        "name": "bodySpu",
        "props": {
          "enableExtraBanner": true,
          "activityId": 414,
          "min": 1,
          "max": 1,
          "addImageProps": {
            "pixFilter": "500x500"
          },
          "triggerTips": "添加一个产品",
          "className": "creator-single-item-center creator-no-label",
          "label": "商品SPU",
          "value": []
        },
        "rules": [{
          "min": 1,
          "type": "array",
          "message": "或上传1个产品"
        }, {
          "max": 1,
          "type": "array",
          "message": "最多允许1个"
        }],
        "updateOnChange": "true"
      };
    }
    tempForm.forEach((item, index) => {
      if (item.component === 'Input') {
        form.push(<NicaiForm.Input key={index} form={this.props.form} name={item.name} props={item.props} rules={item.rules} operation={operation} />);
      } else if (item.component === 'Editor') {
        form.push(<NicaiForm.Editor key={index} form={this.props.form} name={item.name} props={item.props} rules={item.rules} onChange={value => this.handleChange(item.name, value)} operation={operation} />);
      } else if (item.component === 'CascaderSelect') {
        form.push(<NicaiForm.CascaderSelect key={index} form={this.props.form} name={item.name} props={item.props} rules={item.rules} operation={operation} />);
      } else if (item.component === 'CreatorAddImage') {
        let tempProps = {...item.props};
        let tempRules = item.rules;
        if (coverCount) {
          tempProps.min = Number(coverCount.props.value);
          tempProps.max = Number(coverCount.props.value);
        }
        if (coverCount && Number(coverCount.props.value) === 3) {
          tempRules = [{
            "min": 3,
            "type": "array",
            "message": "至少要有3个"
          }, {
            "max": 3,
            "type": "array",
            "message": "最多允许3个"
          }];
        }
        form.push(<NicaiForm.CreatorAddImage key={index} form={this.props.form} name={item.name} props={tempProps} rules={tempRules} onChange={value => this.handleChange(item.name, value)} operation={operation} />);
      } else if (item.component === 'RadioGroup') {
        form.push(<NicaiForm.RadioGroup key={index} form={this.props.form} name={item.name} props={item.props} rules={item.rules} onChange={value => this.handleChange(item.name, value)} operation={operation} />);
      } else if (item.component === 'AddLink') {
        form.push(<NicaiForm.AddLink key={index} form={this.props.form} name={item.name} props={item.props} rules={item.rules} onChange={value => this.handleChange(item.name, value)} operation={operation} />);
      } else if (item.component === 'CreatorAddItem') {
        form.push(<NicaiForm.CreatorAddItem key={index} form={this.props.form} name={item.name} props={item.props} rules={item.rules} onChange={value => this.handleChange(item.name, value)} operation={operation} />);
      } else if (item.component === 'CreatorAddSpu') {
        form.push(<NicaiForm.CreatorAddSpu key={index} form={this.props.form} name={item.name} props={item.props} rules={item.rules} onChange={value => this.handleChange(item.name, value)} operation={operation} />);
      } else if (item.component === 'AddTag') {
        form.push(<NicaiForm.AddTag key={index} form={this.props.form} name={item.name} props={item.props} rules={item.rules} onChange={value => this.handleChange(item.name, value)} operation={operation} />);
      } else if (item.component === 'TagPicker') {
        form.push(<NicaiForm.TagPicker key={index} form={this.props.form} name={item.name} props={item.props} rules={item.rules} onChange={value => this.handleChange(item.name, value)} operation={operation} />);
      } else if (item.component === 'AnchorImageList') {
        form.push(<NicaiForm.AnchorImageList key={index} form={this.props.form} name={item.name} props={item.props} rules={item.rules} onChange={value => this.handleChange(item.name, value)} operation={operation} />);
      }
    });
    
    let formRight = null;
    if (operation === 'create') {
      formRight = writeTips;
    } else if (operation === 'edit') {
      if (this.props.formData.approve_status === TASK_APPROVE_STATUS.rejected) {
        formRight = (
          <div className={styles.taskComment}>
            <Annotation viewStatus="view" value={formData.approve_notes} />
          </div>
        );
      } else if (this.props.formData.approve_status === TASK_APPROVE_STATUS.taken) {
        formRight = writeTips;
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
      }
    }
    let outerWidth = 1000;
    if (channel_name === '有好货') {
      outerWidth = 730;
    } else if (formRight === writeTips) {
      outerWidth = 868;
    } else {
      outerWidth = 1000;
    }
    return (
      <Card bordered={false} title="" style={{ background: 'none', paddingBottom: 60 }} bodyStyle={{ padding: 0 }}>
        <div className={styles.taskOuterBox} style={{ width: outerWidth }} ref="taskOuterBox">
          <div style={{ width: channel_name === '有好货' ? 375 : 650 }}>
            <p className={styles.titleDefult}>内容创作</p>
            <Card bordered={false} title="" bodyStyle={{ padding: '20px 20px 60px' }}>
              {form}
            </Card>
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
                  <Button id="subButton">提交审核</Button>
                </Popconfirm>
              </Tooltip>
              :
              <Tooltip placement="top" title="提交到平台审核方进行审核" getPopupContainer={() => document.getElementById('subButton1')}>
                <Button id="subButton1" onClick={this.handleShowSpecifyApproversModal}>提交审核</Button>
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
          onOk={this.handleSpecifyApprover}
          onCancel={() => {this.setState({ approveModalVisible: false })}}
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
