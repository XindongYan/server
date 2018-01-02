import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Button, Modal, Card, Select, Input, message, DatePicker } from 'antd';
import { Link } from 'dva/router';
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const Search = Input.Search;
const { RangePicker } = DatePicker;

@connect(state => ({
  alimamaOrders: state.tool.alimamaOrders,
  loading: state.tool.alimamaOrdersloading,
  currentUser: state.user.currentUser,
}))

export default class AlimamaOrderList extends PureComponent {
  state = {
    searchValue: '',
    createTime_start: '',
    createTime_end: '',
  };

  componentDidMount() {
    const { currentUser, alimamaOrders: { pagination }, memberid } = this.props;
    if (currentUser._id) {
      this.props.dispatch({
        type: 'tool/fetchAlimamaOrders',
        payload: {
          user_id: currentUser._id,
          memberid: memberid || (currentUser.alimama[0] ? currentUser.alimama[0].memberid : ''),
        },
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { currentUser, memberid } = nextProps;
    if (nextProps.currentUser._id !== this.props.currentUser._id || (nextProps.currentUser._id && nextProps.memberid !== this.props.memberid)) {
      this.props.dispatch({
        type: 'tool/fetchAlimamaOrders',
        payload: {
          user_id: nextProps.currentUser._id,
          memberid: memberid || (currentUser.alimama[0] ? currentUser.alimama[0].memberid : ''),
        },
      });
    }
  }
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, currentUser, memberid } = this.props;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      user_id: currentUser._id,
      memberid: memberid || (currentUser.alimama[0] ? currentUser.alimama[0].memberid : ''),
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
      search: this.state.searchValue,
      createTime_start: this.state.createTime_start,
      createTime_end: this.state.createTime_end,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'tool/fetchAlimamaOrders',
      payload: params,
    });
  }
  handleChange = (e) => {
    this.setState({
      searchValue: e.target.value,
    })
    if (!e.target.value) {
      this.handleSearch(e.target.value, 'search')
    }
  }
  handleSearch = (value, name) => {
    const { dispatch, currentUser, alimamaOrders: { pagination }, memberid } = this.props;
    const values = {
      user_id: currentUser._id,
      memberid: memberid || (currentUser.alimama[0] ? currentUser.alimama[0].memberid : ''),
      currentPage: 1,
      pageSize: pagination.pageSize,
      search: this.state.searchValue,
      createTime_start: this.state.createTime_start,
      createTime_end: this.state.createTime_end,
    };
    if(name === 'time') {
      values['createTime_start'] = value[0] ? value[0].format('YYYY-MM-DD 00:00:00') : '';
      values['createTime_end'] = value[1] ? value[1].format('YYYY-MM-DD 23:59:59') : '';
      this.setState({
        createTime_start: values.createTime_start,
        createTime_end: values.createTime_end,
      })
    } else {
      values[name] = value;
    }
    dispatch({
      type: 'tool/fetchAlimamaOrders',
      payload: values,
    });
  }

  render() {
    const { alimamaOrders, loading,  } = this.props;
    const columns = [
      {
        title: '商品',
        dataIndex: 'auctionTitle',
        render: (val, record) => <a href={record.auctionUrl} target="_blank">{val}</a>,
      },
      {
        title: '付款金额',
        width: 100,
        dataIndex: 'totalAlipayFee',
        render: (val) => val.toFixed(2),
      },
      {
        title: '淘客佣金',
        width: 90,
        dataIndex: 'fee',
        render: (val) => val.toFixed(2),
      },
      {
        title: '所属店铺',
        dataIndex: 'exShopTitle',
      },
      {
        title: '掌柜旺旺',
        width: 100,
        dataIndex: 'exNickName',
      },
    ];
    return (
      <div>
        <div style={{ marginBottom: 10 }}>
          <RangePicker style={{ width: 240 }} onChange={(value) => this.handleSearch(value,'time')} />
          <Search
            style={{ width: 260, float: 'right'}}
            placeholder="商品／店铺名称"
            onChange={this.handleChange}
            onSearch={(value) => this.handleSearch(value, 'search')}
            enterButton
          />
        </div>
        <Table
          loading={loading}
          dataSource={alimamaOrders.list}
          columns={columns}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            ...alimamaOrders.pagination,
          }}
          onChange={this.handleStandardTableChange}
          rowKey="auctionId"
        />
      </div>
    );
  }
}