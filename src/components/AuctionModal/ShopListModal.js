import React, { PureComponent } from 'react';
import { connect } from 'dva';
import entities from 'entities';
import { Card, Modal, message, Input, Tabs, Select, Table } from 'antd';
import styles from './index.less';

import { queryTaobaoShops } from '../../services/material';

const TabPane = Tabs.TabPane;
const Search = Input.Search;
const urlBefore = 'http://gw.alicdn.com/imgextra/';

@connect(state => ({
  visible: state.auction.shopList.visible,
  currentKey: state.auction.shopList.currentKey,
}))
  
export default class ShopListModal extends PureComponent {
  state = {
    selectedRows: [],
    selectedRowKeys: [],
    pagination: {
      pageSize: 10,
      current: 1,
      total: 0,
    },
    list: [],
    loading: true,
    searchValue: '',
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.k === nextProps.currentKey) {
      const { pagination, effective } = this.state;
      this.handleGetData({
        pageSize: pagination.pageSize,
        currentPage: 1,
      });
    }
  }

  handleCancel = () => {
    this.props.dispatch({
      type: 'auction/hideShopList',
    });
  }
  handleOk = () => {
    const result = this.state.selectedRows;
    if (this.props.onOk) this.props.onOk(result);
    this.props.dispatch({
      type: 'auction/hideShopList',
    });
  }

  handleGetData = async (params) => {
    const result = await queryTaobaoShops(params);
    this.setState({
      ...result,
      loading: false,
    });
  }
  handleChange = (pagination, filters, sorter) => {
    if (pagination.current !== this.state.pagination.current || pagination.pageSize !== this.state.pagination.pageSize) {
      this.setState({
        pagination,
        loading: true,
      });
      const { searchValue } = this.state;
      this.handleGetData({
        pageSize: pagination.pageSize,
        currentPage: pagination.current,
        search: searchValue
      });
    }
  }
  handleSearch = (searchValue) => {
    this.setState({ searchValue, loading: true });
    const { pagination } = this.state;
    const params = {
      pageSize: pagination.pageSize,
      currentPage: 1,
      search: searchValue
    };

    this.handleGetData(params);
  }
  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  }
  
  render() {
    const { visible, k, currentKey } = this.props;
    const { list, pagination, loading, searchValue, selectedRowKeys } = this.state;
    const columns = [{
      title: '店铺 id',
      dataIndex: 'id',
      width: 60,
    }, {
      title: '店铺名称',
      dataIndex: 'shopName',
      width: 200,
    }, {
      title: '特色类型',
      dataIndex: 'category1',
      width: 100,
    }, {
      title: '图文内容数',
      dataIndex: 'contentCount',
      width: 70,
    }, {
      title: '视频内容数',
      dataIndex: 'videoCount',
      width: 70,
    }, {
      title: '主营宝贝',
      dataIndex: 'item1',
      width: 100,
      render: (val) => <img src={`${urlBefore}${val}`} style={{ width: 80 }}/>
    }];
    const rowSelection = {
      selectedRowKeys,
      hideDefaultSelections: true,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
      type: 'radio',
    };
    return (
      <Modal
        title="选择店铺"
        width="1000px"
        visible={k === currentKey && visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        style={{ top: 40 }}
        bodyStyle={{ padding: '5px 20px', position: 'relative' }}
      >
        <div>
          <div style={{ marginBottom: 10 }}>
            <Search
              style={{ width: '100%' }}
              value={searchValue}
              onChange={e => this.setState({ searchValue: e.target.value })}
              onSearch={this.handleSearch}
              enterButton
              placeholder="店铺 id/店铺名称"
            />
          </div>
          <Table
            loading={loading}
            dataSource={list}
            columns={columns}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              ...pagination,
            }}
            onChange={this.handleChange}
            rowKey="id"
            scroll={{ y: 380 }}
            rowSelection={rowSelection}
            size="small"
          />
        </div>
      </Modal>
    );
  }
}
