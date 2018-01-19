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
    haveGoodsTask: {
      crowd: [],
      title: '',
      task_desc: '',
      auction: {}, // 商品
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
    globalFashion: {
      title: '', // '任务标题',
      task_desc: '', // '写手提交的稿子内容',
      cover_img: '',//封面
      crowd: [], // 目标人群
      classification: [], // 分类
    },
    grade: 0,
    grades: [
      {name: '标题', value: 0},
      {name: '正文', value: 0},
      {name: '图片', value: 0},
    ],
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
          this.setState({
            task: {
              crowd: result.task.crowd,
              title: result.task.title,
              task_desc: result.task.task_desc,
              cover_img: result.task.cover_img,
            },
            haveGoodsTask: result.task.haveGoods,
            lifeResearch: result.task.lifeResearch,
            globalFashion: result.task.globalFashion,
            grade: result.task.grade,
            grades: result.task.grades && result.task.grades.length ? result.task.grades : [...this.state.grades],
            approve_status: result.task.approve_status,
            approve_notes: result.task.approve_notes || [],
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
  changeGrades = (index, value) => {
    const { grades } = this.state;
    const newGrades = [...this.state.grades];
    newGrades.splice(index, 1, {...this.state.grades[index], value: value});
    const title_grade = newGrades[0].value;
    const desc_grade = newGrades[1].value;
    const img_grade = newGrades[2].value;
    const grade = (title_grade * 0.3 + desc_grade * 0.4 + img_grade * 0.3).toFixed(1);
    this.setState({
      grade: Number(grade),
      grades: newGrades,
    })
  }
  changeApproveNode = (commentContent) => {
    this.setState({
      approve_notes: [...commentContent],
    })
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
  handleSave = () => {
    const { formData } = this.props;
    const { grade, grades, approve_status, approve_notes, task, haveGoodsTask, lifeResearch, globalFashion } = this.state;
    const query = querystring.parse(this.props.location.search.substr(1));
    const name = task.title || haveGoodsTask.title || lifeResearch.title || globalFashion.title || '';
    if (name.trim()) {
      const values = {
        ...this.state.task,
        haveGoods: this.state.haveGoodsTask,
        lifeResearch: this.state.lifeResearch,
        globalFashion: this.state.globalFashion,
        _id: query._id,
        approve_notes: approve_notes,
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
    const { task, haveGoodsTask, lifeResearch, globalFashion } = this.state;
    if (formData.channel_name === '有好货') {
      let bOk = true;
      this.props.form.validateFields(['title','task_desc','industry_title','industry_introduction','brand_name','brand_introduction'], (err, val) => {
        if (!err) {
          if (!haveGoodsTask.auction.resourceUrl) {
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
    } else if (formData.channel_name === '生活研究所') {
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
    } else if (formData.channel_name === '全球时尚') {
      if (!globalFashion.title || !globalFashion.title.replace(/\s+/g, '')) {
        message.warn('请填写标题');
        return false;
      } else if (globalFashion.title && globalFashion.title.length > 19) {
        message.warn('标题字数不符合要求');
        return false;
      } else if (!globalFashion.task_desc) {
        message.warn('请填写内容');
        return false;
      } else if (!globalFashion.cover_img) {
        message.warn('请选择封面图');
        return false;
      } else if (globalFashion.classification.length <= 0) {
        message.warn('请选择潮流热点分类');
        return false;
      } else if (globalFashion.classification && globalFashion.classification.length > 1) {
        message.warn('潮流热点只能选择一个');
        return false;
      } else {
        return true;
      }
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
  handleSubmit = (status) => {
    const query = querystring.parse(this.props.location.search.substr(1));
    const { formData } = this.props;
    const { grade, grades, approve_status, approve_notes, haveGoodsTask, task, lifeResearch, globalFashion } = this.state;
    const name = task.title || haveGoodsTask.title || lifeResearch.title || globalFashion.title;
    if (this.validate()) {
      const values = {
        ...this.state.task,
        haveGoods: this.state.haveGoodsTask,
        lifeResearch: this.state.lifeResearch,
        globalFashion: this.state.globalFashion,
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
                grade: grade,
                grades: grades,
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
    const { grades, approve_notes } = this.state;
    const showApproveLog = formData.approvers && formData.approvers[0] && formData.approvers[0].indexOf(currentUser._id) >= 0;
    const operation = 'edit';
    const content = (
      <div style={{width: 360}}>
        {grades.map((item, index) => 
          <div style={{padding: '10px 0'}} key={index}>
            <span style={{margin: '0 15px'}}>{item.name}</span>
            <Slider
              style={{width: '80%', display: 'inline-block', margin: 0}}
              value={Number(item.value)}
              max={10}
              step={0.1}
              onChange={(value) => this.changeGrades(index, value)}
            />
          </div>)
        }
      </div>
    );
    let form = '';
    if (formData.channel_name === '淘宝头条' || formData.channel_name === '微淘') {
      form = <WeitaoForm
                role="approve"
                operation={operation}
                formData={this.state.task}
                onChange={this.handleChange}
              />;
    } else if (!formData.channel_name && formData.task_type === 3) {
      form = <ZhiboForm
                role="approve"
                operation={operation}
                formData={this.state.task}
                onChange={this.handleChange}
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
                form={this.props.form}
                role="approve"
                operation={operation}
                formData={this.state.globalFashion}
                onChange={this.handleChangeGlobal}
              />
    }
    return (
      <Card bordered={false} title="" style={{ background: 'none' }} bodyStyle={{ padding: 0 }}>
        <div className={styles.taskOuterBox} ref="taskOuterBox">
          <div style={{ width: 650 }}>
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
              {this.state.grade > 0 && formData.approve_status !== 0 &&
                <dl className={styles.showGradeBox}>
                  <dt>分数</dt>
                  {grades.map((item) => 
                    <dd key={item.name}><span>{item.name}：</span><span>{item.value}</span></dd>)
                  }
                </dl>
              }
              { formData.approve_status !== 1 ?
                <div>
                  <Popconfirm
                    placement="top"
                    title="确认提交？"
                    onConfirm={() => this.handleSubmit(TASK_APPROVE_STATUS.rejected)}
                  >
                    { showApproveLog ?
                      <Popover content={content} title="评分" trigger="hover">
                        <Button>不通过</Button>
                      </Popover>
                      : <Button>不通过</Button>
                    }
                  </Popconfirm>
                  <Popconfirm
                    placement="top"
                    title="确认提交？"
                    onConfirm={() => this.handleSubmit(TASK_APPROVE_STATUS.passed)}
                  >
                    { showApproveLog ?
                      <Popover content={content} title="评分" trigger="hover">
                        <Button>通过</Button>
                      </Popover>
                      : <Button>通过</Button>
                    }
                  </Popconfirm>
                </div>
                :
                <Popconfirm placement="top" title={`确认退回?`} onConfirm={() => this.handleReject()} okText="确认" cancelText="取消">
                  <Button>退回</Button>
                </Popconfirm>
              }
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
