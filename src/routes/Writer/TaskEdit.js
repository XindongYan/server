import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import querystring from 'querystring';
import { Card, Button, Popconfirm, message, Form } from 'antd';
import { TASK_APPROVE_STATUS } from '../../constants';
import $ from 'jquery';
import Annotation from '../../components/Annotation';
import WeitaoForm from '../../components/Forms/WeitaoForm';
import ZhiboForm from '../../components/Forms/ZhiboForm';
import GoodProductionForm from '../../components/Forms/GoodProductionForm';
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
            grade: result.task.grade,
            grades: result.task.grades && result.task.grades.length ? result.task.grades : [...this.state.grades],
          }, () => {
            setTimeout(() => {
              if (result.task.channel_name === '有好货') {
                this.handleCreatGoodForm();
              }
            },10)
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
  handleSubmit = () => {
    const { currentUser, formData } = this.props;
    const { task, haveGoodsTask } = this.state;
    if (this.validate()) {
      const query = querystring.parse(this.props.location.search.substr(1));
      const values = {
        ...this.state.task,
        haveGoods: this.state.haveGoodsTask,
        _id: query._id,
      }
      if (!formData.project_id) {
        values.name = formData.channel_name === '有好货' ? haveGoodsTask.title : task.title;
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
  validate = () => {
    const { task, haveGoodsTask } = this.state;
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
  handleSave = () => {
    const { formData } = this.props;
    const { task, haveGoodsTask } = this.state;
    if (this.validate()) {
      const query = querystring.parse(this.props.location.search.substr(1));
      const values = {
        ...this.state.task,
        haveGoods: this.state.haveGoodsTask,
        _id: query._id,
      }
      if (!formData.project_id) {
        values.name = formData.channel_name === '有好货' ? haveGoodsTask.title : task.title;
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
  handleChange = (task) => {
    this.setState({ task: { ...this.state.task, ...task } });
  }
  handleChangeGoods = (task) => {
    this.setState({ haveGoodsTask: { ...this.state.haveGoodsTask, ...task } });
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
            <Popconfirm placement="top" title="确认提交审核?" onConfirm={this.handleSubmit} okText="确认" cancelText="取消">
              <Button>提交审核</Button>
            </Popconfirm>
            <Button onClick={this.handleSave}>保存</Button>
          </div>
        </div>
        <TaskChat taskId={query._id} />
      </Card>
    );
  }
}
