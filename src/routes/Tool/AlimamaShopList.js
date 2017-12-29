import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Button, Modal, Card, Select, Input, message, DatePicker } from 'antd';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const Search = Input.Search;
const { RangePicker } = DatePicker;

@connect(state => ({
  alimamaShops: state.tool.alimamaShops,
  loading: state.tool.alimamaShopsloading,
  currentUser: state.user.currentUser,
}))

export default class AlimamaShopList extends PureComponent {
  state = {

  };

  componentDidMount() {
    const { currentUser, alimamaShops: { pagination } } = this.props;
    if (currentUser._id) {
      this.props.dispatch({
        type: 'tool/fetchAlimamaShops',
        payload: { user_id: currentUser._id },
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser._id !== this.props.currentUser._id) {
      this.props.dispatch({
        type: 'tool/fetchAlimamaShops',
        payload: { user_id: nextProps.currentUser._id },
      });
    }
  }
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, currentUser } = this.props;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      user_id: currentUser._id,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'tool/fetchAlimamaShops',
      payload: params,
    });
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  }
  handleSearch = (value, name) => {
    const { dispatch, currentUser, alimamaShops: { pagination } } = this.props;
    const values = {
      user_id: currentUser._id,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    if(name === 'time') {
      values['createTime_start'] = value[0] ? value[0].format('YYYY-MM-DD 00:00:00') : '';
      values['createTime_end'] = value[1] ? value[1].format('YYYY-MM-DD 23:59:59') : '';
    } else {
      values[name] = value;
    }
    dispatch({
      type: 'tool/fetchAlimamaShops',
      payload: values,
    });
  }

  render() {
    const { alimamaShops, loading,  } = this.props;

    const columns = [
      {
        title: '店铺名称',
        dataIndex: 'exNickName',
      },
      {
        title: '付款金额',
        dataIndex: 'totalAlipayFee',
        render: (val) => val.toFixed(2),
      },
      {
        title: '效果预估',
        dataIndex: 'fee',
        render: (val) => val.toFixed(2),
      },
    ];
    
    return (
      <div>
        <div style={{ marginBottom: 10 }}>
          {/*
            <Select
            allowClear
            showSearch
            style={{ width: 160, marginRight: 8 }}
            placeholder="订单付款"
            onChange={(value) => this.handleSearch(value,'channel_name')}
            optionFilterProp="children"
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            <Option key={1} value={1}>{1}</Option>
          </Select>
          */}
          <RangePicker style={{ width: 240 }} onChange={(value) => this.handleSearch(value,'time')} />
          <Search
            style={{ width: 260, float: 'right'}}
            placeholder="店铺名称"
            onSearch={(value) => this.handleSearch(value, 'search')}
            enterButton
          />
        </div>
        <Table
          loading={loading}
          dataSource={alimamaShops.list}
          columns={columns}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            ...alimamaShops.pagination,
          }}
          onChange={this.handleStandardTableChange}
          rowKey="exMemberId"
        />
      </div>
    );
  }
}