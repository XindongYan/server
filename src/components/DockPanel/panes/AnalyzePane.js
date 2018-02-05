import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Divider, Table, message } from 'antd';
import moment from 'moment';
import { queryAuctionOrders } from '../../../services/task';

export default class AnalyzePane extends PureComponent {
  state = {
    // nicaiCrx: null,
    // version: '',
    auctionOrders: [],
    loading: true,
  }
  componentDidMount() {
    // const nicaiCrx = document.getElementById('nicaiCrx');
    // nicaiCrx.addEventListener('setVersion', this.setVersion);
    // nicaiCrx.addEventListener('setAnalyzeData', this.setAnalyzeData);
    // setTimeout(() => {
    //   if(!this.state.version){
    //     message.destroy();
    //     message.warn('请安装尼采创作平台插件并用淘宝授权登录！', 60 * 60);
    //     this.setState({ loading: false });
    //   }
    // }, 5000);
    // if (!this.state.nicaiCrx) {
    //   this.setState({ nicaiCrx }, () => {
    //     setTimeout(() => {
    //       this.handleGetVersion();
    //     }, 600);
    //   });
    // }
    if (this.props.task.auctionIds && this.props.task.auctionIds.length > 0) {
      queryAuctionOrders({auctionIds: JSON.stringify(this.props.task.auctionIds)}).then(result => {
        if (!result.error) {
          this.setState({ auctionOrders: result.list, loading: false });
        }
      });
    } else {
      this.setState({ auctionOrders: [], loading: false });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.task._id && nextProps.task._id !== this.props.task._id) {
      // this.handleGetAnalyzeData(nextProps.task);
      if (nextProps.task.auctionIds && nextProps.task.auctionIds.length > 0) {
        queryAuctionOrders({auctionIds: JSON.stringify(nextProps.task.auctionIds)}).then(result => {
          if (!result.error) {
            this.setState({ auctionOrders: result.list, loading: false });
          }
        });
      } else {
        this.setState({ auctionOrders: [], loading: false });
      }
    }
  }
  componentWillUnmount() {
    // const nicaiCrx = document.getElementById('nicaiCrx');
    // nicaiCrx.removeEventListener('setVersion', this.setVersion);
    // nicaiCrx.removeEventListener('setAnalyzeData', this.setAnalyzeData);
  }
  // setVersion = (e) => {
  //   const data = JSON.parse(e.target.innerText);
  //   if (data.error) {
  //     message.warn(data.msg);
  //   }
  //   this.setState({
  //     version: data.version,
  //   })
  //   this.handleGetAnalyzeData(this.props.task);
  // }
  // setAnalyzeData = (e) => {
  //   const data = JSON.parse(e.target.innerText);
  //   // console.log(data);
  //   this.setState({
  //     summary: data.data,
  //   });
  // }
  // handleGetVersion = () => {
  //   const customEvent = document.createEvent('Event');
  //   customEvent.initEvent('getVersion', true, true);
  //   this.state.nicaiCrx.dispatchEvent(customEvent);
  // }
  // handleGetAnalyzeData = (task) => {
  //   if (task.taobao && task.taobao.contentId) {
  //     this.state.nicaiCrx.innerText = JSON.stringify(task.taobao);
  //     const customEvent = document.createEvent('Event');
  //     customEvent.initEvent('getAnalyzeData', true, true);
  //     this.state.nicaiCrx.dispatchEvent(customEvent);
  //   }
  // }
  render() {
    const { task } = this.props;
    const summary = task.taobao && task.taobao.summary ? task.taobao.summary : {};
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
    const columns = [
      {
        title: '商品',
        dataIndex: 'auctionTitle',
        render: (val, record) => <a href={record.auctionUrl} target="_blank">{val}</a>,
      },
      {
        title: '订单状态',
        dataIndex: 'payStatus',
        render: (val) => {
          // 3 订单结算 12 订单付款 13 订单失效
          if (val === 3) {
            return (<span style={{ color: '#5aa62e' }}>订单结算</span>);
          } else if (val === 12) {
            return (<span style={{ color: '#5aa62e' }}>订单付款</span>);
          } else if (val === 13) {
            return (<span style={{ color: 'red' }}>订单付款</span>);
          } else {
            return '未知'
          }
        },
      },
      {
        title: '付款金额',
        dataIndex: 'totalAlipayFee',
        render: (val) => val.toFixed(2),
      },
      {
        title: '淘客佣金',
        dataIndex: 'fee',
        render: (val) => val.toFixed(2),
      },
    ];
    return (
      <Card>
        <Row>
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
        </Row>
        <Row style={{ marginTop: 10 }}>
          <Table
            size="small"
            loading={this.state.loading}
            dataSource={this.state.auctionOrders}
            columns={columns}
            rowKey="_id"
          />
        </Row>
      </Card>
    );
  }
}
