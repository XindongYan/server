import React, { PureComponent } from 'react';
import { connect } from 'dva';
import $ from 'jquery';
import { Icon, message, Tag, Button, Modal, Input, Tooltip, Badge } from 'antd';
import AuctionModal from '../index.js';
import CoverModal from '../CoverModal.js';
import styles from './index.less';

@connect(state => ({

}))
export default class Anchor extends PureComponent {
  state = {
    auction: {},
    title: '',
  }

  componentDidMount() {
    if (this.props.data) {
      this.setState({
        auction: this.props.data,
        title: this.props.data.title,
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.data && (nextProps.data.url != this.props.data.url || nextProps.data.title != this.props.data.title)) {
      this.setState({
        auction: nextProps.data,
        title: nextProps.data.title || '',
      });
    }
  }

  handleChangeAuctionTag = (e) => {
    this.setState({
      title: e.target.value,
    });
  }
  handleAddProduct = (auction) => {
    const data = {
      coverUrl: auction.coverUrl,
      finalPricePc: 0,
      finalPriceWap: 0,
      images: auction.images,
      itemId: auction.item.itemId,
      materialId: auction.materialId,
      price: auction.item.finalPrice,
      rawTitle: auction.title,
      resourceUrl: auction.item.itemUrl,
      url: auction.item.itemUrl,
    };
    this.setState({
      auction: data,
    });
  }

  handleShowAuctionModal = () => {
    this.props.dispatch({
      type: 'auction/show',
      payload: { currentKey: "Anchor" }
    });
  }
  handleAddNewAnchor = () => {
    const { auction, title } = this.state;
    if (!auction || !auction.url) {
      message.destroy();
      message.warn('请添加一个商品');
    } else if (!title || !title.trim()) {
      message.destroy();
      message.warn('请输入宝贝标签');
    } else {
      const data = this.state.auction;
      data.title = this.state.title;
      if (this.props.onChange) this.props.onChange(data, 'add');
      this.setState({
        auction: {},
        title: '',
      });
    }
  }
  handleDeleteAnchor = () => {
    if (this.props.onChange) this.props.onChange({}, 'delete');
    this.setState({
      auction: {},
      title: '',
    });
  }
  handleChangeProduct = (coverUrl, rawTitle) => {
    this.setState({
      auction: {
        ...this.state.auction,
        coverUrl,
        rawTitle,
      }
    });
  }
  handleEditAuction = () => {
    this.props.dispatch({
      type: 'album/showCover',
      payload: {
        coverKey: "Anchor",
        auction: {...this.state.auction, title: this.state.auction.rawTitle },
      }
    });
  }
  handleDeleteAuction = () => {
    this.setState({
      auction: {}
    });
  }
  render() {
    const { data } = this.props;
    const { title, auction } = this.state;
    return (
      <div>
        <div className={styles.outerAddBox}>
          <p>添加商品</p>
          <div className={styles.addAuctionBox}>
            {auction.url ?
              <div>
                <img src={auction.coverUrl} />
                <div className={styles.changeAuctionBox}>
                  <Icon type="edit" className={styles.editIcon} onClick={this.handleEditAuction} />
                  <Icon type="delete" className={styles.deleteIcon} onClick={this.handleDeleteAuction} />
                </div>
              </div> :
              <div className={styles.uploadBox} onClick={this.handleShowAuctionModal}>
                <Icon type="plus" className={styles.uploadIcon} />
                <p>添加宝贝</p>
              </div>
            }
          </div>
          <p>宝贝标签</p>
          <div className={styles.addAuctionTag}>
            <Input
              value={title}
              onChange={this.handleChangeAuctionTag}
              placeholder="请输入不超过6个汉字"
              maxLength="6"
            />
          </div>
          <div style={{marginTop: 10}}>
            <Button onClick={this.handleAddNewAnchor}>{data && data.url ? '修改' : '添加'}</Button>
            <Button onClick={this.handleDeleteAnchor} style={{marginLeft: 20}}>删除此条</Button>
          </div>
        </div>
        <AuctionModal k="Anchor" onOk={this.handleAddProduct} />
        <CoverModal k="Anchor" onOk={this.handleChangeProduct} />
      </div>
    );
  }
}
