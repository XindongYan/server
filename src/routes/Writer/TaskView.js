import React, { PureComponent } from 'react';
import { connect } from 'dva';
import querystring from 'querystring';
import { Card } from 'antd';
import $ from 'jquery';
import Annotation from '../../components/Annotation';
import WeitaoForm from '../../components/Forms/WeitaoForm';
import ZhiboForm from '../../components/Forms/ZhiboForm';
import GoodProductionForm from '../../components/Forms/GoodProductionForm';
import LifeInstituteForm from '../../components/Forms/LifeInstituteForm';
import TaskChat from '../../components/TaskChat';
import { TASK_APPROVE_STATUS } from '../../constants';
import styles from './TableList.less';


@connect(state => ({
  formData: state.task.formData,
}))

export default class TaskView extends PureComponent {
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
      approve_notes: [],
    },
    lifeResearch: {
      title: '', // '任务标题',
      sub_title: '', // '副标题',
      task_desc: '', // '写手提交的稿子内容',
      cover_img: '',//封面
      crowd: [], // 目标人群
      summary: '', // 目标人群
      approve_notes: [],
    },
    grade: 0,
    grades: [],
  }
  componentDidMount() {
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch({
      type: 'task/fetchTask',
      payload: { _id: query._id },
    });
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: true,
    });
    this.props.dispatch({
      type: 'task/clearFormData'
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      task: {
        crowd: nextProps.formData.crowd,
        title: nextProps.formData.title,
        task_desc: nextProps.formData.task_desc,
        cover_img: nextProps.formData.cover_img,
        approve_notes: nextProps.formData.approve_notes || [],
      },
      haveGoodsTask: {
        ...nextProps.formData.haveGoods,
        approve_notes: nextProps.formData.approve_notes || [],
      },
      lifeResearch: {
        ...nextProps.formData.lifeResearch,
        approve_notes: nextProps.formData.approve_notes || [],
      },
      grade: nextProps.formData.grade,
      grades: nextProps.formData.grades,
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: false,
    });
  }
  handleChange = () => {

  }
  render() {
    const { formData } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    const taskOuterBoxHeight = $(this.refs.taskOuterBox).outerHeight() || 0;
    const showAnnotation = formData.approve_status === TASK_APPROVE_STATUS.passed || formData.approve_status === TASK_APPROVE_STATUS.rejected;
    return (
      <Card bordered={false} title="" style={{ background: 'none' }} bodyStyle={{ padding: 0 }}>
        <div className={styles.taskOuterBox} ref="taskOuterBox">
          <div style={{ width: 650 }}>
            { (formData.channel_name === '淘宝头条' || formData.channel_name === '微淘') &&
              <WeitaoForm
                role="writer"
                operation="view"
                formData={this.state.task}
              />
            }
            { !formData.channel_name && formData.task_type === 3 &&
              <ZhiboForm
                role="writer"
                operation="view"
                formData={this.state.task}
              />
            }
            { formData.channel_name === '有好货' &&
              <GoodProductionForm
                role="writer"
                operation="view"
                formData={this.state.haveGoodsTask}
              />
            }
            { formData.channel_name === '生活研究所' &&
              <LifeInstituteForm
                role="writer"
                operation="view"
                formData={this.state.lifeResearch}
              />
            }
          </div>
          { showAnnotation &&
            <div className={styles.taskComment}>
              <Annotation viewStatus="view" value={this.state.task.approve_notes} onChange={this.handleChange} />
            </div>
          }
          { !showAnnotation &&
            <div className={styles.taskComment} style={{ width: 200, marginRight: 130 }}>
              <p className={styles.titleDefult}>爆文写作参考</p>
              <ul className={styles.tPrompt}>
                <li>1. 从小知识小技巧着手. 淘宝头条讲了个概念叫”随手有用书”,即生活中有很多一般人不注意的小知识小技巧. 比如大部分人都晾错内衣, 尤其是第二种方式这条,结合着推内衣这个点很不错.</li>
                <li>2. 从风格化, 场景化着手入手, 即内容针对目标人群.想一想目标针对用户有什么样的特点? 会对什么样的内容感兴趣?要去倒推.</li>
                <li>3. 从时下热点,八卦,新闻等角度着手.反正总之就是一句话:要用户产生觉得“有用”“感兴趣”等特别的感觉.</li>
              </ul>
            </div>
          }
          {this.state.grade > 0 && this.state.approve_status > 0 &&
            <div className={styles.submitBox}>
              <dl className={styles.showGradeBox}>
              <dt>分数</dt>
              {this.state.grades.map((item) => 
                <dd key={item.name}><span>{item.name}：</span><span>{item.value}</span></dd>)
              }
              </dl>
            </div>
          }
        </div>
        <TaskChat taskId={query._id} />
      </Card>
    );
  }
}
