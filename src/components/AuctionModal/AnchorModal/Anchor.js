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

  componentWillUnmount() {
    this.setState({
      auction: {},
      title: '',
    });
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
      title: auction.title,
      url: auction.item.itemUrl,
    };
    this.setState({
      auction: data,
    });
  }

  handleShowAuctionModal = () => {
    this.props.dispatch({
      type: 'auction/show',
      payload: { currentKey: `Anchor${this.props.k}` }
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
        coverKey: `Anchor${this.props.k}`,
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
    const { data, props } = this.props;
    const { title, auction } = this.state;
    const suffix = (
      <div
        style={{ color: title && title.length > props.titleMaxLength ? '#f00' : '#444' }}>
        { title ? title.length : 0}/{props.titleMaxLength}
      </div>
    );
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
              placeholder={`请输入不超过${props.titleMaxLength}个汉字`}
              maxLength={props.titleMaxLength ? props.titleMaxLength.toString() : '10'}
              suffix={suffix}
            />
          </div>
          <div style={{marginTop: 10}}>
            <Button onClick={this.handleAddNewAnchor}>{data && data.url ? '修改' : '添加'}</Button>
            <Button onClick={this.handleDeleteAnchor} style={{marginLeft: 20}}>删除此条</Button>
          </div>
        </div>
        <AuctionModal k={`Anchor${this.props.k}`} onOk={this.handleAddProduct} />
        <CoverModal k={`Anchor${this.props.k}`} onOk={this.handleChangeProduct} />
      </div>
    );
  }
}
