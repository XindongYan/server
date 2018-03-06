import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Icon } from 'antd';
import AuctionModal from '../AuctionModal';
import AuctionImageModal from '../AuctionModal/AuctionImageModal';
import styles from './index.less';

const FormItem = Form.Item;
@connect(state => ({
}))

export default class CreatorAddItem extends PureComponent {
  state = {
  }
  handleAuctionShow = () => {
    const { props } = this.props;
    const k = props.enableExtraBanner ? 'havegoods' : 'creatorAddItem';
    this.props.dispatch({
      type: 'auction/show',
      payload: { currentKey: k }
    });
  }
  handleAddProduct = (auction) => {
    const { props } = this.props;
    if (this.props.onChange) {
      this.props.onChange([{
        checked: false,
        finalPricePc:0,
        finalPriceWap:0,
        images: auction.images,
        itemId: auction.item.itemId,
        materialId: auction.materialId,
        price: Number(auction.item.finalPrice),
        rawTitle: auction.title,
        resourceUrl: auction.item.itemUrl,
        title: auction.title,
        coverUrl: auction.coverUrl,
        extraBanners: [],
      }]);
    }
    if (props.enableExtraBanner) {
      this.props.dispatch({
        type: 'album/showAuctionImage',
        payload: {
          formData: props.value[0] ? props.value[0] : []
        }
      });
    }
  }
  handleChangeBodyImg = (coverUrl, extraBanners) => {
    const { props } = this.props;
    if (this.props.onChange) this.props.onChange([{
      ...props.value[0],
      coverUrl: coverUrl,
      extraBanners: extraBanners,
    }]);
  }
  handleEditProduct = () => {
    const { props } = this.props;
    if (props.enableExtraBanner) {
      this.props.dispatch({
        type: 'album/showAuctionImage',
        payload: {
          formData: props.value[0] ? props.value[0] : []
        }
      });
    } else {
      this.props.dispatch({
        type: 'album/showCover',
        payload: {
          auction: props.value[0] ? props.value[0] : []
        }
      });
    }
  }
  handleClearProduct = () => {
    if (this.props.onChange) this.props.onChange([]);
  }
  render() {
    const { name, props, rules } = this.props;
    const k = props.enableExtraBanner ? 'havegoods' : 'creatorAddItem';
    return (
      <div style={{ padding: '10px 20px 0' }}>
        <div className={styles.task_img_list}>
          { !(props.value.length > 0) &&
            <label className={styles.uploadImgBox} style={{ width: 120, height: 120 }} onClick={this.handleAuctionShow}>
              <div>
                <Icon type="plus" className={styles.uploadIcon} />
                <p>{props.triggerTips || '添加宝贝'}</p>
              </div>
            </label>
          }
          { props.value.length > 0 &&
            <div className={styles.imgShowBox} style={{ width: 120, height: 120 }}>
              <img src={props.value[0].coverUrl} />
              <div className={styles.clearImg}>
                <div onClick={this.handleEditProduct}>
                  <Icon type="edit" />
                </div>
                <div onClick={this.handleClearProduct}>
                  <Icon type="delete" />
                </div>
              </div>
            </div>
          }
        </div>
        <AuctionModal k={k} onOk={this.handleAddProduct} activityId={props.activityId || 0} />
        <AuctionImageModal onChange={this.handleChangeBodyImg} />
      </div>
    );
  }
}
