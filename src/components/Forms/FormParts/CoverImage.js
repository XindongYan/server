import React, { PureComponent } from 'react';
import { connect } from 'dva';
import $ from 'jquery';
import { Input, Icon, message, Cascader } from 'antd';
import AlbumModal from '../../AlbumModal';
import CropperModal from '../../AlbumModal/CropperModal';
import styles from './index.less';

@connect(state => ({

}))

export default class CoverImage extends PureComponent {
  state = {
    formData: {
      name: 'cover_img',
      laybel: '封面图',
      tips: "请上传尺寸不小于750x422px的图片",
      minSize: {
        width: 750,
        height: 422
      },
      uploadTips: "上传封面",
      value: '',
    }
  }
  componentDidMount() {
    if (this.props.formData) {
      this.setState({
        formData: { ...this.state.formData, ...this.props.formData }
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.formData != this.props.formData) {
      this.setState({
        formData: { ...this.state.formData, ...nextProps.formData }
      });
    }
  }
  componentWillUnmount() {

  }

  uploadCoverImg = () => {
    this.props.dispatch({
      type: 'album/show',
      payload: { currentKey: this.state.formData.name }
    });
  }
  handleCropCoverImg = (imgs) => {
    const { formData } = this.state;
    if (imgs[0] && formData.minSize.width) {
      this.props.dispatch({
        type: 'album/showCropper',
        payload: {
          visible: true,
          src: imgs[0].url,
          width: formData.minSize.width,
          height: formData.minSize.height,
          picHeight: imgs[0].picHeight,
          picWidth: imgs[0].picWidth,
          cropperKey: formData.name,
        }
      });
    }
  }
  handleDeleteCover = () => {
    if (this.props.onChange) this.props.onChange('');
  }
  handleChangeCover = (url) => {
    if (this.props.onChange) this.props.onChange(url);
  }
  render() {
    const { formData } = this.state;

    const upCoverStyle = {
      width: '100%',
      height: '100%',
      padding: '18px 0',
      border: '1px dashed #6af',
      fontSize: '28px',
      color: '#6af',
      textAlign: 'center',
      cursor: 'pointer',
    }
    const coverPic = {
      position: 'relative',
      width: '100%',
      height: '100%',
      textAlign: 'center',
      lineHeight: '108px',
    }
    const coverModal = {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height:' 40px',
      lineHeight: '40px',
      lineHeight: '40px',
      background: 'rgba(0,0,0,0.5)',
      color: '#fff',
      fontSize: '18px',
      cursor: 'pointer',
      display: 'none',
    }
    return (
      <div>
        <p>{ formData.laybel || '封面图'}</p>
        <div style={{ width: 200, height: 112 }}>
          { !formData.value &&
            <div className={styles.upCover} onClick={this.uploadCoverImg}>
              <Icon type="plus" />
              <p style={{ fontSize: 14 }}>上传封面图</p>
            </div>
          }
          { formData.value &&
            <div className={styles.coverPic}>
              <img src={formData.value} />
              <div className={styles.coverModal} onClick={this.handleDeleteCover}>
                <Icon type="delete" />
              </div>
            </div>
          }
        </div>
        <p style={{ height: 18, lineHeight: '18px', fontSize: '12px', color: '#999', marginTop: 5 }}>{formData.tips || '请上传尺寸不小于750x422px的图片'}</p>
        <AlbumModal mode="single" k={formData.name} minSize={formData.minSize} onOk={this.handleCropCoverImg}/>
        <CropperModal k={this.state.formData.name} onOk={this.handleChangeCover}/>
      </div>
    );
  }
}
