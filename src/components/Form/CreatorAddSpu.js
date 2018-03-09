import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Icon } from 'antd';
import SpuModal from '../AuctionModal/SpuModal';
import AuctionImageModal from '../AuctionModal/AuctionImageModal';
import styles from './index.less';

const FormItem = Form.Item;
@connect(state => ({
}))

export default class CreatorAddSpu extends PureComponent {
  state = {
  }
  handleAuctionShow = () => {
    this.props.dispatch({
      type: 'album/showSpu',
      payload: { currentKey: this.props.name }
    });
  }
  handleAddProduct = (auction, img) => {
    const { props } = this.props;
    if (this.props.onChange) {
      this.props.onChange([{
        coverUrl: auction.coverUrl,
        images: auction.images,
        materialId: auction.materialId,
        resourceType: auction.resourceType === "SPU" ? "Product" : auction.resourceType,
        spuId: auction.spuId,
        title: auction.title,
      }]);
    }
    this.props.dispatch({
      type: 'album/showAuctionImage',
      payload: {
        formData: props.value[0] ? props.value[0] : [],
        currentKey: this.props.name,
      }
    });
  }
  handleEditProduct = () => {
    const { props } = this.props;
    if (props.enableExtraBanner) {
      this.props.dispatch({
        type: 'album/showAuctionImage',
        payload: {
          formData: props.value[0] ? props.value[0] : [],
          currentKey: this.props.name,
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
        <SpuModal k={this.props.name} onOk={this.handleAddProduct} activityId={props.activityId || 0} />
        <AuctionImageModal k={this.props.name} onChange={this.handleChangeBodyImg} />
      </div>
    );
  }
}
