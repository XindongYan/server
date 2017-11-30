import React, { PureComponent } from 'react';
import { connect } from 'dva';
import querystring from 'querystring';
import { Card, Button } from 'antd';
import $ from 'jquery';
import Editor from '../../components/Editor';
import WeitaoForm from '../../components/Forms/WeitaoForm';
import styles from './TableList.less';

@connect(state => ({
  formData: state.task.formData,
}))

export default class TaskCreate extends PureComponent {
  state = {
    task: {
      title: '',
      task_desc: '',
      cover_img: '',
    },
  }
  componentDidMount() {
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch({
      type: 'task/fetchTask',
      payload: query,
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      task: {
        title: nextProps.formData.title,
        task_desc: nextProps.formData.task_desc,
        cover_img: nextProps.formData.cover_img,
      }
    });
  }
  handleChange = (task) => {
    this.setState({ task: { ...this.state.task, ...task } });
  }
  handleSubmit = () => {
  
  }
  render() {
    const { formData } = this.props;
    console.log(formData)
    const taskOuterBoxHeight = $(this.refs.taskOuterBox).outerHeight() || 0;
    return (
      <Card bordered={false} title="" style={{ background: 'none' }} bodyStyle={{ padding: 0 }}>
        <div className={styles.taskOuterBox} style={{ width: 942 }} ref="taskOuterBox">
          <WeitaoForm operation="edit" style={{ width: 720 }} formData={this.state.task} onChange={this.handleChange}/>
          <div className={styles.taskComment} style={{ width: 200 }}>
            <p className={styles.titleDefult}>爆文写作参考</p>
            <ul className={styles.tPrompt}>
              <li>1. 从小知识小技巧着手. 淘宝头条讲了个概念叫”随手有用书”,即生活中有很多一般人不注意的小知识小技巧. 比如大部分人都晾错内衣, 尤其是第二种方式这条,结合着推内衣这个点很不错.</li>
              <li>2. 从风格化, 场景化着手入手, 即内容针对目标人群.想一想目标针对用户有什么样的特点? 会对什么样的内容感兴趣?要去倒推.</li>
              <li>3. 从时下热点,八卦,新闻等角度着手.反正总之就是一句话:要用户产生觉得“有用”“感兴趣”等特别的感觉.</li>
            </ul>
          </div>
          <div className={styles.submitBox}>
            <Button onClick={this.handleSubmit}>提交</Button>
            <Button onClick={this.handleSave}>保存</Button>
          </div>
        </div>
      </Card>
    );
  }
}
