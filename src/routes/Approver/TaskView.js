import React, { PureComponent } from 'react';
import { connect } from 'dva';
import querystring from 'querystring';
import { Card, Form } from 'antd';
import $ from 'jquery';
import Editor from '../../components/Editor';
import Annotation from '../../components/Annotation';
import ApproveLog from '../../components/ApproveLog';
import WeitaoForm from '../../components/Forms/WeitaoForm';
import ZhiboForm from '../../components/Forms/ZhiboForm';
import GoodProductionForm from '../../components/Forms/GoodProductionForm';
import LifeInstituteForm from '../../components/Forms/LifeInstituteForm';
import GlobalFashionForm from '../../components/Forms/GlobalFashionForm';
import IfashionForm from '../../components/Forms/IfashionForm';
import TaskChat from '../../components/TaskChat';
import { TASK_APPROVE_STATUS } from '../../constants';
import styles from './TableList.less';


@connect(state => ({
  formData: state.task.formData,
  approveData: state.task.approveData,
  currentUser: state.user.currentUser,
}))
@Form.create()

export default class TaskView extends PureComponent {
  state = {
    task: {
      crowdId: '',
      title: '',
      task_desc: '',
      cover_img: '',
      approve_notes: [],
    },
    haveGoodsTask: {
      crowdId: '',
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
      crowdId: '', // 目标人群
      summary: '', // 目标人群
    },
    globalFashion: {
      title: '', // '任务标题',
      task_desc: '', // '写手提交的稿子内容',
      cover_img: '',//封面
      crowdId: '', // 目标人群
      classification: [], // 分类
    },
    ifashion: {
      title: '', // '任务标题',
      summary: '', // 推荐理由
      cover_img: '',//封面
      crowdId: '', // 目标人群
      classification: [], // 分类
      tags: [], // 标签
    },
    buyWorld: {
      title: '', // '任务标题',
      sub_title: '', // '副标题',
      task_desc: '', // '写手提交的稿子内容',
      cover_img: '',//封面
      classification: [], // 分类
    },
  }
  componentDidMount() {
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch({
      type: 'task/fetchTask',
      payload: query,
    });
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: true,
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      task: {
        crowdId: nextProps.formData.crowdId,
        title: nextProps.formData.title,
        task_desc: nextProps.formData.task_desc,
        cover_img: nextProps.formData.cover_img,
        approve_notes: nextProps.formData.approve_notes || [],
      },
      haveGoodsTask: nextProps.formData.haveGoods,
      lifeResearch: nextProps.formData.lifeResearch,
      globalFashion: nextProps.formData.globalFashion,
      ifashion: nextProps.formData.ifashion,
      buyWorld: nextProps.formData.buyWorld,
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
  }
  handleChange = (task) => {
    this.setState({ task: { ...this.state.task, ...task } }, () => {
    });
  }
  render() {
    const { formData, approveData, currentUser } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    const operation = 'view';
    const showApproveLog = formData.approvers && formData.approvers[0] && formData.approvers[0].indexOf(currentUser._id) >= 0;
    const showAnnotation = showApproveLog;
    return (
      <Card bordered={false} title="" style={{ background: 'none' }} bodyStyle={{ padding: 0 }}>
        <div className={styles.taskOuterBox} ref="taskOuterBox">
          <div style={{ width: 650 }}>
            { (formData.channel_name === '淘宝头条' || formData.channel_name === '微淘') &&
              <WeitaoForm
                form={this.props.form}
                role="approve"
                operation={operation}
                style={{ width: 650 }}
                formData={this.state.task}
                onChange={this.handleChange}
              />
            }
            { !formData.channel_name && formData.task_type === 3 &&
              <ZhiboForm
                role="approve"
                operation={operation}
                style={{ width: 650 }}
                formData={this.state.task}
                onChange={this.handleChange}
              />
            }
            { formData.channel_name === '有好货' &&
              <GoodProductionForm
                form={this.props.form}
                role="approve"
                operation={operation}
                formData={this.state.haveGoodsTask}
              />
            }
            { formData.channel_name === '生活研究所' &&
              <LifeInstituteForm
                form={this.props.form}
                role="approve"
                operation={operation}
                formData={this.state.lifeResearch}
              />
            }
            { formData.channel_name === '全球时尚' &&
              <GlobalFashionForm
                channel_name={formData.channel_name}
                form={this.props.form}
                role="approve"
                operation={operation}
                formData={this.state.globalFashion}
              />
            }
            { formData.channel_name === '买遍全球' &&
              <GlobalFashionForm
                channel_name={formData.channel_name}
                form={this.props.form}
                role="approve"
                operation={operation}
                formData={this.state.buyWorld}
              />
            }
            { formData.channel_name === 'ifashion' &&
              <IfashionForm
                form={this.props.form}
                role="approve"
                operation={operation}
                formData={this.state.ifashion}
              />
            }
          </div>  
          { showAnnotation &&
            <div className={styles.taskComment}>
              <Annotation viewStatus="view" value={this.state.task.approve_notes} onChange={this.handleChange}/>
            </div>
          }
          {this.state.grade > 0 &&
            <div className={styles.submitBox}>
              <dl className={styles.showGradeBox}>
              <dt>分数</dt>
              {grades.map((item) => 
                <dd key={item.name}><span>{item.name}：</span><span>{item.value}</span></dd>)
              }
              </dl>
            </div>
          }
        </div>
        { showApproveLog && <TaskChat taskId={query._id} /> }
        { showApproveLog && <ApproveLog approveData={approveData}/> }
      </Card>
    );
  }
}
