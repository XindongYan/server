import React, { PureComponent } from 'react';
import { connect } from 'dva';
import entities from 'entities';
import { Row, Col, Card, Modal, message, Icon, Button, Input, Tabs, Spin, Select, Table } from 'antd';
import styles from './index.less';

const TabPane = Tabs.TabPane;
const Search = Input.Search;
const Option = Select.Option;

@connect(state => ({
  visible: state.auction.bbuModal.visible,
  currentKey: state.auction.bbuModal.currentKey,
}))
  
export default class BbuModal extends PureComponent {
  state = {
    nicaiCrx: null,
    version: '',
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
    },
    bPUSelectionData: {
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
    },
    bPUFromMemberStoreData: {
      pagination: {
        pageSize: 18,
        current: 1,
        total: 0,
      },
      list: [],
      loading: true,
    },
    bpuFromOnlineData: {
      pagination: {
        pageSize: 18,
        current: 1,
        total: 0,
      },
      list: [],
      loading: true,
    },
    bpuValue: {},
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.k === nextProps.currentKey) {
      if (!this.props.visible && nextProps.visible) {
        const nicaiCrx = document.getElementById('nicaiCrx');
        nicaiCrx.addEventListener('setVersion', this.setVersion);
        nicaiCrx.addEventListener('setBpuValuesPage', this.setBpuValuesPage);
        nicaiCrx.addEventListener('setBPUSelectionData', this.setBPUSelectionData);
        nicaiCrx.addEventListener('setBpuValueById', this.setBpuValueById);
        if (!this.state.nicaiCrx) {
          this.setState({ nicaiCrx }, () => {
            setTimeout(() => {
              this.handleGetVersion();
            }, 600);
          });
        }
        setTimeout(() => {
          if(!this.state.version){
            message.destroy();
            message.warn('请安装尼采创作平台插件！');
            this.setState({ loading: false });
          }
        }, 5000);
      } else if (this.props.visible && !nextProps.visible) {
        const nicaiCrx = document.getElementById('nicaiCrx');
        nicaiCrx.removeEventListener('setBpuValueById', this.setBpuValueById);
        nicaiCrx.removeEventListener('setBPUSelectionData', this.setBPUSelectionData);
        nicaiCrx.removeEventListener('setBpuValuesPage', this.setBpuValuesPage);
      }
    }
  }
  handleGetVersion = () => {
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getVersion', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  setVersion = (e) => {
    const data = JSON.parse(this.state.nicaiCrx.innerText);
    if (data.version) {
      this.setState({
        version: data.version,
      });
    }
    this.state.nicaiCrx.removeEventListener('setVersion', this.setVersion);
    if (data.error) {
      message.destroy();
      message.warn(data.msg, 60 * 60);
      this.setState({
        loading: false,
      });
    } else {
      const { pagination, effective} = this.state.bpuValuesPage;
      this.handleGetBpuValuesPage({
        pageSize: pagination.pageSize,
        currentPage: 1,
        effective,
      });
    }
  }
  handleCancel = () => {
    this.props.dispatch({
      type: 'auction/hideBbu',
    });
  }
  handleOk = () => {
    const result = this.state[this.state.activeKey].selectedRows;
    console.log(result);
    this.props.dispatch({
      type: 'auction/hide',
    });
  }

  handleChangeTab = (activeKey) =>{
    if (activeKey === 'bpuValuesPage') {
      this.handleGetBpuValuesPage({ pageSize: this.state.bpuValuesPage.pagination.pageSize, currentPage: 1 });
    } else if (activeKey === 'bPUSelectionData') {
      console.log(this.state.nicaiCrx);
      this.handleGetBPUSelectionData({ pageSize: this.state.bPUSelectionData.pagination.pageSize, currentPage: 1 });
    }
    this.setState({
      activeKey
    })
  }
  setBpuValueById = () => {
    const data = JSON.parse(this.state.nicaiCrx.innerText);
    console.log(data);
    if (data.error) {
      message.error(data.msg, 60 * 60);
    } else {
      this.setState({ bpuValue: data });
    }
  }
  handleLoadBpuValue = (record) => {
    const params = {
      finalBpuId: record.finalBpuId,
      nocache: 1,
    };
    this.state.nicaiCrx.innerText = JSON.stringify(params);
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getBpuValueById', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }

  setBpuValuesPage = (e) => {
    const data = JSON.parse(e.target.innerText);
    console.log(data);
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
  handleGetBpuValuesPage = (params) => {
    this.state.nicaiCrx.innerText = JSON.stringify(params);
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getBpuValuesPage', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  changeBpuValuesPagePage = (pagination, filters) => {
    if (pagination.current !== this.state.bpuValuesPage.pagination.current || pagination.pageSize !== this.state.bpuValuesPage.pagination.pageSize) {
      this.setState({
        bpuValuesPage: {
          ...this.state.bpuValuesPage,
          pagination,
          loading: true,
        }
      });
      if (this.state.nicaiCrx) {
        const { effective } = this.state.bpuValuesPage;
        this.handleGetBpuValuesPage({
          pageSize: pagination.pageSize,
          currentPage: pagination.current,
          effective,
        });
      }
    }
  }
  handleSearchBpuValuesPage = (searchValue) => {
    this.setState({ bpuValuesPage: { ...this.state.bpuValuesPage, searchValue, loading: true } });
    const { pagination, effective, searchField } = this.state.bpuValuesPage;
    const params = {
      pageSize: pagination.pageSize,
      currentPage: pagination.current,
      effective,
    };
    if (searchField) {
      params[searchField] = searchValue;
    }
    this.handleGetBpuValuesPage(params);
  }
  handleBpuValuesPageRowSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ bpuValuesPage: { ...this.state.bpuValuesPage, selectedRowKeys, selectedRows } });
  }
  renderBpuValuesPage = () => {
    const { bpuValuesPage: { list, pagination, loading, searchField, searchValue, selectedRowKeys } } = this.state;
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
      width: 200,
    }, {
      title: '品牌',
      dataIndex: 'brandName',
      width: 200,
    }, {
      title: '是否缺内容',
      dataIndex: 'contentRare',
      width: 150,
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

  setBPUSelectionData = (e) => {
    const data = JSON.parse(e.target.innerText);
    console.log(data);
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
  handleGetBPUSelectionData = (params) => {
    this.state.nicaiCrx.innerText = JSON.stringify(params);
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getBPUSelectionData', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  changeBPUSelectionDataPage = (pagination, filters) => {
    if (pagination.current !== this.state.bPUSelectionData.pagination.current || pagination.pageSize !== this.state.bPUSelectionData.pagination.pageSize) {
      this.setState({
        bPUSelectionData: {
          ...this.state.bPUSelectionData,
          pagination,
          loading: true,
        }
      });
      if (this.state.nicaiCrx) {
        const { effective } = this.state.bPUSelectionData;
        this.handleGetBPUSelectionData({
          pageSize: pagination.pageSize,
          currentPage: pagination.current,
          effective,
        });
      }
    }
  }
  handleSearchBPUSelectionData = (searchValue) => {
    this.setState({ bPUSelectionData: { ...this.state.bPUSelectionData, searchValue, loading: true } });
    const { pagination, effective, searchField } = this.state.bPUSelectionData;
    const params = {
      pageSize: pagination.pageSize,
      currentPage: pagination.current,
      effective,
    };
    if (searchField) {
      params[searchField] = searchValue;
    }
    this.handleGetBPUSelectionData(params);
  }
  handleBPUSelectionDataRowSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ bPUSelectionData: { ...this.state.bPUSelectionData, selectedRowKeys, selectedRows } });
  }
  renderBPUSelectionData = () => {
    const { bPUSelectionData: { list, pagination, loading, searchField, searchValue, selectedRowKeys } } = this.state;
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
      width: 200,
    }, {
      title: '品牌',
      dataIndex: 'brandName',
      width: 200,
    }, {
      title: '是否缺内容',
      dataIndex: 'contentRare',
      width: 150,
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
    if (bpuValue.htmlDesc && bpuValue.htmlDesc.substring(0, 1) === '{') {
      jsonDesc = JSON.parse(entities.decodeHTML(bpuValue.htmlDesc));
    } else if (bpuValue.htmlDesc) {
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
