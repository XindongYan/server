import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import querystring from 'querystring';
import { Card, Button, Popconfirm, message, Form, Tooltip } from 'antd';
import { TASK_APPROVE_STATUS } from '../../constants';
import $ from 'jquery';
import Annotation from '../../components/Annotation';
import WeitaoForm from '../../components/Forms/WeitaoForm';
import ZhiboForm from '../../components/Forms/ZhiboForm';
import GoodProductionForm from '../../components/Forms/GoodProductionForm';
import LifeInstituteForm from '../../components/Forms/LifeInstituteForm';
import TaskChat from '../../components/TaskChat';
import styles from './TableList.less';

const FormItem = Form.Item;

@connect(state => ({
  formData: state.task.formData,
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
      approve_notes: [],
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
    lifeResearch: {
      title: '', // '任务标题',
      sub_title: '', // '副标题',
      task_desc: '', // '写手提交的稿子内容',
      cover_img: '',//封面
      crowd: [], // 目标人群
      summary: '', // 目标人群
    },
    grade: 0,
    grades: [],
  }
  componentDidMount() {
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch({
      type: 'task/fetchTask',
      payload: { _id: query._id },
      callback: (result) => {
        if (!result.error) {
          this.setState({
            task: {
              crowd: result.task.crowd,
              title: result.task.title,
              task_desc: result.task.task_desc,
              cover_img: result.task.cover_img,
              approve_notes: result.task.approve_notes || [],
            },
            haveGoodsTask: result.task.haveGoods,
            lifeResearch: result.task.lifeResearch,
            grade: result.task.grade,
            grades: result.task.grades && result.task.grades.length ? result.task.grades : [...this.state.grades],
          });
        }
      }
    });
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: true,
    });
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
  handleSubmit = () => {
    const { currentUser, formData } = this.props;
    const { task, haveGoodsTask, lifeResearch } = this.state;
    if (this.validate()) {
      const query = querystring.parse(this.props.location.search.substr(1));
      const values = {
        ...this.state.task,
        haveGoods: this.state.haveGoodsTask,
        lifeResearch: this.state.lifeResearch,
        _id: query._id,
      }
      if (!formData.creator_id || formData.creator_id === currentUser._id ) {
        values.name =  task.title || haveGoodsTask.title || lifeResearch.title;
      }
      this.props.dispatch({
        type: 'task/update',
        payload: values,
        callback: (result) => {
          if (result.error) {
            message.error(result.msg);
          } else {
            this.props.dispatch({
              type: 'task/handin',
              payload: { _id: query._id, user_id: currentUser._id },
              callback: (result1) => {
                if (result1.error) {
                  message.error(result1.msg);
                } else {
                  this.props.dispatch(routerRedux.push(`/writer/task/handin/success?_id=${query._id}`));
                }
              }
            });
          }
        }
      });
    }
  }
  handleSave = () => {
    const { formData } = this.props;
    const { task, haveGoodsTask, lifeResearch } = this.state;
    if (!task.title && !haveGoodsTask.title && !lifeResearch.title) {
      message.warn('请输入标题');
    } else {
      const query = querystring.parse(this.props.location.search.substr(1));
      const values = {
        ...this.state.task,
        haveGoods: this.state.haveGoodsTask,
        lifeResearch: this.state.lifeResearch,
        _id: query._id,
      }
      if (!formData.project_id) {
        values.name =  task.title || haveGoodsTask.title || lifeResearch.title;
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
    }
  }
  validate = () => {
    const { task, haveGoodsTask, lifeResearch } = this.state;
    if (this.props.formData.channel_name === '有好货') {
      let bOk = true;
      this.props.form.validateFields(['title','task_desc','industry_title','industry_introduction','brand_name','brand_introduction'], (err, val) => {
        if (!err) {
          if (!haveGoodsTask.product_url) {
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
    } else if (this.props.formData.channel_name === '生活研究所') {
      let bOk = true;
      this.props.form.validateFields(['title','sub_title','summary'], (err, val) => {
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
      } else if (!task.cover_img && this.props.formData.task_type !== 3) {
        message.warn('请选择封面图');
        return false;
      } else {
        return true;
      }
    }
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
  render() {
    // const taskOuterBoxHeight = $(this.refs.taskOuterBox).outerHeight() || 0;
    const { formData } = this.props;
    const { haveGoodsTask } = this.state;
    const query = querystring.parse(this.props.location.search.substr(1));
    return (
      <Card bordered={false} title="" style={{ background: 'none' }} bodyStyle={{ padding: 0 }}>
        <div className={styles.taskOuterBox} style={{ width: this.props.formData.approve_status === TASK_APPROVE_STATUS.rejected ? 1000 : 872 }} ref="taskOuterBox">
          <div style={{ width: 650 }}>
            { (formData.channel_name === '淘宝头条' || formData.channel_name === '微淘') &&
              <WeitaoForm
                role="writer"
                operation="edit"
                formData={this.state.task}
                onChange={this.handleChange}
              />
            }
            { !formData.channel_name && formData.task_type === 3 &&
              <ZhiboForm
                role="writer"
                operation="edit"
                formData={this.state.task}
                onChange={this.handleChange}
              />
            }
            { formData.channel_name === '有好货' &&
              <GoodProductionForm
                form={this.props.form}
                role="writer"
                operation="edit"
                formData={haveGoodsTask}
                onChange={this.handleChangeGoods}
              />
            }
            { formData.channel_name === '生活研究所' &&
              <LifeInstituteForm
                form={this.props.form}
                role="writer"
                operation="edit"
                formData={this.state.lifeResearch}
                onChange={this.handleChangeLife}
              />
            }
          </div>
          { this.props.formData.approve_status === TASK_APPROVE_STATUS.rejected &&
            <div className={styles.taskComment}>
              <Annotation viewStatus="view" value={this.state.task.approve_notes} />
            </div>
          }
          { this.props.formData.approve_status === TASK_APPROVE_STATUS.taken &&
            <div className={styles.taskComment} style={{ width: 200 }}>
              <p className={styles.titleDefult}>爆文写作参考</p>
              <ul className={styles.tPrompt}>
                <li>1. 从小知识小技巧着手. 淘宝头条讲了个概念叫”随手有用书”,即生活中有很多一般人不注意的小知识小技巧. 比如大部分人都晾错内衣, 尤其是第二种方式这条,结合着推内衣这个点很不错.</li>
                <li>2. 从风格化, 场景化着手入手, 即内容针对目标人群.想一想目标针对用户有什么样的特点? 会对什么样的内容感兴趣?要去倒推.</li>
                <li>3. 从时下热点,八卦,新闻等角度着手.反正总之就是一句话:要用户产生觉得“有用”“感兴趣”等特别的感觉.</li>
              </ul>
            </div>
          }
          <div className={styles.submitBox}>
            {this.state.grade > 0 &&
              <dl className={styles.showGradeBox}>
                <dt>分数</dt>
                {this.state.grades.map((item) => 
                  <dd key={item.name}><span>{item.name}：</span><span>{item.value}</span></dd>)
                }
              </dl>
            }
            <Tooltip placement="top" title="提交到平台审核方进行审核" getPopupContainer={() => document.getElementById('submitButton')}>
              <Popconfirm overlayClassName={styles.popConfirm} getPopupContainer={() => document.getElementById('submitButton')} placement="top" title="确认提交审核?" onConfirm={this.handleSubmit} okText="确认" cancelText="取消">
                <Button id="submitButton">提交审核</Button>
              </Popconfirm>
            </Tooltip>
            <Button onClick={this.handleSave}>保存</Button>
          </div>
        </div>
        <TaskChat taskId={query._id} />
      </Card>
    );
  }
}
