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
      title: '',
      task_desc: '',
      cover_img: '',
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
              title: result.task.title,
              task_desc: result.task.task_desc,
              cover_img: result.task.cover_img,
            },
            haveGoodsTask: result.task.haveGoods,
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
  handleSave = () => {
    const { formData } = this.props;
    const { grade, grades, approve_status, approve_notes, task, haveGoodsTask } = this.state;
    const query = querystring.parse(this.props.location.search.substr(1));
    const values = {
      ...this.state.task,
      haveGoods: this.state.haveGoodsTask,
      _id: query._id,
      approve_notes: approve_notes,
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
  handleSubmit = (status) => {
    const query = querystring.parse(this.props.location.search.substr(1));
    const { formData } = this.props;
    const { grade, grades, approve_status, approve_notes, haveGoodsTask, task } = this.state;
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
    } else if (true) {
      form = <GoodProductionForm
                form={this.props.form}
                role="approve"
                operation={operation}
                formData={this.state.haveGoodsTask}
                onChange={this.handleChangeGoods}
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
