import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import querystring from 'querystring';
import { Card, Button, Popconfirm, message, Modal, Form, Select, Input, Tooltip, Icon } from 'antd';
import $ from 'jquery';
import Annotation from '../../components/Annotation';
import WeitaoForm from '../../components/Forms/WeitaoForm';
import ZhiboForm from '../../components/Forms/ZhiboForm';
import GoodProductionForm from '../../components/Forms/GoodProductionForm';
import LifeInstituteForm from '../../components/Forms/LifeInstituteForm';
import GlobalFashionForm from '../../components/Forms/GlobalFashionForm';
import IfashionForm from '../../components/Forms/IfashionForm';

import MerchantTag from '../../components/Forms/MerchantTag';
import { TASK_APPROVE_STATUS, SOURCE } from '../../constants';
import TaskChat from '../../components/TaskChat';
import styles from './TableList.less';

import NicaiForm from '../../components/Form/index.js';

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
    task: {
      crowd: [],
      title: '',
      task_desc: '',
      cover_img: '',
    },
    haveGoodsTask: {
      body: [],
      title: '', // '任务标题',
      bodyStruct: [],
      bodyStruct0: [],
      duanliangdian: [], // ['']
      crowdId: '',
    },
    lifeResearch: {
      title: '', // '任务标题',
      sub_title: '', // '副标题',
      task_desc: '', // '写手提交的稿子内容',
      cover_img: '',//封面
      crowd: [], // 目标人群
      summary: '', // 摘要
    },
    globalFashion: {
      title: '', // '任务标题',
      task_desc: '', // '写手提交的稿子内容',
      cover_img: '',//封面
      crowd: [], // 目标人群
      classification: [], // 分类
      end_link: '', //文末链接
      end_text: '',
    },
    ifashion: {
      title: '', // '任务标题',
      summary: '', // 推荐理由
      cover_img: '',//封面
      crowd: [], // 目标人群
      classification: [], // 分类
      tags: [], // 标签
    },
    buyWorld: {
      title: '', // '任务标题',
      sub_title: '', // '副标题',
      task_desc: '', // '写手提交的稿子内容',
      cover_img: '',//封面
      classification: [], // 分类
      end_link: '', //文末链接
      end_text: '',
    },
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
    grade: 0,
    grades: [],
  }
  componentDidMount() {
    // window.onbeforeunload = () => {
    //   return "确认离开页面?";
    // }
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
              title: result.task.title,
              task_desc: result.task.task_desc,
              cover_img: result.task.cover_img,
            },
            haveGoodsTask: { ...result.task.haveGoods },
            lifeResearch: result.task.lifeResearch,
            globalFashion: result.task.globalFashion,
            ifashion: result.task.ifashion,
            buyWorld: result.task.buyWorld,
            grade: result.task.grade,
            grades: result.task.grades && result.task.grades.length ? result.task.grades : [...this.state.grades],
          });
        }
      });
    }
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: false,
    });
    this.props.dispatch({
      type: 'task/clearFormData'
    });
  }


  validate = () => {
    const query = querystring.parse(this.props.location.search.substr(1));
    const { task, haveGoodsTask, lifeResearch, globalFashion, ifashion, buyWorld } = this.state;
    const channel_name = this.getChannelName();
    if (channel_name === '有好货') {
      let bOk = true;
      this.props.form.validateFieldsAndScroll(['title'], {scroll: {alignWithTop: true}}, (err, val) => {
        if (!err) {
          if (!haveGoodsTask.body || !haveGoodsTask.body.length) {
            message.warn('请选择商品宝贝');
            bOk = false;
          } else if (!haveGoodsTask.body[0].extraBanners || haveGoodsTask.body[0].extraBanners.length < 3) {
            message.warn('请选择至少三张封面图');
            bOk = false;
          } else if (!haveGoodsTask.bodyStruct0 || haveGoodsTask.bodyStruct0.length < 2) {
            message.warn('请输入宝贝亮点');
            bOk = false;
          } else if (!haveGoodsTask.duanliangdian || haveGoodsTask.duanliangdian.length < 2) {
            message.warn('请输入至少2条短亮点');
            bOk = false;
          } else if (!haveGoodsTask.bodyStruct || haveGoodsTask.bodyStruct.length < 2) {
            message.warn('请编写至少2个段落');
            bOk = false;
          } else {
            for (var i = haveGoodsTask.bodyStruct.length - 1; i >= 0; i--) {
              !haveGoodsTask.bodyStruct[i].title ? haveGoodsTask.bodyStruct.splice(i, 1) : '';
            }
            if (haveGoodsTask.bodyStruct.length < 2) {
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
      console.log(2)
      let bOk = true;
      this.props.form.validateFieldsAndScroll(['title', 'crowd'], {scroll: {alignWithTop: true}}, (err, val) => {
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
      console.log(1)
      let bOk = true;
      this.props.form.validateFieldsAndScroll(['title', 'sub_title', 'crowd'], {scroll: {alignWithTop: true}}, (err, val) => {
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
    } else {
      if (!task.title || !task.title.replace(/\s+/g, '')) {
        message.warn('请填写标题');
        return false;
      } else if (task.title && task.title.length > 19) {
        message.warn('标题字数不符合要求');
        return false;
      } else if (!task.task_desc) {
        message.warn('请填写内容');
        return false;
      } else if (!task.cover_img && channel_name !== '直播脚本') {
        message.warn('请选择封面图');
        return false;
      } else {
        return true;
      }
    }
  }
  handleSubmitTask = () => {
    if (this.validate()) {
      const { currentUser, teamUser, operation, formData } = this.props;
      const query = querystring.parse(this.props.location.search.substr(1));
      let name;
      if (operation === 'create') {
        name = this.state.task.title || this.state.haveGoodsTask.title || this.state.lifeResearch.title || this.state.globalFashion.title || this.state.ifashion.title || this.state.buyWorld.title;
      } else if (operation === 'edit') {
        if (formData.source === SOURCE.deliver || formData.source === SOURCE.create) {
          name = this.state.task.title || this.state.haveGoodsTask.title || this.state.lifeResearch.title || this.state.globalFashion.title || this.state.ifashion.title || this.state.buyWorld.title;
        }
      }
      const values = {
        ...this.state.task,
      };
      const channel_name = this.getChannelName();
      if (channel_name === '有好货') {
        values.haveGoods = this.state.haveGoodsTask;
      } else if (channel_name === '生活研究所') {
        values.lifeResearch = this.state.lifeResearch;
      } else if (channel_name === '全球时尚') {
        values.globalFashion = this.state.globalFashion;
      } else if (channel_name === 'ifashion') {
        values.ifashion = this.state.ifashion;
      } else if (channel_name === '买遍全球') {
        values.buyWorld = this.state.buyWorld;
      }
      if (query._id) {
        this.props.dispatch({
          type: 'task/update',
          payload: {
            ...values,
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
  handleChange = (task) => {
    this.setState({ task: { ...this.state.task, ...task } });
  }
  handleChangeGoods = (task) => {
    this.setState({ haveGoodsTask: { ...this.state.haveGoodsTask, ...task } });
  }
  handleChangeLife = (task) => {
    this.setState({ lifeResearch: { ...this.state.lifeResearch, ...task } });
  }
  handleChangeGlobal = (task) => {
    this.setState({ globalFashion: { ...this.state.globalFashion, ...task } });
  }
  handleChangeBuyWorld = (task) => {
    this.setState({ buyWorld: { ...this.state.buyWorld, ...task } });
  }
  handleChangeIfashion = (task) => {
    this.setState({ ifashion: { ...this.state.ifashion, ...task } });
  }
  handleModalVisible = (flag) => {
    this.setState({
      approveModalVisible: !!flag,
    });
  }
  
  handleSave = () => {
    const query = querystring.parse(this.props.location.search.substr(1));
    const { currentUser, teamUser, operation, formData } = this.props;
    const { task, haveGoodsTask, approver_id, lifeResearch, globalFashion, ifashion, buyWorld } = this.state;
    const title = this.state.task.title || this.state.haveGoodsTask.title || this.state.lifeResearch.title || this.state.globalFashion.title || this.state.ifashion.title || this.state.buyWorld.title;
    let name;
    if (operation === 'create') {
      name = title;
    } else if (operation === 'edit') {
      if (formData.source === SOURCE.deliver || formData.source === SOURCE.create) {
        name = title;
      }
    }
    const values = {
      ...this.state.task,
    };
    const channel_name = this.getChannelName();
    if (channel_name === '有好货') {
      values.haveGoods = this.state.haveGoodsTask;
    } else if (channel_name === '生活研究所') {
      values.lifeResearch = this.state.lifeResearch;
    } else if (channel_name === '全球时尚') {
      values.globalFashion = this.state.globalFashion;
    } else if (channel_name === 'ifashion') {
      values.ifashion = this.state.ifashion;
    } else if (channel_name === '买遍全球') {
      values.buyWorld = this.state.buyWorld;
    }
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
            ...values,
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
              ...values,
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
              ...values,
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
  }
  handleSubmit = (approvers) => {
    const query = querystring.parse(this.props.location.search.substr(1));
    const { currentUser, teamUser, operation, formData } = this.props;
    const { task, haveGoodsTask, approver_id, lifeResearch, globalFashion, ifashion, buyWorld } = this.state;
    let name;
    if (operation === 'create') {
      name = this.state.task.title || this.state.haveGoodsTask.title || this.state.lifeResearch.title || this.state.globalFashion.title || this.state.ifashion.title || this.state.buyWorld.title;
    } else if (operation === 'edit') {
      if (formData.source === SOURCE.deliver || formData.source === SOURCE.create) {
        name = this.state.task.title || this.state.haveGoodsTask.title || this.state.lifeResearch.title || this.state.globalFashion.title || this.state.ifashion.title || this.state.buyWorld.title;
      }
    }
    const values = {
      ...this.state.task,
    };
    const channel_name = this.getChannelName();
    if (channel_name === '有好货') {
      values.haveGoods = this.state.haveGoodsTask;
    } else if (channel_name === '生活研究所') {
      values.lifeResearch = this.state.lifeResearch;
    } else if (channel_name === '全球时尚') {
      values.globalFashion = this.state.globalFashion;
    } else if (channel_name === 'ifashion') {
      values.ifashion = this.state.ifashion;
    } else if (channel_name === '买遍全球') {
      values.buyWorld = this.state.buyWorld;
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
        }
        if (callback) callback(result);
      }
    });
  }
  handleShowSpecifyApproversModal = () => {
    const query = querystring.parse(this.props.location.search.substr(1));
    const { task } = this.state;
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
      } else {
        return '直播脚本';
      }
    } else if (operation === 'view') {
      if (formData.channel_name) {
        return formData.channel_name;
      } else {
        return '直播脚本';
      }
    }
    return formData.channel_name;
  }
  render() {
    const { form: { getFieldDecorator }, operation, formData } = this.props;
    const { approveModalVisible, task, haveGoodsTask, suggestionApproves } = this.state;
    const query = querystring.parse(this.props.location.search.substr(1));
    const channel_name = this.getChannelName();
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

    return (
      <Card bordered={false} title="" style={{ background: 'none' }} bodyStyle={{ padding: 0 }}>
        <div className={styles.taskOuterBox} style={{ width: channel_name === '有好货' ? 730 : 1000 }} ref="taskOuterBox">
          <div style={{ width: channel_name === '有好货' ? 375 : 650 }}>
            { (channel_name === '淘宝头条' || channel_name === '微淘') &&
              <WeitaoForm
                form={this.props.form}
                role="writer"
                operation={operation}
                formData={task}
                onChange={this.handleChange}
              />
            }
            { (query.channel_name === '直播脚本' || formData.task_type === 3) &&
              <ZhiboForm
                role="writer"
                operation={operation}
                formData={task}
                onChange={this.handleChange}
              />
            }
            { channel_name === '有好货' &&
              <GoodProductionForm
                form={this.props.form}
                role="writer"
                operation={operation}
                formData={haveGoodsTask}
                onChange={this.handleChangeGoods}
              />
            }
            { channel_name === '生活研究所' &&
              <LifeInstituteForm
                form={this.props.form}
                role="writer"
                operation={operation}
                formData={this.state.lifeResearch}
                onChange={this.handleChangeLife}
              />
            }
            { channel_name === '全球时尚' &&
              <GlobalFashionForm
                channel_name={channel_name}
                form={this.props.form}
                role="writer"
                operation={operation}
                formData={this.state.globalFashion}
                onChange={this.handleChangeGlobal}
              />
            }
            { channel_name === '买遍全球' &&
              <GlobalFashionForm
                channel_name={channel_name}
                form={this.props.form}
                role="writer"
                operation={operation}
                formData={this.state.buyWorld}
                onChange={this.handleChangeBuyWorld}
              />
            }
            { channel_name === 'ifashion' &&
              <IfashionForm
                form={this.props.form}
                role="writer"
                operation={operation}
                formData={this.state.ifashion}
                onChange={this.handleChangeIfashion}
              />
            }
            { channel_name === '测试' &&
              <NicaiForm 
                form={this.props.form}
              />
            }
          </div>
          {formRight}
          { operation !== 'view' && <div className={styles.submitBox}>
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
            { formData.grade > 0 && (formData.approve_status === TASK_APPROVE_STATUS.rejected || formData.approve_status === TASK_APPROVE_STATUS.passed) &&
              <dl className={styles.showGradeBox}>
                <dt>分数</dt>
              {formData.grades && formData.grades.map((item) => 
                <dd key={item.name}><span>{item.name}：</span><span>{item.value}</span></dd>)
              }
              </dl>
            }
          </div>}
          { operation === 'view' && formData.grade > 0 && <div className={styles.submitBox}>
            <div>
              <dl className={styles.showGradeBox}>
                <dt>分数</dt>
              {formData.grades && formData.grades.map((item) => 
                <dd key={item.name}><span>{item.name}：</span><span>{item.value}</span></dd>)
              }
              </dl>
            </div>
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
