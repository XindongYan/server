import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Input, Icon, message, Modal, Pagination, Spin, Progress, Tabs } from 'antd';
import Album from './Album.js';
import AuctionModal from '../../components/AuctionModal';
import BbuModal from '../../components/AuctionModal/BbuModal';
import styles from './index.less';

const TabPane = Tabs.TabPane;
@connect(state => ({

}))
export default class Material extends PureComponent {
  state = {
    version: '',
    nicaiCrx: null,
    search: '',
    images: [],
    data: null,
    url: '',
    choose: '',
    itemList: [],
    pagination: {
      pageSize: 18,
      current: 2,
      total: 0,
    },
    loading: true,
  }
  componentDidMount() {
    const nicaiCrx = document.getElementById('nicaiCrx');
    nicaiCrx.addEventListener('setVersion', this.setVersion);
    nicaiCrx.addEventListener('setAuction', this.setAuction);
    nicaiCrx.addEventListener('uploadResult', this.uploadResult);
    setTimeout(() => {
      if(!this.state.version){
        message.destroy();
        message.warn('请安装尼采创作平台插件！', 60 * 60);
        this.setState({ loading: false });
      }
    }, 7000);
    if (!this.state.nicaiCrx) {
      this.setState({ nicaiCrx }, () => {
        setTimeout(() => {
          this.handleGetVersion();
        }, 600);
      });
    }
  }
  componentWillReceiveProps(nextProps) {

  }
  componentWillUnmount() {
    const nicaiCrx = document.getElementById('nicaiCrx');
    nicaiCrx.removeEventListener('setVersion', this.setVersion);
    nicaiCrx.removeEventListener('setAuction', this.setAuction);
    nicaiCrx.removeEventListener('uploadResult', this.uploadResult);
  }
  
  handleGetVersion = () => {
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getVersion', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  setVersion = (e) => {
    const { pagination } = this.state;
    const data = JSON.parse(e.target.innerText);
    this.setState({
      version: data.version,
    })
    console.log(data);
    if (data.error) {
      message.warn(data.msg);
      this.setState({
        loading: false,
      });
    } else {
      this.handleGetAuction({ pageSize: pagination.pageSize, current: 1 });
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
        loading: false,
      });
    } else {
      message.destroy();
      message.warn(data.msg);
      this.setState({
        loading: false,
      });
    }
  }

  handleGetAuction = (params) => {
    this.state.nicaiCrx.innerText = JSON.stringify(params);
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getAuction', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }

  renderPhoto = (auction) => {
    return (
      <Card style={{ width: 140, display: 'inline-block', margin: '5px 15px 5px 0' }} bodyStyle={{ padding: 0 }} key={auction.id} >
        <a href={auction.item.itemUrl} target="_blank">
          <div className={styles.auctionImageBox}>
            <img className={styles.customImage} src={auction.url} />
            <div className={styles.customModals}>
              {/*
                <Icon type="delete" className={styles.customIcon} onClick={() => console.log('remove')} />
              */}
            </div>
          </div>
          <div className={styles.auctionCard}>
            <p className={styles.auctionNodes}>{auction.title}</p>
            <p className={styles.auctionNodes} style={{ margin: '3px 0', color: '#555' }}>¥{auction.item.finalPrice}</p>
            <p className={styles.auctionNodes}>{auction.item.taoKeDisplayPrice}</p>
          </div>
        </a>
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
    })
    if (this.state.nicaiCrx) {
      this.setState({ loading: true });
      this.handleGetAuction({
        pageSize,
        current,
      });
    }
  }
  handleAddProduct = () => {
    const { pagination } = this.state;
    this.handleGetAuction({ pageSize: pagination.pageSize, current: 1 });
  }
  handleShowModal = () => {
    this.props.dispatch({
      type: 'auction/show',
      payload: { currentKey: 'material' }
    });
  }
  handleChange = (e) => {
    const { pagination } = this.state;
    if (e === 'auction') {
      this.handleGetAuction({ pageSize: pagination.pageSize, current: 1 });
    }
  }
  render() {
    const { ProgressPercent, itemList, pagination, loading } = this.state;
    return (
      <div>
        <Card>
          <Tabs defaultActiveKey="1" onChange={this.handleChange}>
            <TabPane tab="我的商品" key="auction">
              <div>
                <div style={{ marginBottom: 20 }}>
                  <Button type="primary" onClick={this.handleShowModal}>添加商品</Button>
                </div>
                <Spin spinning={loading}>
                  {itemList.map(this.renderPhoto)}
                </Spin>
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
                <Button onClick={() => this.props.dispatch({type: 'auction/showBbu', payload: {currentKey: 'material'}})}>456789</Button>
                <AuctionModal k="material" onOk={this.handleAddProduct} />
                <BbuModal k="material" />
              </div>
            </TabPane>
            <TabPane tab="我的图片" key="album">
              <Album />
            </TabPane>
          </Tabs>
        </Card>
      </div>
    );
  }
}
