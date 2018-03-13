import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Divider, Table, Tooltip, Icon, message } from 'antd';
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
   this.setState({ pagination });
  }
  render() {
    const { task } = this.props;
    const orders = this.state.auctionOrders.filter(item => item.payStatus === 3 || item.payStatus === 12);
    const summary = (task.taobao && task.taobao.summary) ? task.taobao.summary : {};
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
        title: <div>
                商品
                <Tooltip placement="top" title="同一订单出现在多个任务下，说明这些任务都写了这一宝贝">
                  <Icon type="question-circle-o" style={{ marginLeft: 4 }} />
                </Tooltip>
              </div>,
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
        render: (val) => val > 0 ? `￥${val.toFixed(2)}` : '--',
      },
      {
        title: '效果预估',
        dataIndex: 'fee',
        render: (val) => val > 0 ? `￥${val.toFixed(2)}` : '--',
      },
    ];
    const incomeRewardcolumns = [
      {
        title: '日期',
        dataIndex: 'date',
      },
      {
        title: '动态奖励推广费',
        dataIndex: 'fee',
        render: (val) => val >= 0 ? `￥${val.toFixed(2)}` : val,
      },
      {
        title: '奖励原因',
        dataIndex: 'reason',
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
            {summary.updateTime && task.taobao && task.taobao.user && <Divider type="vertical" />}
            {summary.updateTime && <span><span>数据更新时间：</span><span>{moment(new Date(summary.updateTime)).format('YYYY年MM月DD日')}</span></span>}
          </div>
        </Row>
        <Row style={{ marginTop: 20 }}>
          <Table
            size="small"
            title={() => `动态奖励推广费 （内容ID：${task.taobao ? task.taobao.contentId : ''}）`}
            dataSource={(task.taobao && task.taobao.incomeRewards) ? task.taobao.incomeRewards : []}
            columns={incomeRewardcolumns}
            rowKey="date"
          />
        </Row>

        <Row style={{ marginTop: 20 }}>
          <Card.Grid style={{ width: `50%`, textAlign: 'center' }}>
            <div>
              付款金额
              <Tooltip placement="top" title="订单状态为【订单结算】与【订单付款】的付款金额之和">
                <Icon type="question-circle-o" style={{ marginLeft: 8 }} />
              </Tooltip>
            </div>
            <h2>
              {`￥${orders.map(item => item.totalAlipayFee).reduce((a, b) => a + b, 0).toFixed(2)}`}
            </h2>
          </Card.Grid>
          <Card.Grid style={{ width: `50%`, textAlign: 'center' }}>
            <div>
              效果预估
              <Tooltip placement="top" title="订单状态为【订单结算】与【订单付款】的效果预估之和">
                <Icon type="question-circle-o" style={{ marginLeft: 8 }} />
              </Tooltip>
            </div>
            <h2>
              {`￥${orders.map(item => item.fee).reduce((a, b) => a + b, 0).toFixed(2)}`}
            </h2>
          </Card.Grid>
        </Row>
        <Row style={{ marginTop: 0 }}>
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
