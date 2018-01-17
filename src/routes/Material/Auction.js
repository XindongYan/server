import React, { PureComponent } from 'react';
import { Card, Button, Input, Icon, message, Modal, Pagination, Spin, Progress } from 'antd';
import styles from './index.less';
import AuctionModal from '../../components/AuctionModal';

export default class Auction extends PureComponent {
  state = {
    nicaiCrx: null,
    version: '',
    search: '',
    images: [],
    data: null,
    url: '',
    choose: '',
    itemList: [],
    visible: false,
    pagination: {
      pageSize: 18,
      current: 1,
      total: 0,
    },
    loading: true,
  }
  componentDidMount() {
    const nicaiCrx = document.getElementById('nicaiCrx');
    nicaiCrx.addEventListener('setVersion', this.setVersion);
    nicaiCrx.addEventListener('setAuction', this.setAuction);
    nicaiCrx.addEventListener('uploadResult', this.uploadResult);
    if (!this.state.nicaiCrx) {
      this.setState({ nicaiCrx }, () => {
        setTimeout(() => {
          this.handleGetVersion();
        }, 400);
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
    if (data.error) {
      message.warn(data.msg);
      this.setState({
        loading: false,
      });
    } else {
      this.handleGetAuction({ pageSize: pagination.pageSize, current: 1 });
    }
    this.setState({
      version: data.version,
    })
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
        <a href={auction.item.itemUrl}>
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
    this.setState({
      visible: false,
    })
    this.handleGetAuction({ pageSize: pagination.pageSize, current: 1 });
  }
  handleShowModal = () => {
    this.setState({
      visible: true,
    })
  }
  handleAuctionHide = () => {
    this.setState({
      visible: false,
    })
  }
  render() {
    const { previewVisible, previewImage, ProgressVisible, ProgressPercent, itemList, pagination, loading } = this.state;
    const extra = (
      
    );
    return (
    );
  }
}
