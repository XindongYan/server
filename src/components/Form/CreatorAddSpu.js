import React, { PureComponent } from 'react';
import { Form, Icon } from 'antd';
import AuctionModal from '../AuctionModal';
import AuctionImageModal from '../AuctionModal/AuctionImageModal';
import styles from './index.less';

const FormItem = Form.Item;

export default class CreatorAddSpu extends PureComponent {
  state = {
  }
  handleAuctionShow = () => {
    return ;
    this.props.dispatch({
      type: 'auction/show',
      payload: { currentKey: 'havegoods' }
    });
  }
  handleAddProduct = (auction, img) => {
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
        coverUrl: img,
        // extraBanners: [],
      }]);
    }
    const { props } = this.props;
    this.props.dispatch({
      type: 'album/showAuctionImage',
      payload: {
        formData: props.value[0] ? props.value[0] : []
      }
    })
  }
  handleEditProduct = () => {
    this.props.dispatch({
      type: 'album/showAuctionImage',
    })
  }
  handleClearProduct = () => {
    if (this.props.onChange) this.props.onChange([]);
  }
  render() {
    const { name, props, rules } = this.props;

    return (
      <div style={{ padding: '10px 20px 0' }}>
        <div className={styles.task_img_list}>
          { !(props.value.length > 0) &&
            <label className={styles.uploadImgBox} style={{ width: 120, height: 120 }} onClick={this.handleAuctionShow}>
              <div>
                <Icon type="plus" className={styles.uploadIcon} />
                <p>{props.triggerTips}</p>
              </div>
            </label>
          }
          { props.value.length > 0 &&
            <div className={styles.imgShowBox} style={{ width: 120, height: 120 }}>
              <img src={props.value[0].coverUrl} />
              <div className={styles.clearImg}>
                <div>
                  <Icon type="edit" onClick={this.handleEditProduct} />
                </div>
                <div onClick={this.handleClearProduct}>
                  <Icon type="delete" />
                </div>
              </div>
            </div>
          }
        </div>
        <AuctionModal k="havegoods" onOk={this.handleAddProduct} activityId={props.activityId || 0} />
        <AuctionImageModal onChange={this.handleChangeBodyImg} />
      </div>
    );
  }
}
