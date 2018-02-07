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
      crowd: [],
      title: '',
      task_desc: '',
      cover_img: '',
    },
    weitao: {
      crowd: [],
      title: '',
      task_desc: '',
      cover_img: '',
    },
    toutiao: {
      title: '', // '任务标题',
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
      sub_title: '', // '副标题',
      task_desc: '', // '写手提交的稿子内容',
      cover_img: '',//封面
      classification: [], // 分类
    },
    approve_notes: [],
  }
  componentDidMount() {
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch({
      type: 'task/fetchTask',
      payload: query,
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.formData.title) {
      if (nextProps.formData.channel_name === '微淘' ) {
        this.setState({
          weitao: {
            crowd: nextProps.formData.crowd,
            title: nextProps.formData.title,
            task_desc: nextProps.formData.task_desc,
            cover_img: nextProps.formData.cover_img,
          }
        });
      } else if (nextProps.formData.channel_name === '淘宝头条') {
        this.setState({
          toutiao: {
            crowd: nextProps.formData.crowd,
            title: nextProps.formData.title,
            task_desc: nextProps.formData.task_desc,
            cover_img: nextProps.formData.cover_img,
          }
        });
      } else if (nextProps.formData.task_type === 3) {
        this.setState({
          toutiao: {
            title: nextProps.formData.title,
            task_desc: nextProps.formData.task_desc,
          }
        });
      }
      const query = querystring.parse(nextProps.location.search.substr(1));
      this.props.dispatch({
        type: 'task/update',
        payload: {
          ...this.state.task,
          _id: query._id,
        }
      });
    } else {
      this.setState({
        weitao: nextProps.formData.weitao,
        toutiao: nextProps.formData.toutiao,
        zhibo: nextProps.formData.zhibo,
        haveGoodsTask: nextProps.formData.haveGoods,
        lifeResearch: nextProps.formData.lifeResearch,
        globalFashion: nextProps.formData.globalFashion,
        ifashion: nextProps.formData.ifashion,
        buyWorld: nextProps.formData.buyWorld,
        approve_notes: nextProps.formData.approve_notes || [],
      });
    }
  }
  componentWillUnmount() {
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
        <div className={styles.taskOuterBox} ref="taskOuterBox" style={{ width: formData.channel_name === '有好货' ? 730 : 1000 }}>
          <div style={{ width: formData.channel_name === '有好货' ? 375 : 650 }}>
            { formData.channel_name === '微淘' &&
              <WeitaoForm
                form={this.props.form}
                role="approve"
                operation={operation}
                formData={this.state.weitao}
              />
            }
            { formData.channel_name === '淘宝头条' &&
              <WeitaoForm
                form={this.props.form}
                role="approve"
                operation={operation}
                formData={this.state.toutiao}
              />
            }
            { formData.task_type === 3 &&
              <ZhiboForm
                form={this.props.form}
                role="approve"
                operation={operation}
                formData={this.state.zhibo}
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
              <Annotation viewStatus="view" value={this.state.approve_notes}/>
            </div>
          }
        </div>
        { showApproveLog && <TaskChat taskId={query._id} /> }
        { showApproveLog && <ApproveLog approveData={approveData}/> }
      </Card>
    );
  }
}
