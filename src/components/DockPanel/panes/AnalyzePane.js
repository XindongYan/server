import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Divider, message } from 'antd';
import moment from 'moment';

export default class AnalyzePane extends PureComponent {
  state = {
    nicaiCrx: null,
    version: '',
    summary: {},
  }
  componentDidMount() {
    const nicaiCrx = document.getElementById('nicaiCrx');
    nicaiCrx.addEventListener('setVersion', this.setVersion);
    nicaiCrx.addEventListener('setAnalyzeData', this.setAnalyzeData);
    setTimeout(() => {
      if(!this.state.version){
        message.destroy();
        message.warn('请安装尼采创作平台插件并用淘宝授权登录！', 60 * 60);
        this.setState({ loading: false });
      }
    }, 5000);
    if (!this.state.nicaiCrx) {
      this.setState({ nicaiCrx }, () => {
        setTimeout(() => {
          this.handleGetVersion();
        }, 600);
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.task._id && nextProps.task._id !== this.props.task._id) {
      this.handleGetAnalyzeData(nextProps.task);
    }
  }
  componentWillUnmount() {
    const nicaiCrx = document.getElementById('nicaiCrx');
    nicaiCrx.removeEventListener('setVersion', this.setVersion);
    nicaiCrx.removeEventListener('setAnalyzeData', this.setAnalyzeData);
  }
  setVersion = (e) => {
    const data = JSON.parse(e.target.innerText);
    if (data.error) {
      message.warn(data.msg);
    }
    this.setState({
      version: data.version,
    })
    this.handleGetAnalyzeData(this.props.task);
  }
  setAnalyzeData = (e) => {
    const data = JSON.parse(e.target.innerText);
    // console.log(data);
    this.setState({
      summary: data.data,
    });
  }
  handleGetVersion = () => {
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getVersion', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  handleGetAnalyzeData = (task) => {
    if (task.taobao && task.taobao.contentId) {
      this.state.nicaiCrx.innerText = JSON.stringify(task.taobao);
      const customEvent = document.createEvent('Event');
      customEvent.initEvent('getAnalyzeData', true, true);
      this.state.nicaiCrx.dispatchEvent(customEvent);
    }
  }
  render() {
    const { task } = this.props;
    const { summary } = this.state;
    const alias = [{
      "value": "sumShareCnt",
      "type": "Integer",
      "format": ",",
      "text": "累计转发次数"
    }, {
      "value": "sumCmtCnt",
      "type": "Integer",
      "format": ",",
      "text": "累计评论次数"
    }, {
      "value": "sumCntIpv",
      "type": "Long",
      "format": ",d",
      "text": "累计进店次数"
    }, {
      "value": "sumSnsCnt",
      "type": "Long",
      "format": ",",
      "text": "累计互动次数"
    }, {
      "value": "sumReadCnt",
      "type": "Long",
      "format": ",",
      "text": "累计阅读次数"
    }, {
      "value": "sumFavorCnt",
      "type": "Integer",
      "format": ",",
      "text": "累计点赞次数"
    }];
    const gridStyle = {
      width: `${1 / alias.length * 100}%`,
      textAlign: 'center',
    };
    return (
      <Card>
        {alias.map(item =>
          <Card.Grid key={item.value} style={gridStyle}>
          <div>
            {item.text}
          </div>
          <h2>
            {summary[item.value] ? summary[item.value].value : 0}
          </h2>
          </Card.Grid>)}
        <div style={{ float: 'right', color: 'grey', marginTop: 10 }}>
          {task.taobao && task.taobao.user && <span><span>数据来源于：</span><span>{task.taobao.user.name}</span></span>}
          {summary.updateTime && <Divider type="vertical" />}
          {summary.updateTime && <span><span>数据更新时间：</span><span>{moment(new Date(summary.updateTime)).format('YYYY年MM月DD日')}</span></span>}
        </div>
      </Card>
    );
  }
}
