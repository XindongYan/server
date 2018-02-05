import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Divider, Table, message } from 'antd';
import moment from 'moment';
import { queryAuctionOrders } from '../../../services/task';

export default class AnalyzePane extends PureComponent {
  state = {
    auctionOrders: [],
    pagination: {
      current: 1,
      pageSize: 10,
    },
    loading: true,
  }
  componentDidMount() {
    if (this.props.task.auctionIds && this.props.task.auctionIds.length > 0) {
      queryAuctionOrders({auctionIds: JSON.stringify(this.props.task.auctionIds)}).then(result => {
        if (!result.error) {
          this.setState({
            auctionOrders: result.list,
            loading: false,
            pagination: {
              current: 1,
              pageSize: 10,
            },
          });
        }
      });
    } else {
      this.setState({
        auctionOrders: [],
        loading: false,
        pagination: {
          current: 1,
          pageSize: 10,
        },
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.task._id && nextProps.task._id !== this.props.task._id) {
      // this.handleGetAnalyzeData(nextProps.task);
      if (nextProps.task.auctionIds && nextProps.task.auctionIds.length > 0) {
        queryAuctionOrders({auctionIds: JSON.stringify(nextProps.task.auctionIds)}).then(result => {
          if (!result.error) {
            this.setState({
              auctionOrders: result.list,
              loading: false,
              pagination: {
                current: 1,
                pageSize: 10,
              },
            });
          }
        });
      } else {
        this.setState({
          auctionOrders: [],
          loading: false,
          pagination: {
            current: 1,
            pageSize: 10,
          },
        });
      }
    }
  }
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    console.log(pagination);
   this.setState({ pagination });
  }
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
            return (<span style={{ color: 'red' }}>订单失效</span>);
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
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              ...this.state.pagination,
            }}
            onChange={this.handleStandardTableChange}
            rowKey="_id"
          />
        </Row>
      </Card>
    );
  }
}
