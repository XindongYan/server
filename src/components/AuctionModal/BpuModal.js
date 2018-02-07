import React, { PureComponent } from 'react';
import { connect } from 'dva';
import entities from 'entities';
import { Card, Modal, message, Input, Tabs, Select, Table } from 'antd';
import styles from './index.less';

import { queryBpus, queryBpu } from '../../services/material';

const TabPane = Tabs.TabPane;
const Search = Input.Search;
const Option = Select.Option;

const dataTypeFilters = [{
  text: '优选内容',
  value: 1,
}, {
  text: '品牌播报长图文',
  value: 2,
}, {
  text: '播报清单',
  value: 3,
}];

const albumCountFilters = [{
  text: '已关联',
  value: 'yes',
}, {
  text: '未关联',
  value: 'no',
}, {
  text: '不限',
  value: 'unlimit',
}];

const picTextCountFilters = [{
  text: '已关联',
  value: 'yes',
}, {
  text: '未关联',
  value: 'no',
}, {
  text: '不限',
  value: 'unlimit',
}];

@connect(state => ({
  visible: state.auction.bbuModal.visible,
  currentKey: state.auction.bbuModal.currentKey,
}))
  
export default class BpuModal extends PureComponent {
  state = {
    // nicaiCrx: null,
    // version: '',
    activeKey: 'bpuValuesPage',
    bpuValuesPage: {
      selectedRows: [],
      selectedRowKeys: [],
      pagination: {
        pageSize: 15,
        current: 1,
        total: 0,
      },
      list: [],
      loading: true,
      effective: true,
      searchField: 'title',
      searchValue: '',
      sorter: {},
    },
    bPUSelectionData: {
      selectedRows: [],
      selectedRowKeys: [],
      pagination: {
        pageSize: 15,
        current: 1,
        total: 0,
      },
      list: [],
      loading: true,
      effective: true,
      searchField: 'title',
      searchValue: '',
      maxPrice: '',
      minPrice: '',
      sorter: {},
    },
    bPUFromMemberStoreData: {
      selectedRows: [],
      selectedRowKeys: [],
      pagination: {
        pageSize: 15,
        current: 1,
        total: 0,
      },
      list: [],
      loading: true,
      effective: true,
      searchField: 'title',
      searchValue: '',
      maxPrice: '',
      minPrice: '',
      sorter: {},
      sellerNick: '',
    },
    bpuFromOnlineData: {
      selectedRows: [],
      selectedRowKeys: [],
      pagination: {
        pageSize: 15,
        current: 1,
        total: 0,
      },
      list: [],
      loading: true,
      effective: true,
      searchField: 'title',
      searchValue: '',
      maxPrice: '',
      minPrice: '',
      sorter: {},
    },
    bpuValue: {},
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.k === nextProps.currentKey) {
    //   if (!this.props.visible && nextProps.visible) {
    //     const nicaiCrx = document.getElementById('nicaiCrx');
    //     nicaiCrx.addEventListener('setVersion', this.setVersion);
    //     nicaiCrx.addEventListener('setBpuValuesPage', this.setBpuValuesPage);
    //     nicaiCrx.addEventListener('setBPUSelectionData', this.setBPUSelectionData);
    //     nicaiCrx.addEventListener('setBPUFromMemberStoreData', this.setBPUFromMemberStoreData);
    //     nicaiCrx.addEventListener('setBpuFromOnlineData', this.setBpuFromOnlineData);
    //     nicaiCrx.addEventListener('setBpuValueById', this.setBpuValueById);
    //     if (!this.state.nicaiCrx) {
    //       this.setState({ nicaiCrx }, () => {
    //         setTimeout(() => {
    //           this.handleGetVersion();
    //         }, 600);
    //       });
    //     }
    //     setTimeout(() => {
    //       if(!this.state.version){
    //         message.destroy();
    //         message.warn('请安装尼采创作平台插件！');
    //         this.setState({ loading: false });
    //       }
    //     }, 5000);
    //   } else if (this.props.visible && !nextProps.visible) {
    //     const nicaiCrx = document.getElementById('nicaiCrx');
    //     nicaiCrx.removeEventListener('setBpuValueById', this.setBpuValueById);
    //     nicaiCrx.removeEventListener('setBpuFromOnlineData', this.setBpuFromOnlineData);
    //     nicaiCrx.removeEventListener('setBPUFromMemberStoreData', this.setBPUFromMemberStoreData);
    //     nicaiCrx.removeEventListener('setBPUSelectionData', this.setBPUSelectionData);
    //     nicaiCrx.removeEventListener('setBpuValuesPage', this.setBpuValuesPage);
    //   }
      const { pagination, effective } = this.state.bpuValuesPage;
      this.handleGetBpuValuesPage({
        pageSize: pagination.pageSize,
        currentPage: 1,
        effective,
      });
    }
  }
  // handleGetVersion = () => {
  //   const customEvent = document.createEvent('Event');
  //   customEvent.initEvent('getVersion', true, true);
  //   this.state.nicaiCrx.dispatchEvent(customEvent);
  // }
  // setVersion = (e) => {
  //   const data = JSON.parse(this.state.nicaiCrx.innerText);
  //   if (data.version) {
  //     this.setState({
  //       version: data.version,
  //     });
  //   }
  //   this.state.nicaiCrx.removeEventListener('setVersion', this.setVersion);
  //   if (data.error) {
  //     message.destroy();
  //     message.warn(data.msg, 60 * 60);
  //     this.setState({
  //       loading: false,
  //     });
  //   } else {
  //     const { pagination, effective } = this.state.bpuValuesPage;
  //     this.handleGetBpuValuesPage({
  //       pageSize: pagination.pageSize,
  //       currentPage: 1,
  //       effective,
  //     });
  //   }
  // }
  handleCancel = () => {
    this.props.dispatch({
      type: 'auction/hideBbu',
    });
  }
  handleOk = () => {
    const result = this.state[this.state.activeKey].selectedRows;
    if (this.props.onOk) this.props.onOk(result);
    this.props.dispatch({
      type: 'auction/hideBbu',
    });
  }

  handleChangeTab = (activeKey) =>{
    if (activeKey === 'bpuValuesPage') {
      const { pagination, effective } = this.state[activeKey];
      this.handleGetBpuValuesPage({ pageSize: pagination.pageSize, currentPage: 1, effective });
    } else if (activeKey === 'bPUSelectionData') {
      const { pagination, effective } = this.state[activeKey];
      this.handleGetBPUSelectionData({ pageSize: pagination.pageSize, currentPage: 1, effective });
    } else if (activeKey === 'bPUFromMemberStoreData') {
      const { pagination, effective } = this.state[activeKey];
      this.handleGetBPUFromMemberStoreData({ pageSize: pagination.pageSize, currentPage: 1, effective });
    } else if (activeKey === 'bpuFromOnlineData') {
      const { pagination, effective } = this.state[activeKey];
      this.handleGetBpuFromOnlineData({ pageSize: pagination.pageSize, currentPage: 1, effective });
    }
    this.setState({
      activeKey
    })
  }
  setBpuValueById = () => {
    const data = JSON.parse(this.state.nicaiCrx.innerText);
    if (data.error) {
      message.error(data.msg, 60 * 60);
    } else {
      this.setState({ bpuValue: data });
    }
  }
  handleLoadBpuValue = async (record) => {
    // const params = {
    //   finalBpuId: record.finalBpuId,
    //   nocache: 1,
    // };
    // this.state.nicaiCrx.innerText = JSON.stringify(params);
    // const customEvent = document.createEvent('Event');
    // customEvent.initEvent('getBpuValueById', true, true);
    // this.state.nicaiCrx.dispatchEvent(customEvent);

    const result = await queryBpu({ finalBpuId: record.finalBpuId });
    this.setState({ bpuValue: result.bpu });
  }
  countImgNum = (text) => {
    const reg = /((http:|https:)?)\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@\/~\+\!]*[\w\-\@\/~\+\!])+/g;
    if (text) {
      const result = text.match(reg);
      if (result) return result.length;
      else return 0;
    } else {
      return 0;
    }
  }
  // ============================================================================================================
  setBpuValuesPage = (e) => {
    const data = JSON.parse(e.target.innerText);
    if (!data.error) {
      this.setState({
        bpuValuesPage: {
          ...this.state.bpuValuesPage,
          ...data,
          pagination: {
            ...this.state.bpuValuesPage.pagination,
            total: data.total,
          },
          loading: false,
        },
      });
    } else {
      message.destroy();
      message.warn(data.msg);
      this.setState({
        bpuValuesPage: {
          ...this.state.bpuValuesPage,
          loading: false,
        },
      });
    }
  }
  handleGetBpuValuesPage = async (params) => {
    // this.state.nicaiCrx.innerText = JSON.stringify(params);
    // const customEvent = document.createEvent('Event');
    // customEvent.initEvent('getBpuValuesPage', true, true);
    // this.state.nicaiCrx.dispatchEvent(customEvent);

    const result = await queryBpus({...params, type: 'bpuValuesPage'});
    if (result.list)
      result.list = result.list.map(item => { return {...item, htmlDescCount: this.countImgNum(item.htmlDesc) }; });
    this.setState({
      bpuValuesPage: {
        ...this.state.bpuValuesPage,
        ...result,
        loading: false,
      },
    });
  }
  changeBpuValuesPagePage = (pagination, filters, sorter) => {
    if (pagination.current !== this.state.bpuValuesPage.pagination.current || pagination.pageSize !== this.state.bpuValuesPage.pagination.pageSize) {
      this.setState({
        bpuValuesPage: {
          ...this.state.bpuValuesPage,
          pagination,
          loading: true,
          sorter,
        }
      });
      const { effective, searchField, searchValue } = this.state.bpuValuesPage;
      this.handleGetBpuValuesPage({
        pageSize: pagination.pageSize,
        currentPage: pagination.current,
        effective,
        [searchField]: searchValue,
      });
    } else {
      this.setState({
        bpuValuesPage: {
          ...this.state.bpuValuesPage,
          sorter,
        }
      });
    }
  }
  handleSearchBpuValuesPage = (searchValue) => {
    this.setState({ bpuValuesPage: { ...this.state.bpuValuesPage, searchValue, loading: true } });
    const { pagination, effective, searchField } = this.state.bpuValuesPage;
    const params = {
      pageSize: pagination.pageSize,
      currentPage: 1,
      effective,
      [searchField]: searchValue,
    };

    this.handleGetBpuValuesPage(params);
  }
  handleBpuValuesPageRowSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ bpuValuesPage: { ...this.state.bpuValuesPage, selectedRowKeys, selectedRows } });
  }
  renderBpuValuesPage = () => {
    const { bpuValuesPage: { list, pagination, loading, searchField, searchValue, selectedRowKeys, sorter } } = this.state;
    const columns = [{
      title: '商品细节',
      dataIndex: 'title',
      width: 300,
      render: (val, record) => (
        <div>
          <img src={record.mainPicUrl} style={{ width: 50, display: 'inline-block', verticalAlign: 'top' }}/>
          <div style={{ width: 200, display: 'inline-block', verticalAlign: 'top', marginLeft: 5 }}>
            <div style={{ color: '#999' }}>{record.finalBpuId}</div>
            <div>{record.title}</div>
          </div>
        </div>
      ),
    }, {
      title: '类目',
      dataIndex: 'categoryName',
      width: 130,
    }, {
      title: '品牌',
      dataIndex: 'brandName',
      width: 130,
    }, {
      title: '是否缺内容',
      dataIndex: 'contentRare',
      width: 130,
      render: (val) => val ? '是' : '否',
      filters: [{
        text: '是',
        value: 'true',
      }, {
        text: '否',
        value: 'false',
      }, {
        text: '不限',
        value: 'unlimit',
      }],
      filterMultiple: false,
      onFilter: (value, record) => value === 'unlimit' ? true : String(record.contentRare) === value,
    }, {
      title: '详情含图数',
      dataIndex: 'htmlDescCount',
      width: 100,
      sorter: (a, b) => a.htmlDescCount - b.htmlDescCount,
      sortOrder: sorter.columnKey === 'htmlDescCount' && sorter.order,
    }];
    const rowSelection = {
      selectedRowKeys,
      hideDefaultSelections: true,
      onChange: this.handleBpuValuesPageRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    const selectBefore = (
      <Select
        style={{ width: 100 }}
        value={searchField}
        onSelect={value => this.setState({ bpuValuesPage: { ...this.state.bpuValuesPage, searchField: value } })}
      >
        <Option value="title">商品标题</Option>
        <Option value="finalBpuId">ID</Option>
        <Option value="categoryName">类目</Option>
        <Option value="brandName">品牌</Option>
      </Select>
    );
    return (
      <div>
        <div style={{ marginBottom: 10 }}>
          <Search
            addonBefore={selectBefore}
            style={{ width: 400 }}
            value={searchValue}
            onChange={e => this.setState({ bpuValuesPage: { ...this.state.bpuValuesPage, searchValue: e.target.value } })}
            onSearch={this.handleSearchBpuValuesPage}
            enterButton
            placeholder="搜索商品名称、ID、类目、品牌"
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
          onChange={this.changeBpuValuesPagePage}
          rowKey="finalBpuId"
          scroll={{ y: 380 }}
          bordered={true}
          rowSelection={rowSelection}
          onRow={(record) => ({
            onClick: () => this.handleLoadBpuValue(record),
            onDoubleClick: () => {},
            onContextMenu: () => {},
            onMouseEnter: () => {},
            onMouseLeave: () => {},
          })}
          size="small"
        />
      </div>
    );
  }
  // ============================================================================================================
  setBPUSelectionData = (e) => {
    const data = JSON.parse(e.target.innerText);
    if (!data.error) {
      this.setState({
        bPUSelectionData: {
          ...this.state.bPUSelectionData,
          ...data,
          pagination: {
            ...this.state.bPUSelectionData.pagination,
            total: data.total,
          },
          loading: false,
        },
      });
    } else {
      message.destroy();
      message.warn(data.msg);
      this.setState({
        bPUSelectionData: {
          ...this.state.bPUSelectionData,
          loading: false,
        },
      });
    }
  }
  handleGetBPUSelectionData = async (params) => {
    // this.state.nicaiCrx.innerText = JSON.stringify(params);
    // const customEvent = document.createEvent('Event');
    // customEvent.initEvent('getBPUSelectionData', true, true);
    // this.state.nicaiCrx.dispatchEvent(customEvent);

    const result = await queryBpus({...params, type: 'bPUSelectionData'});
    if (result.list)
      result.list = result.list.map(item => { return {...item, htmlDescCount: this.countImgNum(item.htmlDesc) }; });
    this.setState({
      bPUSelectionData: {
        ...this.state.bPUSelectionData,
        ...result,
        loading: false,
      },
    });
  }
  changeBPUSelectionDataPage = (pagination, filters, sorter) => {
    const { bPUSelectionData } = this.state;
    if (pagination.current !== bPUSelectionData.pagination.current || pagination.pageSize !== bPUSelectionData.pagination.pageSize) {
      this.setState({
        bPUSelectionData: {
          ...this.state.bPUSelectionData,
          pagination,
          loading: true,
          sorter,
        }
      });
      const { effective, maxPrice, minPrice, searchField, searchValue } = this.state.bPUSelectionData;
      this.handleGetBPUSelectionData({
        pageSize: pagination.pageSize,
        currentPage: pagination.current,
        effective, maxPrice, minPrice,
        [searchField]: searchValue,
      });
    } else {
      this.setState({
        bPUSelectionData: {
          ...this.state.bPUSelectionData,
          sorter,
        }
      });
    }
  }
  handleSearchBPUSelectionData = (searchValue) => {
    this.setState({ bPUSelectionData: { ...this.state.bPUSelectionData, searchValue, loading: true } });
    const { pagination, effective, maxPrice, minPrice, searchField } = this.state.bPUSelectionData;
    const params = {
      pageSize: pagination.pageSize,
      currentPage: 1,
      effective, maxPrice, minPrice,
      [searchField]: searchValue,
    };
    this.handleGetBPUSelectionData(params);
  }
  handleBPUSelectionDataRowSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ bPUSelectionData: { ...this.state.bPUSelectionData, selectedRowKeys, selectedRows } });
  }
  renderBPUSelectionData = () => {
    const { bPUSelectionData: { list, pagination, loading, searchField, searchValue, selectedRowKeys, maxPrice, minPrice, sorter } } = this.state;
    const columns = [{
      title: '商品细节',
      dataIndex: 'title',
      width: 220,
      render: (val, record) => (
        <div>
          <img src={record.mainPicUrl} style={{ width: 50, display: 'inline-block', verticalAlign: 'top' }}/>
          <div style={{ width: 170, display: 'inline-block', verticalAlign: 'top', marginLeft: 5 }}>
            <div style={{ color: '#999' }}>{record.finalBpuId}</div>
            <div>{record.title}</div>
          </div>
        </div>
      ),
    }, {
      title: '类目',
      dataIndex: 'categoryName',
      width: 60,
    }, {
      title: '品牌',
      dataIndex: 'brandName',
      width: 60,
    }, {
      title: '是否缺内容',
      dataIndex: 'contentRare',
      width: 60,
      render: (val) => val ? '是' : '否',
      filters: [{
        text: '是',
        value: '1',
      }, {
        text: '否',
        value: '0',
      }, {
        text: '不限',
        value: 'unlimit',
      }],
      filterMultiple: false,
      onFilter: (value, record) => value === 'unlimit' ? true : String(record.contentRare) === value,
    }, {
      title: '数据类型',
      dataIndex: 'dataType',
      width: 80,
      render: (val) => dataTypeFilters.find(item => item.value === val).text,
      filters: dataTypeFilters,
      filterMultiple: false,
      onFilter: (value, record) => value === 'unlimit' ? true : String(record.dataType) === value,
    }, {
      title: '价格',
      dataIndex: 'price',
      width: 60,
      sorter: (a, b) => a.price - b.price,
      sortOrder: sorter.columnKey === 'price' && sorter.order,
    }, {
      title: '关联清单数',
      dataIndex: 'albumCount',
      width: 70,
      filters: albumCountFilters,
      filterMultiple: false,
      onFilter: (value, record) => {
        if (value === 'unlimit') {
          return true;
        } else if (value === 'yes') {
          return record.albumCount > 0;
        } else if (value === 'no') {
          return record.albumCount === 0;
        }
        return true;
      },
      sorter: (a, b) => a.albumCount - b.albumCount,
      sortOrder: sorter.columnKey === 'albumCount' && sorter.order,
    }, {
      title: '关联长图文数',
      dataIndex: 'picTextCount',
      width: 80,
      filters: picTextCountFilters,
      filterMultiple: false,
      onFilter: (value, record) => {
        if (value === 'unlimit') {
          return true;
        } else if (value === 'yes') {
          return record.picTextCount > 0;
        } else if (value === 'no') {
          return record.picTextCount === 0;
        }
        return true;
      },
      sorter: (a, b) => a.picTextCount - b.picTextCount,
      sortOrder: sorter.columnKey === 'picTextCount' && sorter.order,
    }, {
      title: '详情含图数',
      dataIndex: 'htmlDescCount',
      width: 60,
      sorter: (a, b) => a.htmlDescCount - b.htmlDescCount,
      sortOrder: sorter.columnKey === 'htmlDescCount' && sorter.order,
    }];
    const rowSelection = {
      selectedRowKeys,
      hideDefaultSelections: true,
      onChange: this.handleBPUSelectionDataRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    const selectBefore = (
      <Select
        style={{ width: 100 }}
        value={searchField}
        onSelect={value => this.setState({ bPUSelectionData: { ...this.state.bPUSelectionData, searchField: value } })}
      >
        <Option value="title">商品标题</Option>
        <Option value="finalBpuId">ID</Option>
        <Option value="categoryName">类目</Option>
        <Option value="brandName">品牌</Option>
      </Select>
    );
    return (
      <div>
        <div style={{ marginBottom: 10 }}>
          <Search
            addonBefore={selectBefore}
            style={{ width: 400 }}
            value={searchValue}
            onChange={e => this.setState({ bPUSelectionData: { ...this.state.bPUSelectionData, searchValue: e.target.value } })}
            onSearch={this.handleSearchBPUSelectionData}
            enterButton
            placeholder="搜索商品名称、ID、类目、品牌"
          />
          <div style={{ backgroundColor: '#EEE', display: 'inline-block', padding: '0 10px 0 10px' }}>
            <span>价格区间：</span>
            <Input placeholder="￥" style={{ width: 90 }} value={minPrice}
              onChange={e => this.setState({ bPUSelectionData: { ...this.state.bPUSelectionData, minPrice: e.target.value } })}
            />
            <span style={{ margin: '0 5px 0 5px' }}>-</span> 
            <Input placeholder="￥" style={{ width: 90 }} value={maxPrice}
              onChange={e => this.setState({ bPUSelectionData: { ...this.state.bPUSelectionData, maxPrice: e.target.value } })}
            />
          </div>
          
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
          onChange={this.changeBPUSelectionDataPage}
          rowKey="finalBpuId"
          scroll={{ y: 380 }}
          bordered={true}
          rowSelection={rowSelection}
          onRow={(record) => ({
            onClick: () => this.handleLoadBpuValue(record),
            onDoubleClick: () => {},
            onContextMenu: () => {},
            onMouseEnter: () => {},
            onMouseLeave: () => {},
          })}
          size="small"
        />
      </div>
    );
  }
  // ============================================================================================================
  setBPUFromMemberStoreData = (e) => {
    const data = JSON.parse(e.target.innerText);
    if (!data.error) {
      this.setState({
        bPUFromMemberStoreData: {
          ...this.state.bPUFromMemberStoreData,
          ...data,
          pagination: {
            ...this.state.bPUFromMemberStoreData.pagination,
            total: data.total,
          },
          loading: false,
        },
      });
    } else {
      message.destroy();
      message.warn(data.msg);
      this.setState({
        bPUFromMemberStoreData: {
          ...this.state.bPUFromMemberStoreData,
          loading: false,
        },
      });
    }
  }
  handleGetBPUFromMemberStoreData = async (params) => {
    // this.state.nicaiCrx.innerText = JSON.stringify(params);
    // const customEvent = document.createEvent('Event');
    // customEvent.initEvent('getBPUFromMemberStoreData', true, true);
    // this.state.nicaiCrx.dispatchEvent(customEvent);

    const result = await queryBpus({...params, type: 'bPUFromMemberStoreData'});
    if (result.list)
      result.list = result.list.map(item => { return {...item, htmlDescCount: this.countImgNum(item.htmlDesc) }; });
    this.setState({
      bPUFromMemberStoreData: {
        ...this.state.bPUFromMemberStoreData,
        ...result,
        loading: false,
      },
    });
  }
  changeBPUFromMemberStoreData = (pagination, filters, sorter) => {
    const { bPUFromMemberStoreData } = this.state;
    if (pagination.current !== bPUFromMemberStoreData.pagination.current || pagination.pageSize !== bPUFromMemberStoreData.pagination.pageSize) {
      this.setState({
        bPUFromMemberStoreData: {
          ...this.state.bPUFromMemberStoreData,
          pagination,
          loading: true,
          sorter,
        }
      });
      const { effective, maxPrice, minPrice, sellerNick, searchField, searchValue } = this.state.bPUFromMemberStoreData;
      this.handleGetBPUFromMemberStoreData({
        pageSize: pagination.pageSize,
        currentPage: pagination.current,
        effective, maxPrice, minPrice, sellerNick,
        [searchField]: searchValue,
      });
    } else {
      this.setState({
        bPUFromMemberStoreData: {
          ...this.state.bPUFromMemberStoreData,
          sorter,
        }
      });
    }
  }
  handleSearchBPUFromMemberStoreData = (searchValue) => {
    this.setState({ bPUFromMemberStoreData: { ...this.state.bPUFromMemberStoreData, searchValue, loading: true } });
    const { pagination, effective, maxPrice, minPrice, searchField, sellerNick } = this.state.bPUFromMemberStoreData;
    const params = {
      pageSize: pagination.pageSize,
      currentPage: 1,
      effective, maxPrice, minPrice, sellerNick,
      [searchField]: searchValue,
    };
    this.handleGetBPUFromMemberStoreData(params);
  }
  handleBPUFromMemberStoreDataRowSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ bPUFromMemberStoreData: { ...this.state.bPUFromMemberStoreData, selectedRowKeys, selectedRows } });
  }
  renderBPUFromMemberStoreData = () => {
    const { bPUFromMemberStoreData: { list, pagination, loading, searchField, searchValue, selectedRowKeys, maxPrice, minPrice, sorter, sellerNick } } = this.state;
    const columns = [{
      title: '商品细节',
      dataIndex: 'title',
      width: 220,
      render: (val, record) => (
        <div>
          <img src={record.mainPicUrl} style={{ width: 50, display: 'inline-block', verticalAlign: 'top' }}/>
          <div style={{ width: 170, display: 'inline-block', verticalAlign: 'top', marginLeft: 5 }}>
            <div style={{ color: '#999' }}>{record.finalBpuId}</div>
            <div>{record.title}</div>
          </div>
        </div>
      ),
    }, {
      title: '宝贝ID',
      dataIndex: 'itemId',
      width: 60,
    }, {
      title: '商家昵称',
      dataIndex: 'sellerNick',
      width: 80,
    }, {
      title: '类目',
      dataIndex: 'categoryName',
      width: 60,
    }, {
      title: '品牌',
      dataIndex: 'brandName',
      width: 60,
    }, {
      title: '是否缺内容',
      dataIndex: 'contentRare',
      width: 60,
      render: (val) => val ? '是' : '否',
      filters: [{
        text: '是',
        value: '1',
      }, {
        text: '否',
        value: '0',
      }, {
        text: '不限',
        value: 'unlimit',
      }],
      filterMultiple: false,
      onFilter: (value, record) => value === 'unlimit' ? true : String(record.contentRare) === value,
    }, {
      title: '价格',
      dataIndex: 'price',
      width: 60,
      sorter: (a, b) => a.price - b.price,
      sortOrder: sorter.columnKey === 'price' && sorter.order,
    }, {
      title: '关联清单数',
      dataIndex: 'albumCount',
      width: 60,
      filters: albumCountFilters,
      filterMultiple: false,
      onFilter: (value, record) => {
        if (value === 'unlimit') {
          return true;
        } else if (value === 'yes') {
          return record.albumCount > 0;
        } else if (value === 'no') {
          return record.albumCount === 0;
        }
        return true;
      },
      sorter: (a, b) => a.albumCount - b.albumCount,
      sortOrder: sorter.columnKey === 'albumCount' && sorter.order,
    }, {
      title: '关联长图文数',
      dataIndex: 'picTextCount',
      width: 80,
      filters: picTextCountFilters,
      filterMultiple: false,
      onFilter: (value, record) => {
        if (value === 'unlimit') {
          return true;
        } else if (value === 'yes') {
          return record.picTextCount > 0;
        } else if (value === 'no') {
          return record.picTextCount === 0;
        }
        return true;
      },
      sorter: (a, b) => a.picTextCount - b.picTextCount,
      sortOrder: sorter.columnKey === 'picTextCount' && sorter.order,
    }, {
      title: '详情含图数',
      dataIndex: 'htmlDescCount',
      width: 50,
      sorter: (a, b) => a.htmlDescCount - b.htmlDescCount,
      sortOrder: sorter.columnKey === 'htmlDescCount' && sorter.order,
    }];
    const rowSelection = {
      selectedRowKeys,
      hideDefaultSelections: true,
      onChange: this.handleBPUFromMemberStoreDataRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    const selectBefore = (
      <Select
        style={{ width: 100 }}
        value={searchField}
        onSelect={value => this.setState({ bPUFromMemberStoreData: { ...this.state.bPUFromMemberStoreData, searchField: value } })}
      >
        <Option value="title">商品标题</Option>
        <Option value="finalBpuId">ID</Option>
        <Option value="categoryName">类目</Option>
        <Option value="brandName">品牌</Option>
      </Select>
    );
    return (
      <div>
        <div style={{ marginBottom: 10 }}>
          <Search
            addonBefore={selectBefore}
            style={{ width: 400 }}
            value={searchValue}
            onChange={e => this.setState({ bPUFromMemberStoreData: { ...this.state.bPUFromMemberStoreData, searchValue: e.target.value } })}
            onSearch={this.handleSearchBPUFromMemberStoreData}
            enterButton
            placeholder="搜索商品名称、ID、类目、品牌"
          />
          <div style={{ backgroundColor: '#EEE', display: 'inline-block', padding: '0 10px 0 10px' }}>
            <span>价格区间：</span>
            <Input placeholder="￥" style={{ width: 90 }} value={minPrice}
              onChange={e => this.setState({ bPUFromMemberStoreData: { ...this.state.bPUFromMemberStoreData, minPrice: e.target.value } })}
            />
            <span style={{ margin: '0 5px 0 5px' }}>-</span> 
            <Input placeholder="￥" style={{ width: 90 }} value={maxPrice}
              onChange={e => this.setState({ bPUFromMemberStoreData: { ...this.state.bPUFromMemberStoreData, maxPrice: e.target.value } })}
            />
            <span style={{ marginLeft: 10 }}>商家昵称：</span>
            <Input style={{ width: 120, }} value={sellerNick}
              onChange={e => this.setState({ bPUFromMemberStoreData: { ...this.state.bPUFromMemberStoreData, sellerNick: e.target.value } })}
            />
          </div>
          
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
          onChange={this.changeBPUFromMemberStoreData}
          rowKey="finalBpuId"
          scroll={{ y: 380 }}
          bordered={true}
          rowSelection={rowSelection}
          onRow={(record) => ({
            onClick: () => this.handleLoadBpuValue(record),
            onDoubleClick: () => {},
            onContextMenu: () => {},
            onMouseEnter: () => {},
            onMouseLeave: () => {},
          })}
          size="small"
        />
      </div>
    );
  }
  // ============================================================================================================
  setBpuFromOnlineData = (e) => {
    const data = JSON.parse(e.target.innerText);
    if (!data.error) {
      this.setState({
        bpuFromOnlineData: {
          ...this.state.bpuFromOnlineData,
          ...data,
          pagination: {
            ...this.state.bpuFromOnlineData.pagination,
            total: data.total,
          },
          loading: false,
        },
      });
    } else {
      message.destroy();
      message.warn(data.msg);
      this.setState({
        bpuFromOnlineData: {
          ...this.state.bpuFromOnlineData,
          loading: false,
        },
      });
    }
  }
  handleGetBpuFromOnlineData = async (params) => {
    // this.state.nicaiCrx.innerText = JSON.stringify(params);
    // const customEvent = document.createEvent('Event');
    // customEvent.initEvent('getBpuFromOnlineData', true, true);
    // this.state.nicaiCrx.dispatchEvent(customEvent);

    const result = await queryBpus({...params, type: 'bpuFromOnlineData'});
    if (result.list)
      result.list = result.list.map(item => { return {...item, htmlDescCount: this.countImgNum(item.htmlDesc) }; });
    this.setState({
      bpuFromOnlineData: {
        ...this.state.bpuFromOnlineData,
        ...result,
        loading: false,
      },
    });
  }
  changeBpuFromOnlineDataPage = (pagination, filters, sorter) => {
    const { bpuFromOnlineData } = this.state;
    if (pagination.current !== bpuFromOnlineData.pagination.current || pagination.pageSize !== bpuFromOnlineData.pagination.pageSize) {
      this.setState({
        bpuFromOnlineData: {
          ...this.state.bpuFromOnlineData,
          pagination,
          loading: true,
          sorter,
        }
      });
      const { effective, maxPrice, minPrice, searchField, searchValue } = this.state.bpuFromOnlineData;
      this.handleGetBpuFromOnlineData({
        pageSize: pagination.pageSize,
        currentPage: pagination.current,
        effective, maxPrice, minPrice,
        [searchField]: searchValue,
      });
    } else {
      this.setState({
        bpuFromOnlineData: {
          ...this.state.bpuFromOnlineData,
          sorter,
        }
      });
    }
  }
  handleSearchBpuFromOnlineData = (searchValue) => {
    this.setState({ bpuFromOnlineData: { ...this.state.bpuFromOnlineData, searchValue, loading: true } });
    const { pagination, effective, maxPrice, minPrice, searchField } = this.state.bpuFromOnlineData;
    const params = {
      pageSize: pagination.pageSize,
      currentPage: 1,
      effective, maxPrice, minPrice,
      [searchField]: searchValue,
    };
    this.handleGetBpuFromOnlineData(params);
  }
  handleBpuFromOnlineDataRowSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ bpuFromOnlineData: { ...this.state.bpuFromOnlineData, selectedRowKeys, selectedRows } });
  }
  renderBpuFromOnlineData = () => {
    const { bpuFromOnlineData: { list, pagination, loading, searchField, searchValue, selectedRowKeys, maxPrice, minPrice, sorter } } = this.state;
    const columns = [{
      title: '商品细节',
      dataIndex: 'title',
      width: 220,
      render: (val, record) => (
        <div>
          <img src={record.mainPicUrl} style={{ width: 50, display: 'inline-block', verticalAlign: 'top' }}/>
          <div style={{ width: 170, display: 'inline-block', verticalAlign: 'top', marginLeft: 5 }}>
            <div style={{ color: '#999' }}>{record.finalBpuId}</div>
            <div>{record.title}</div>
          </div>
        </div>
      ),
    }, {
      title: '类目',
      dataIndex: 'categoryName',
      width: 80,
    }, {
      title: '品牌',
      dataIndex: 'brandName',
      width: 80,
    }, {
      title: '是否缺内容',
      dataIndex: 'contentRare',
      width: 60,
      render: (val) => val ? '是' : '否',
      filters: [{
        text: '是',
        value: '1',
      }, {
        text: '否',
        value: '0',
      }, {
        text: '不限',
        value: 'unlimit',
      }],
      filterMultiple: false,
      onFilter: (value, record) => value === 'unlimit' ? true : String(record.contentRare) === value,
    }, {
      title: '价格',
      dataIndex: 'price',
      width: 60,
      sorter: (a, b) => a.price - b.price,
      sortOrder: sorter.columnKey === 'price' && sorter.order,
    }, {
      title: '关联清单数',
      dataIndex: 'albumCount',
      width: 60,
      filters: albumCountFilters,
      filterMultiple: false,
      onFilter: (value, record) => {
        if (value === 'unlimit') {
          return true;
        } else if (value === 'yes') {
          return record.albumCount > 0;
        } else if (value === 'no') {
          return record.albumCount === 0;
        }
        return true;
      },
      sorter: (a, b) => a.albumCount - b.albumCount,
      sortOrder: sorter.columnKey === 'albumCount' && sorter.order,
    }, {
      title: '关联长图文数',
      dataIndex: 'picTextCount',
      width: 70,
      filters: picTextCountFilters,
      filterMultiple: false,
      onFilter: (value, record) => {
        if (value === 'unlimit') {
          return true;
        } else if (value === 'yes') {
          return record.picTextCount > 0;
        } else if (value === 'no') {
          return record.picTextCount === 0;
        }
        return true;
      },
      sorter: (a, b) => a.picTextCount - b.picTextCount,
      sortOrder: sorter.columnKey === 'picTextCount' && sorter.order,
    }, {
      title: '详情含图数',
      dataIndex: 'htmlDescCount',
      width: 60,
      sorter: (a, b) => a.htmlDescCount - b.htmlDescCount,
      sortOrder: sorter.columnKey === 'htmlDescCount' && sorter.order,
    }];
    const rowSelection = {
      selectedRowKeys,
      hideDefaultSelections: true,
      onChange: this.handleBpuFromOnlineDataRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    const selectBefore = (
      <Select
        style={{ width: 100 }}
        value={searchField}
        onSelect={value => this.setState({ bpuFromOnlineData: { ...this.state.bpuFromOnlineData, searchField: value } })}
      >
        <Option value="title">商品标题</Option>
        <Option value="finalBpuId">ID</Option>
        <Option value="categoryName">类目</Option>
        <Option value="brandName">品牌</Option>
      </Select>
    );
    return (
      <div>
        <div style={{ marginBottom: 10 }}>
          <Search
            addonBefore={selectBefore}
            style={{ width: 400 }}
            value={searchValue}
            onChange={e => this.setState({ bpuFromOnlineData: { ...this.state.bpuFromOnlineData, searchValue: e.target.value } })}
            onSearch={this.handleSearchBpuFromOnlineData}
            enterButton
            placeholder="搜索商品名称、ID、类目、品牌"
          />
          <div style={{ backgroundColor: '#EEE', display: 'inline-block', padding: '0 10px 0 10px' }}>
            <span>价格区间：</span>
            <Input placeholder="￥" style={{ width: 90 }} value={minPrice}
              onChange={e => this.setState({ bpuFromOnlineData: { ...this.state.bpuFromOnlineData, minPrice: e.target.value } })}
            />
            <span style={{ margin: '0 5px 0 5px' }}>-</span> 
            <Input placeholder="￥" style={{ width: 90 }} value={maxPrice}
              onChange={e => this.setState({ bpuFromOnlineData: { ...this.state.bpuFromOnlineData, maxPrice: e.target.value } })}
            />
          </div>
          
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
          onChange={this.changeBpuFromOnlineDataPage}
          rowKey="finalBpuId"
          scroll={{ y: 380 }}
          bordered={true}
          rowSelection={rowSelection}
          onRow={(record) => ({
            onClick: () => this.handleLoadBpuValue(record),
            onDoubleClick: () => {},
            onContextMenu: () => {},
            onMouseEnter: () => {},
            onMouseLeave: () => {},
          })}
          size="small"
        />
      </div>
    );
  }

  renderJsonDesc = (jsonDesc) => {
    return (
      <div>
        {jsonDesc.blocks.map((item, index) => {
          if (item.type === 'unstyled') {
            return <p key={`renderJsonDesc${index}`} style={{ margin: '8px 0 8px' }}>{item.text}</p>;
          } else if (item.type === 'atomic') {
            return item.entityRanges.map((item1, index1) => <p key={`entityMap${index}`}><img src={jsonDesc.entityMap[item1.key].data.url}/></p>);
          }
          
        })
      }
      </div>
    );
  }
  render() {
    const { visible, k, currentKey } = this.props;
    const { activeKey, bpuValue } = this.state;
    let htmlDesc = '';
    let jsonDesc = {};
    if (bpuValue.descType === 'JSON') {
      jsonDesc = JSON.parse(entities.decodeHTML(bpuValue.htmlDesc));
    } else if (bpuValue.descType === 'HTML') {
      htmlDesc = entities.decodeHTML(bpuValue.htmlDesc);
    }
    return (
      <Modal
        title="标准商品品牌信息 查找"
        width="1000px"
        visible={k === currentKey && visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        style={{ top: 40 }}
        bodyStyle={{ padding: '5px 20px', position: 'relative' }}
      >
        <Tabs
          activeKey={activeKey}
          onChange={this.handleChangeTab}
        >
          <TabPane tab="商品中心" key="bpuValuesPage">
            {this.renderBpuValuesPage()}
          </TabPane>
          <TabPane tab="选品平台" key="bPUSelectionData">
            {this.renderBPUSelectionData()}
          </TabPane>
          <TabPane tab="超级会员店" key="bPUFromMemberStoreData">
            {this.renderBPUFromMemberStoreData()}
          </TabPane>
          <TabPane tab="在售" key="bpuFromOnlineData">
            {this.renderBpuFromOnlineData()}
          </TabPane>
        </Tabs>
        <div id="bpuValueDetail" style={{ position: 'absolute', width: '96%', minHeight: '500px', top: 0, height: '100%', display: !!bpuValue.finalBpuId ? 'block' : 'none'  }}>
        </div>
        <Modal visible={!!bpuValue.finalBpuId} width="800px"
        style={{ position: 'absolute', top: 110, right: 0, left: 0 }}
        maskStyle={{ position: 'absolute' }}
        bodyStyle={{ height: 500, overflow: 'scroll' }}
        getContainer={() => document.getElementById('bpuValueDetail')}
        onCancel={() => this.setState({ bpuValue: {} })}
        footer={null}>
          <h3>基本信息</h3>
          <div>{bpuValue.title}</div>
          <div>{bpuValue.categoryName}</div>
          <div>{bpuValue.imageList && bpuValue.imageList.split('|').map((item, index) =>
            <span key={`imageList${index}`} style={{ padding: 10 }}><img src={item} style={{ width: 162 }} /></span>)}
          </div>
          <h3 style={{ margin: '10px 0 10px' }}>图文详情</h3>
          { htmlDesc && <div dangerouslySetInnerHTML={{ __html: htmlDesc }}></div> }
          { jsonDesc.blocks && this.renderJsonDesc(jsonDesc) }
        </Modal>
      </Modal>
    );
  }
}
