import React, { PureComponent } from 'react';
import { connect } from 'dva';
import $ from 'jquery';
import { Row, Col, Card, Modal, message, Icon, Button, Input, Tabs, Spin, Pagination, Tag } from 'antd';
import styles from './index.less';
import { searchNew7, queryQumai } from '../../services/tool';
import { queryYhhBody } from '../../services/task';

const TabPane = Tabs.TabPane;
const Search = Input.Search;

@connect(state => ({
  visible: state.auction.bbuModal.visible,
  currentKey: state.auction.bbuModal.currentKey,
}))
  
export default class BbuModal extends PureComponent {
  state = {
    innerText: null,
    nicaiCrx: null,
    version: '',
    choose: '',
    loading: true,
    itemList: [],
    pagination: {
      pageSize: 18,
      current: 1,
      total: 0,
    },
    auctionChoose: null,
    q_score: '',
    new7: '',
    search: '',
    qumai: '',
    activeKey: 'bpuValuesPage',

    bpuValuesPage: {
      pagination: {
        pageSize: 18,
        current: 1,
        total: 0,
      },
      list: [],
      loading: false,
      effective: true,
    },
    bPUSelectionData: {
      pagination: {
        pageSize: 15,
        current: 1,
        total: 0,
      },
      list: [],
      loading: false,
    },
    bPUFromMemberStoreData: {
      pagination: {
        pageSize: 18,
        current: 1,
        total: 0,
      },
      list: [],
      loading: false,
    },
    bpuFromOnlineData: {
      pagination: {
        pageSize: 18,
        current: 1,
        total: 0,
      },
      list: [],
      loading: false,
    },
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.k === nextProps.currentKey) {
      if (!this.props.visible && nextProps.visible) {
        const nicaiCrx = document.getElementById('nicaiCrx');
        nicaiCrx.addEventListener('setVersion', this.setVersion);
        nicaiCrx.addEventListener('setBpuValuesPage', this.setBpuValuesPage);
        if (!this.state.nicaiCrx) {
          this.setState({ nicaiCrx }, () => {
            setTimeout(() => {
              this.handleGetVersion();
            }, 600);
          });
        }
        setTimeout(() => {
          if(!this.state.version && !this.state.innerText){
            message.destroy();
            message.warn('请安装尼采创作平台插件！');
            this.setState({ loading: false });
          }
        }, 5000);
      } else if (this.props.visible && !nextProps.visible) {
        const nicaiCrx = document.getElementById('nicaiCrx');
        nicaiCrx.removeEventListener('setBpuValuesPage', this.setBpuValuesPage);
        nicaiCrx.removeEventListener('setVersion', this.setVersion);
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
        innerText: data,
      });
    }
    console.log(data);
    if (data.error) {
      message.destroy();
      message.warn(data.msg, 60 * 60);
      this.setState({
        loading: false,
      });
    } else {
      // this.handleGetBpuValuesPage({ pageSize: this.state.bpuValuesPage.pagination.pageSize, currentPage: 1 });
    }
  }
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
      message.warn(data.msg, 60 * 60);
      this.setState({
        loading: false,
      });
    }
  }
  handleGetBpuValuesPage = (params) => {
    this.setState({
      bpuValuesPage: {
        ...this.state.bpuValuesPage,
        loading: true,
      },
    });
    this.state.nicaiCrx.innerText = JSON.stringify(params);
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getBpuValuesPage', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  handleCancel = () => {
    this.props.dispatch({
      type: 'auction/hideBbu',
    });
  }
  handleSearchChange = (e) => {
    this.setState({
      search: e.target.value,
    })
    if (!e.target.value) {
      this.setState({
        choose: '',
        auctionChoose: null,
      })
    }
  }
  handleClear = () => {
    this.setState({
      search: '',
      choose: '',
      auctionChoose: null,
      new7: '',
      q_score: '',
      qumai: '',
    })
  }
  handleAddAuction = (value) => {
    this.setState({
      choose: '',
      auctionChoose: null,
    })
    if (value) {
      this.state.nicaiCrx.innerText = JSON.stringify(value);
      const customEvent = document.createEvent('Event');
      customEvent.initEvent('uploadAuction', true, true);
      this.state.nicaiCrx.dispatchEvent(customEvent);
    } else {
      message.warn('请输入商品链接');
    }
  }
  renderPhoto = (auction) => {
    return (
      <Card style={{ width: 120, display: 'inline-block', margin: '2px 4px', cursor: 'pointer' }} onClick={() => this.handleChooseAuction(auction)} bodyStyle={{ padding: 0 }} key={auction.id} >
        <div className={styles.customImageBox}>
          <img className={styles.customImage} src={auction.url} />
          { this.state.auctionChoose && auction.id === this.state.auctionChoose.id &&
            <div className={styles.customImgZz}><Icon type="check" /></div>
          }
        </div>
        <div className={styles.auctionCard}>
            <p className={styles.auctionNodes}>{auction.title}</p>
            <p className={styles.auctionNodes} style={{ margin: '3px 0', color: '#555' }}>¥{auction.item.finalPrice}</p>
            <p className={styles.auctionNodes}>{auction.item.taoKeDisplayPrice}</p>
        </div>
      </Card>
    );
  }
  changeBpuValuesPagePage = (current, pageSize) => {
    this.setState({
      bpuValuesPage: {
        ...this.state.bpuValuesPage,
        pagination: {
          ...this.state.bpuValuesPage.pagination,
          current,
          pageSize,
        }
      }
    })
    if (this.state.nicaiCrx) {
      this.setState({ loading: true });
      this.handleGetBpuValuesPage({
        pageSize,
        currentPage: current,
      });
    }
  }
  handleChooseImg = (photo) => {
    this.setState({
      choose: photo,
    })
  }
  handleOk = () => {
    if (this.state.auctionChoose) {
      const img = this.state.choose || this.state.auctionChoose.coverUrl;
      if (this.props.onOk) this.props.onOk(this.state.auctionChoose, img);
      this.setState({
        choose: '',
        auctionChoose: null,
        search: '',
      })
    }
    this.props.dispatch({
      type: 'auction/hide',
    });
  }

  handleChooseAuction = (auction) => {
    // auctionChoose
    this.setState({
      new7: '',
      q_score: '',
      qumai: '',
      auctionChoose: auction,
      choose: auction.images && auction.images.length > 0 ? auction.images[0] : auction.coverUrl,
      search: auction.item ? auction.item.itemUrl : '',
    })
  }

  handleChangeTab = (e) =>{
    if (e === 'bpuValuesPage') {
      this.handleGetBpuValuesPage({ pageSize: this.state.pagination.pageSize, currentPage: 1 });
    }
    this.setState({
      activeKey: e
    })
  }
  handleChangeTabpane = () =>{
    
    this.setState({
      activeKey: 'add'
    }, () => {
      console.log(this.state.activeKey)
    })
  }
  renderBpuValuesPage = () => {
    const { bpuValuesPage: { list, pagination, loading } } = this.state;
    return (
      <div>
        <div>
          <Spin spinning={loading}>
            {list.map(item => 'ghj')}
          </Spin>
        </div>
        <Pagination
          {...{
            showSizeChanger: true,
            showQuickJumper: true,
            ...pagination,
          }}
          onChange={this.changeBpuValuesPagePage}
          onShowSizeChange={this.changeBpuValuesPagePage}
          style={{float: 'right', margin: '10px 20px'}}
        />
      </div>
    );
  }
  render() {
    const { visible, k, currentKey } = this.props;
    const { activeKey } = this.state;
    return (
      <Modal
        title="标准商品品牌信息 查找"
        width="850px"
        visible={k === currentKey && visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        bodyStyle={{ padding: '5px 20px' }}
      >
        <Tabs
          activeKey={activeKey}
          onChange={this.handleChangeTab}
        >
          <TabPane tab="商品中心" key="bpuValuesPage">
            {this.renderBpuValuesPage()}
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}
