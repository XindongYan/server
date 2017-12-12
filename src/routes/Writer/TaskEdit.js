import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import querystring from 'querystring';
import { Card, Button, Popconfirm, message } from 'antd';
import { TASK_APPROVE_STATUS } from '../../constants';
import $ from 'jquery';
import Annotation from '../../components/Annotation';
import WeitaoForm from '../../components/Forms/WeitaoForm';
import ZhiboForm from '../../components/Forms/ZhiboForm';
import TaskChat from '../../components/TaskChat';
import styles from './TableList.less';

// import styles from './Project.less';

@connect(state => ({
  formData: state.task.formData,
}))

export default class TaskEdit extends PureComponent {
  state = {
    task: {
      title: '',
      task_desc: '',
      cover_img: '',
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
      callback: (result) => {
        if (!result.error) {
          this.setState({
            task: {
              title: result.task.title,
              task_desc: result.task.task_desc,
              cover_img: result.task.cover_img,
              approve_notes: result.task.approve_notes || [],
            },
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
  }
  handleSubmit = () => {
    const { task } = this.state;
    if (!task.title || !task.title.replace(/\s+/g, '')) {
      message.warn('请填写标题');
    } else if (task.title && task.title.length > 19) {
      message.warn('标题字数不符合要求');
    } else if (!task.task_desc) {
      message.warn('请填写内容');
    } else if (!task.cover_img && this.props.formData.task_type !== 3) {
      message.warn('请选择封面图');
    } else {
      const query = querystring.parse(this.props.location.search.substr(1));
      this.props.dispatch({
        type: 'task/update',
        payload: { ...this.state.task, _id: query._id },
        callback: (result) => {
          if (result.error) {
            message.error(result.msg);
          } else {
            this.props.dispatch({
              type: 'task/handin',
              payload: { _id: query._id },
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
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch({
      type: 'task/update',
      payload: { ...this.state.task, _id: query._id },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          message.success(result.msg);
        }
      }
    });
  }
  handleChange = (task) => {
    this.setState({ task: { ...this.state.task, ...task } });
  }
  render() {
    // const taskOuterBoxHeight = $(this.refs.taskOuterBox).outerHeight() || 0;
    const { formData } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    return (
      <Card bordered={false} title="" style={{ background: 'none' }} bodyStyle={{ padding: 0 }}>
        <div className={styles.taskOuterBox} style={{ width: this.props.formData.approve_status === TASK_APPROVE_STATUS.rejected ? 1000 : 872 }} ref="taskOuterBox">
          <div style={{ width: 650 }}>
            <div className={styles.taskTitBox} style={{lineHeight: '40px',background: '#f5f5f5', textIndent: '1em', fontSize: 14, color: '#333'}}>
              内容创作
            </div>
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
            <Popconfirm placement="top" title="确认已经写完并提交给审核人员?" onConfirm={this.handleSubmit} okText="确认" cancelText="取消">
              <Button>提交</Button>
            </Popconfirm>
            <Button onClick={this.handleSave}>保存</Button>
          </div>
        </div>
        <TaskChat taskId={query._id} />
      </Card>
    );
  }
}
