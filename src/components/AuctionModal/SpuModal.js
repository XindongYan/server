import React, { PureComponent } from 'react';
import { connect } from 'dva';
import url from 'url';
import querystring from 'querystring';
import { Row, Col, Card, Modal, message, Icon, Button, Input, Tabs, Spin, Pagination, Tag, Switch } from 'antd';
import styles from './index.less';
import { queryYhhBody } from '../../services/task';
import CoverModal from './CoverModal.js'
import { CHANNELS } from '../../constants/taobao';

const TabPane = Tabs.TabPane;
const Search = Input.Search;

@connect(state => ({
  visible: state.album.spuModal.visible,
  currentKey: state.album.spuModal.currentKey,
  list: state.album.spuModal.list,
  pagination: state.album.spuModal.pagination,
  taskChannel: state.auction.taskChannel,
}))
  
export default class SpuModal extends PureComponent {
  state = {
    nicaiCrx: null,
    version: '',
    addLoading: false,
    actsLoading: true,
    itemList: [],
    visible: false,
    pagination: {
      pageSize: 18,
      current: 1,
      total: 0,
    },
    auctionChoose: {},
    q_score: '',
    new7: '',
    search: '',
    qumai: '',
    activeKey: 'add',
    kuaixuan: false,
    kuaixuanUrl: 'https://we.taobao.com/material/square/detail?kxuanParam=%7B%22nested%22%3A%22we%22%2C%22id%22%3A%220%22%7D',
  }
  componentDidMount() {
    
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.k === nextProps.currentKey) {
      if (!this.props.visible && nextProps.visible) {
        this.setState({
          auctionChoose: {},
          search: '',
        });
        const nicaiCrx = document.getElementById('nicaiCrx');
        if (nextProps.k !== 'material') {
          nicaiCrx.addEventListener('setVersion', this.setVersion);
          nicaiCrx.addEventListener('setAuction', this.setAuction);
          nicaiCrx.addEventListener('resultSpu', this.resultSpu);
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
              this.setState({ actsLoading: false });
            }
          }, 5000);
        } else {
          nicaiCrx.addEventListener('resultSpu', this.resultSpu);
          if (!this.state.nicaiCrx) {
            this.setState({ nicaiCrx });
          }
        }
        this.handleGetKuaixuanId();
      } else if (this.props.visible && !nextProps.visible) {
        const nicaiCrx = document.getElementById('nicaiCrx');
        nicaiCrx.removeEventListener('setAuction', this.setAuction);
        nicaiCrx.removeEventListener('resultSpu', this.resultSpu);
        this.setState({
          nicaiCrx: null,
        });
      }
    }
  }

  handleGetVersion = () => {
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getVersion', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  setVersion = (e) => {
    const { pagination } = this.state;
    const data = JSON.parse(this.state.nicaiCrx.innerText);
    if (data.version) {
      this.setState({
        version: data.version,
      });
    }
    nicaiCrx.removeEventListener('setVersion', this.setVersion);
    const version = data.version;
    if (version && version.length > 0) {
      const arr = version.split('.');
      const versionNumber = Number(arr[0]) * 100 + Number(arr[1]) * 10 + Number(arr[2]);
      if (versionNumber < 122) { // 1.0.4
        message.warn('请更新插件！', 60 * 60);
      }
    }
    if (data.error) {
      message.destroy();
      message.warn(data.msg, 60 * 60);
      this.setState({
        actsLoading: false,
      });
    } else {
      this.handleGetSpu({ pageSize: pagination.pageSize, current: 1 });
    }
  }
  setAuction = (e) => {
    const data = JSON.parse(e.target.innerText);
    if (!data.error) {
      this.setState({
        itemList: data.itemList || [],
        pagination: {
          pageSize: data.pageSize,
          current: data.current,
          total: data.total,
        },
        actsLoading: false,
        addLoading: false,
      });
    } else {
      message.destroy();
      message.warn(data.msg, 60 * 60);
      this.setState({
        actsLoading: false,
      });
    }
  }
  handleGetSpu = (params) => {
    this.state.nicaiCrx.innerText = JSON.stringify({...params, activityId: this.props.activityId, categoryId: 0, resourceType: 'SPU'});
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getAuction', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  handleCancel = () => {
    this.props.dispatch({
      type: 'album/hideSpu',
    });
  }
  handleSearchChange = (e) => {
    this.setState({
      search: e.target.value,
    });
    if (!e.target.value) {
      this.setState({
        auctionChoose: {},
      });
    }
  }
  handleClear = () => {
    this.setState({
      search: '',
      auctionChoose: {},
    });
  }
  handleAddAuction = (value) => {
    this.setState({
      auctionChoose: {},
    });
    if (value) {
      const data = {
        url: value,
        activityId: this.props.activityId,
        categoryId: 0,
      };
      this.state.nicaiCrx.innerText = JSON.stringify(data);
      const customEvent = document.createEvent('Event');
      customEvent.initEvent('uploadSpu', true, true);
      this.state.nicaiCrx.dispatchEvent(customEvent);
    } else {
      message.warn('请输入商品链接');
    }
  }
  renderAuctions = (auction) => {
    return (
      <Card style={{ width: 120, display: 'inline-block', margin: '2px 4px', cursor: 'pointer', position: 'relative' }} bodyStyle={{ padding: 0 }} key={auction.spuId} >
        <div>
          <div className={styles.customImageBox} onClick={() => this.handleChooseAuction(auction)}>
            <img className={styles.customImage} src={auction.url} />
            { this.state.auctionChoose && auction.id === this.state.auctionChoose.id &&
              <div className={styles.customImgZz}><Icon type="check" /></div>
            }
            { auction.disable &&
              <div className={styles.displayStatus}>选品不符</div>
            }
          </div>
          <a target="_blank" href={auction.spuInfoDTO.spuUrl}>
            <div className={styles.auctionCard}>
              <p className={styles.auctionNodes}>{auction.title}</p>
              <p className={styles.auctionNodes}>{auction.spuInfoDTO.price ? auction.spuInfoDTO.price : ''}</p>
            </div>
          </a>
        </div>
      </Card>
    );
  }
  changeAuctionPage = (current, pageSize) => {
    this.setState({
      pagination: {
        ...this.state.pagination,
        current,
        pageSize,
      }
    });
    if (this.state.nicaiCrx) {
      this.setState({ actsLoading: true });
      this.handleGetSpu({
        pageSize,
        current,
      });
    }
  }
  resultSpu = async (e) => {
    const result = JSON.parse(e.target.innerText);
    if (this.props.k === this.props.currentKey) {
      if (result.error) {
        message.error(result.msg)
      } else {
        this.setState({
          auctionChoose: result.data,
        });
      }
    }
  }
  
  handleOk = () => {
    if (this.state.auctionChoose && this.state.auctionChoose.url) {
      if (this.props.onOk) this.props.onOk(this.state.auctionChoose);
      this.props.dispatch({
        type: 'album/hideSpu',
      });
    } else {
      this.props.dispatch({
        type: 'album/hideSpu',
      });
    }
  }

  handleChooseAuction = (auction) => {
    this.setState({
      auctionChoose: auction,
      search: auction.item ? auction.spuInfoDTO.spuUrl : '',
    });
  }

  handleChangeTab = (e) =>{
    if (e === 'commodities') {
      this.handleGetSpu({ pageSize: this.state.pagination.pageSize, current: 1 });
    }
    this.setState({
      activeKey: e,
    });
  }
  handleChangeTabpane = () =>{
    this.setState({
      activeKey: 'add'
    });
  }
  handleGetKuaixuanId = async () => {
    const { activityId, taskChannel } = this.props;
    const data = taskChannel.find(item => item.id === activityId && item.selectItemData);
    if (data && data.selectItemData.url) {
      let channelId = 0;
      let kuaixuan = false;
      CHANNELS.forEach(item => {
        item.activityList.forEach(item1 => {
          if (item1.id == activityId) {
            channelId = item.id;
          }
        });
      });
      if (channelId === 26) {
        kuaixuan = true;
      }
      this.setState({
        kuaixuan,
        kuaixuanUrl: data.selectItemData.url,
      });
    }
  }
  renderAddAuction = () => {
    const { visible, k } = this.props;
    const { search, itemList, pagination, addLoading, auctionChoose } = this.state;
    return (<div style={{ padding: 10, height: 300 }}>
      <div style={{ position: 'relative' }}>
        <Search
          placeholder="输入产品链接"
          value={search}
          onSearch={this.handleAddAuction}
          onChange={this.handleSearchChange}
          enterButton
        />
        <Icon
          onClick={this.handleClear}
          type="close-circle"
          style={{ position: 'absolute', right: 55, top: 6, zIndex: 2, fontSize: 18, cursor: 'pointer' }}
        />
      </div>
      <Spin spinning={addLoading} style={{ width: '100%', height: 220, lineHeight: '220px' }}>
        { auctionChoose && auctionChoose.title &&
          <div style={{ margin: '10px 0' }}>
            <p>{auctionChoose.title}</p>
            { auctionChoose && auctionChoose.title &&
              this.renderAuctions(auctionChoose)
            }
          </div>
        }
      </Spin>
    </div>)
  }
  handleChooseCover = (coverUrl, title) => {
    const auction = this.state.auctionChoose;
    auction.coverUrl = coverUrl;
    auction.title = title;
    if (this.props.onOk) this.props.onOk(auction);
    this.props.dispatch({
      type: 'album/hideSpu',
    });
  }

  render() {
    const { visible, k, currentKey, activityId } = this.props;
    const { itemList, pagination, actsLoading, activeKey, auctionChoose, kuaixuan } = this.state;
    return (
      <Modal
        title="添加产品"
        width="850px"
        visible={k === currentKey && visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        bodyStyle={{ padding: '5px 20px' }}
        style={{ top: 20 }}
      >
        { k !== 'material' ?
          <Tabs
            tabBarExtraContent={kuaixuan ? <div style={{ width: 570, lineHeight: '44px' }}><a onClick={this.handleChangeTabpane} target="_blank" href={this.state.kuaixuanUrl}>选品池</a></div> : ''}
            activeKey={activeKey}
            onChange={this.handleChangeTab}
          >
            <TabPane tab={<span>添加产品</span>} key="add">
              {this.renderAddAuction()}
            </TabPane>
            <TabPane tab={<span>产品库</span>} key="commodities">
              <div>
                <Spin spinning={actsLoading}>
                  <div style={{ height: 300, overflow: 'auto'}}>
                    {itemList.map(this.renderAuctions)}
                  </div>
                  <Pagination
                    {...{
                      showSizeChanger: true,
                      showQuickJumper: true,
                      ...pagination,
                    }}
                    onChange={this.changeAuctionPage}
                    onShowSizeChange={this.changeAuctionPage}
                    style={{float: 'right', margin: '10px 20px'}}
                  />
                </Spin>
              </div>
            </TabPane>
          </Tabs>
          : this.renderAddAuction()
        }
      </Modal>
    );
  }
}
