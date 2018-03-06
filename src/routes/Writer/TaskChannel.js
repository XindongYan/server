import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import querystring from 'querystring';
import { Card, Button, Popconfirm, message, Row, Col } from 'antd';
import TaskChat from '../../components/TaskChat';
import styles from './TableList.less';
import { CHANNELS } from '../../constants/taobao';
import { TASK_TYPES } from '../../constants';


@connect(state => ({

}))

export default class TaskChannel extends PureComponent {
  state = {
    data: [],
  }
  async componentDidMount() {
    const data = await fetch(`/jsons/taskChannel.json`).then(response => response.json());
    this.setState({
      data,
    });
  }
  componentWillReceiveProps(nextProps) {

  }
  handleContent = () => {
    return 
  }

  handleDeliver = (template) => {
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch(routerRedux.push(`/writer/task/create?channelId=${query.channelId}&activityId=${query.activityId}&template=${template}`));
  }
  handleGetTemplate = () => {
    const query = querystring.parse(this.props.location.search.substr(1));
    let templates = [];
    CHANNELS.forEach(item => {
      item.activityList.forEach(item1 => {
        if (item1.id == query.activityId) {
          templates = item1.templates || [];
        }
      });
    });
    return templates;
  }
  renderTemplateBox = (template) => {
    const taskType = TASK_TYPES.find(item => item.template === template);
    return (
      <div key={template} className={styles.channelBox} onClick={() => this.handleDeliver(template)}>
        <div className={styles.channelImgBox}>
          <img src={taskType.logo} />
        </div>
        <div className={styles.channelNameBox}>{taskType.text}</div>
      </div>
    )
  }
  render() {
    const query = querystring.parse(this.props.location.search.substr(1));
    const { data } = this.state;
    const details = data.filter(item => item.id == query.activityId);
    const detail = details && details.length > 0 ? details[0] : {};
    return (
      <div>
        <Card bordered={false} style={{ textAlign: 'center', marginBottom: 20 }} bodyStyle={{ padding: 20 }}>
          {this.handleGetTemplate().map(item => this.renderTemplateBox(item))}
        </Card>
        <Card bordered={false} bodyStyle={{ padding: 20 }}>
          {detail.desc && <div>
            <div className={styles.channel_box_title}>子频道介绍</div>
            <div className={styles.channel_detail} dangerouslySetInnerHTML={{__html: detail.desc}}></div>
          </div>}
          {detail.qualifyList && <div>
            <div className={styles.channel_box_title}>作者要求</div>
            <div className={styles.channel_detail}>
              {detail.qualifyList.map((item, index) => <p key={index}>{item}</p>)}
            </div>
          </div>}
          {detail.rule && <div>
            <div className={styles.channel_box_title}>内容要求</div>
            <div className={styles.channel_detail} dangerouslySetInnerHTML={{__html: detail.rule}}></div>
          </div>}
        </Card>
      </div>
    );
  }
}
