import React, { PureComponent } from 'react';
import { connect } from 'dva';
import querystring from 'querystring';
import $ from 'jquery';
import { Card, Button, message, Popover, Slider, Popconfirm, Form } from 'antd';
import { RIGHTS, APPROVE_ROLES, ROLES, TASK_APPROVE_STATUS } from '../../constants';
import { routerRedux } from 'dva/router';
import Editor from '../../components/Editor';
import TaskChat from '../../components/TaskChat';
import ApproveLog from '../../components/ApproveLog';
import styles from './TableList.less';
import WeitaoForm from '../../components/Forms/WeitaoForm';
import ZhiboForm from '../../components/Forms/ZhiboForm';
import GoodProductionForm from '../../components/Forms/GoodProductionForm';
import LifeInstituteForm from '../../components/Forms/LifeInstituteForm';
import GlobalFashionForm from '../../components/Forms/GlobalFashionForm';
import IfashionForm from '../../components/Forms/IfashionForm';
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
    task: {
      crowd: [],
      title: '',
      task_desc: '',
      cover_img: '',
    },
    weitao: {
      crowd: [],
      title: '',
      summary: '',
      task_desc: '',
      cover_img: '',
    },
    toutiao: {
      title: '', // '任务标题',
      summary: '',
      task_desc: '', // '写手提交的稿子内容',
      cover_img: '',
      crowd: [], // 目标人群
    },
    zhibo: {
      title: '', // '任务标题',
      task_desc: '', // '写手提交的稿子内容',
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
      summary: '', // 目标人群
    },
    globalFashion: {
      title: '', // '任务标题',
      summary: '',
      task_desc: '', // '写手提交的稿子内容',
      cover_img: '',//封面
      crowd: [], // 目标人群
      classification: [], // 分类
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
      summary: '',
      sub_title: '', // '副标题',
      task_desc: '', // '写手提交的稿子内容',
      cover_img: '',//封面
      classification: [], // 分类
    },
    approve_status: 0,
    approve_notes: [],
  }
  componentDidMount() {
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch({
      type: 'task/fetchTask',
      payload: query,
      callback: (result) => {
        if (!result.error) {
          if (result.task.title) {
            if (result.task.channel_name === '微淘' ) {
              this.setState({
                weitao: {
                  crowd: result.task.crowd,
                  title: result.task.title,
                  task_desc: result.task.task_desc,
                  cover_img: result.task.cover_img,
                }
              });
            } else if (result.task.channel_name === '淘宝头条') {
              this.setState({
                toutiao: {
                  crowd: result.task.crowd,
                  title: result.task.title,
                  task_desc: result.task.task_desc,
                  cover_img: result.task.cover_img,
                }
              });
            } else if (result.task.task_type === 3) {
              this.setState({
                toutiao: {
                  title: result.task.title,
                  task_desc: result.task.task_desc,
                }
              });
            }
            this.props.dispatch({
              type: 'task/update',
              payload: {
                ...this.state.task,
                _id: query._id,
              }
            });
          } else {
            this.setState({
              weitao: result.task.weitao,
              toutiao: result.task.toutiao,
              zhibo: result.task.zhibo,
              haveGoodsTask: result.task.haveGoods,
              lifeResearch: result.task.lifeResearch,
              globalFashion: result.task.globalFashion,
              ifashion: result.task.ifashion,
              buyWorld: result.task.buyWorld,
              approve_status: result.task.approve_status,
              approve_notes: result.task.approve_notes || [],
            });
          }
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
  handleChangeWeitao = (task) => {
    this.setState({ weitao: { ...this.state.weitao, ...task } });
  }
  handleChangeToutiao = (task) => {
    this.setState({ toutiao: { ...this.state.toutiao, ...task } });
  }
  handleChangeZhibo = (task) => {
    this.setState({ zhibo: { ...this.state.zhibo, ...task } });
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
  handleSave = () => {
    const { formData } = this.props;
    const { approve_status, approve_notes, haveGoodsTask, lifeResearch, globalFashion, ifashion, buyWorld, weitao, toutiao, zhibo } = this.state;
    const query = querystring.parse(this.props.location.search.substr(1));
    const name = haveGoodsTask.title || lifeResearch.title || globalFashion.title || ifashion.title || buyWorld.title || weitao.title || toutiao.title || zhibo.title || '';
    if (name.trim()) {
      const values = {
        _id: query._id,
        approve_notes: approve_notes,
      }
      if (formData.channel_name === '有好货') {
        values.haveGoods = this.state.haveGoodsTask;
      } else if (formData.channel_name === '生活研究所') {
        values.lifeResearch = this.state.lifeResearch;
      } else if (formData.channel_name === '全球时尚') {
        values.globalFashion = this.state.globalFashion;
      } else if (formData.channel_name === 'ifashion') {
        values.ifashion = this.state.ifashion;
      } else if (formData.channel_name === '买遍全球') {
        values.buyWorld = this.state.buyWorld;
      } else if (formData.channel_name === '微淘') {
        values.weitao = this.state.weitao;
      } else if (formData.channel_name === '淘宝头条') {
        values.toutiao = this.state.toutiao;
      } else if (formData.channel_name === '直播脚本') {
        values.zhibo = this.state.zhibo;
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
            message.success(result.msg);
          }
        }
      });
    } else {
      message.warn('请输入标题');
    }
  }
  validate = () => {
    const { formData } = this.props;
    const { haveGoodsTask, lifeResearch, globalFashion, ifashion, buyWorld, weitao, toutiao, zhibo } = this.state;
    if (formData.channel_name === '有好货') {
      let bOk = true;
      this.props.form.validateFieldsAndScroll(['title'], (err, val) => {
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
    } else if (formData.channel_name === '生活研究所') {
      let bOk = true;
      this.props.form.validateFields(['title', 'sub_title', 'summary'], (err, val) => {
        if (!err) {
          if (!lifeResearch.task_desc) {
            message.warn('请填写内容');
            bOk = false;
          } else if (!lifeResearch.crowd) {
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
    } else if (formData.channel_name === '全球时尚') {
      let bOk = true;
      this.props.form.validateFieldsAndScroll(['title', 'sub_title', 'crowd', 'summary'], (err, val) => {
        if (!err) {
          if (!globalFashion.task_desc) {
            message.warn('请填写内容');
            bOk = false;
          } else if (!globalFashion.cover_img) {
            message.warn('请选择封面图');
            bOk = false;
          } else if (globalFashion.classification.length <= 0) {
            message.warn('请选择分类');
            bOk = false;
          } else if (globalFashion.classification && globalFashion.classification.length > 1) {
            message.warn('只能选择一个分类标签');
            bOk = false;
          }
        }
      })
      return bOk;
    } else if (formData.channel_name === '买遍全球') {
      let bOk = true;
      this.props.form.validateFieldsAndScroll(['title', 'sub_title', 'crowd', 'summary'], (err, val) => {
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
    } else if (formData.channel_name === 'ifashion') {
      let bOk = true;
      this.props.form.validateFields(['title', 'sub_title', 'summary'], (err, val) => {
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
    } else if (formData.channel_name === '微淘') {
      if (!weitao.title || !weitao.title.replace(/\s+/g, '')) {
        message.warn('请填写标题');
        return false;
      } else if (weitao.title && (weitao.title.length > 19 || weitao.title.length < 4)) {
        message.warn('标题字数不符合要求');
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
    } else if (formData.channel_name === '淘宝头条') {
      if (!toutiao.title || !toutiao.title.replace(/\s+/g, '')) {
        message.warn('请填写标题');
        return false;
      } else if (toutiao.title && (toutiao.title.length > 19 || toutiao.title.length < 4)) {
        message.warn('标题字数不符合要求');
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
    } else if (!formData.channel_name && formData.task_type === 3) {
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
  handleSubmit = (status) => {
    const query = querystring.parse(this.props.location.search.substr(1));
    const { formData } = this.props;
    const { approve_status, approve_notes, haveGoodsTask, task, lifeResearch, globalFashion, ifashion, buyWorld, weitao, toutiao, zhibo } = this.state;
    const name = haveGoodsTask.title || lifeResearch.title || globalFashion.title || ifashion.title || buyWorld.title || weitao.title || toutiao.title || zhibo.title || '';
    if (this.validate()) {
      const values = {
        _id: query._id,
      }
      if (formData.channel_name === '有好货') {
        values.haveGoods = this.state.haveGoodsTask;
      } else if (formData.channel_name === '生活研究所') {
        values.lifeResearch = this.state.lifeResearch;
      } else if (formData.channel_name === '全球时尚') {
        values.globalFashion = this.state.globalFashion;
      } else if (formData.channel_name === 'ifashion') {
        values.ifashion = this.state.ifashion;
      } else if (formData.channel_name === '买遍全球') {
        values.buyWorld = this.state.buyWorld;
      } else if (formData.channel_name === '微淘') {
        values.weitao = this.state.weitao;
      } else if (formData.channel_name === '淘宝头条') {
        values.toutiao = this.state.toutiao;
      } else if (formData.channel_name === '直播脚本') {
        values.zhibo = this.state.zhibo;
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
                approve_notes: approve_notes,
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
    let form = '';
    if (formData.channel_name === '微淘') {
      form = <WeitaoForm
              form={this.props.form}
              role="approve"
              operation={operation}
              formData={this.state.weitao}
              onChange={this.handleChangeWeitao}
            />;
    } else if (formData.channel_name === '淘宝头条') {
      form = <WeitaoForm
              form={this.props.form}
              role="approve"
              operation={operation}
              formData={this.state.toutiao}
              onChange={this.handleChangeToutiao}
            />;
    } else if (!formData.channel_name && formData.task_type === 3) {
      form = <ZhiboForm
              form={this.props.form}
              role="approve"
              operation={operation}
              formData={this.state.zhibo}
              onChange={this.handleChangeZhibo}
            />;
    } else if (formData.channel_name === '有好货') {
      form = <GoodProductionForm
              form={this.props.form}
              role="approve"
              operation={operation}
              formData={this.state.haveGoodsTask}
              onChange={this.handleChangeGoods}
            />
    } else if (formData.channel_name === '生活研究所') {
      form = <LifeInstituteForm
              form={this.props.form}
              role="approve"
              operation={operation}
              formData={this.state.lifeResearch}
              onChange={this.handleChangeLife}
            />
    } else if (formData.channel_name === '全球时尚') {
      form = <GlobalFashionForm
              channel_name={formData.channel_name}
              form={this.props.form}
              role="approve"
              operation={operation}
              formData={this.state.globalFashion}
              onChange={this.handleChangeGlobal}
            />
    } else if (formData.channel_name === '买遍全球') {
      form = <GlobalFashionForm
              channel_name={formData.channel_name}
              form={this.props.form}
              role="approve"
              operation={operation}
              formData={this.state.buyWorld}
              onChange={this.handleChangeBuyWorld}
            />
    } else if (formData.channel_name === 'ifashion') {
      form = <IfashionForm
              form={this.props.form}
              role="approve"
              operation={operation}
              formData={this.state.ifashion}
              onChange={this.handleChangeIfashion}
            />
    }
    return (
      <Card bordered={false} title="" style={{ background: 'none' }} bodyStyle={{ padding: 0 }}>
        <div className={styles.taskOuterBox} ref="taskOuterBox" style={{ width: formData.channel_name === '有好货' ? 730 : 1000 }}>
          <div style={{ width: formData.channel_name === '有好货' ? 375 : 650 }}>
            {form}
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
          { (formData.approve_status === TASK_APPROVE_STATUS.waitingForApprove || showApproveLog) &&
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
