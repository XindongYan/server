import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import querystring from 'querystring';
import { Table, Card, Button, Tabs, Modal, message } from 'antd';
import { Link } from 'dva/router';
import AlimamaShopOrderList from './AlimamaShopOrderList';
const TabPane = Tabs.TabPane;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  alimamaOrders: state.tool.alimamaOrders,
  loading: state.tool.projectTaskLoading,
  currentUser: state.user.currentUser,
}))

export default class AlimamaOrderList extends PureComponent {
  state = {

  };

  componentDidMount() {
    const { currentUser, alimamaOrders: { pagination } } = this.props;
    if (currentUser._id) {
      this.props.dispatch({
        type: 'tool/fetchAlimamaOrders',
        payload: { user_id: currentUser._id },
      });
    }
    Modal.confirm({
      title: '更新数据需要登录阿里妈妈',
      content: '点击确定去登录',
      onOk() {
        window.open('http://pub.alimama.com/myunion.htm?spm=a219t.7900221/1.1998910419.db9f5f632.6cc0f2fbJH3A8I#!/report/detail/taoke');
      },
      onCancel() {
        
      },
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser._id !== this.props.currentUser._id) {
      this.props.dispatch({
        type: 'tool/fetchAlimamaOrders',
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
      type: 'tool/fetchAlimamaOrders',
      payload: params,
    });
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  }
  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'task/fetch',
        payload: values,
      });
    });
  }

  render() {
    const { alimamaOrders, loading,  } = this.props;
    const columns = [
      {
        title: '商品名称',
        dataIndex: 'auctionTitle',
        render: (val, record) => <a href={record.auctionUrl} target="_blank">{val}</a>,
      },
      {
        title: '付款金额',
        dataIndex: 'totalAlipayFeeString',
      },
      {
        title: '效果预估',
        dataIndex: 'feeString',
      },
      {
        title: '店铺名称',
        dataIndex: 'exShopTitle',
      },
    ];
    return (
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
        rowKey="_id"
      />
    );
  }
}