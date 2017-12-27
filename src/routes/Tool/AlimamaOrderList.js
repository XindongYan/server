import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import querystring from 'querystring';
import { Table, Card, Button, message } from 'antd';
import { Link } from 'dva/router';
 
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
        title: '创建时间',
        dataIndex: 'createTime',
        render: (val) => val ? moment(val).format('YYYY-MM-DD HH:mm') : '',
      },
      {
        title: '店铺名称',
        dataIndex: 'exShopTitle',
      },
      {
        title: 'auctionTitle',
        dataIndex: 'auctionTitle',
      },
      {
        title: '效果预估',
        dataIndex: 'feeString',
      },
      {
        title: '付款金额',
        dataIndex: 'totalAlipayFeeString',
      },
    ];
    return (
      <div>
        
        <Card bordered={false} bodyStyle={{ padding: 14 }}>
          <div>
            <div >

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
              rowKey="_id"
            />
          </div>
        </Card>
      </div>
    );
  }
}