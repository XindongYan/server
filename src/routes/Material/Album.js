import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Input, Icon, message, Modal, Pagination, Spin, Progress, Popconfirm } from 'antd';
import CutpicModal from '../../components/AlbumModal/CutpicModal.js';

import styles from './index.less';

@connect(state => ({

}))
export default class Album extends PureComponent {
  state = {
    version: '',
    previewVisible: false,
    previewImage: '',
    ProgressVisible: false,
    ProgressPercent: 10,
    nicaiCrx: null,
    itemList: [],
    pagination: {
      pageSize: 18,
      current: 1,
      total: 0,
    },
    loading: true,
    albumKey: 'material',
  }
  componentDidMount() {
    const nicaiCrx = document.getElementById('nicaiCrx');
    nicaiCrx.addEventListener('setVersion', this.setVersion);
    nicaiCrx.addEventListener('setAlbum', this.setAlbum);
    nicaiCrx.addEventListener('uploadResult', this.uploadResult);
    nicaiCrx.addEventListener('deletePhotoResult', this.deletePhotoResult);
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
    nicaiCrx.removeEventListener('setAlbum', this.setAlbum);
    nicaiCrx.removeEventListener('uploadResult', this.uploadResult);
    nicaiCrx.removeEventListener('deletePhotoResult', this.deletePhotoResult);
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
      this.handleLoadAlbum({ pageSize: pagination.pageSize, current: 1 });
    }
    this.setState({
      version: data.version,
    });
    this.state.nicaiCrx.removeEventListener('setVersion', this.setVersion);
  }
  setAlbum = (e) => {
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
  uploadResult = (e) => {
    const data = JSON.parse(e.target.innerText);
    const { pagination } = this.state;
    if (!data.errorCode) {
      message.destroy();
      message.success('上传成功');
      this.handleLoadAlbum({ pageSize: pagination.pageSize, current: 1 });
    } else {
      message.error(data.message);
    }
  }

  handleLoadAlbum = (params) => {
    this.state.nicaiCrx.innerText = JSON.stringify(params);
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getAlbum', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }

  handleCancel = () => {
    this.setState({
      previewVisible: false,
    },() => {
      this.setState({
        previewImage: '',
      });
    });
  }

  handlePreview = (photo) => {
    this.setState({
      previewImage: photo.url,
      previewVisible: true,
    });
  }
  deletePhotoResult = (e) => {
    const data = JSON.parse(e.target.innerText);
    const { pagination } = this.state;
    if (!data.error) {
      message.success(data.msg);
      this.handleLoadAlbum({ pageSize: pagination.pageSize, current: 1 });
    } else {
      message.error(data.msg);
    }
  }
  handleDeletePhoto = (photo) => {
    if (photo && photo.id) {
      this.state.nicaiCrx.innerText = JSON.stringify({ids: photo.id});
      const customEvent = document.createEvent('Event');
      customEvent.initEvent('deletePhoto', true, true);
      this.state.nicaiCrx.dispatchEvent(customEvent);
    }
  }
  renderPhoto = (photo) => {
    return (
      <Card style={{ width: 146, display: 'inline-block', margin: '5px 15px 5px 0' }} bodyStyle={{ padding: 0 }} key={photo.id} >
        <div className={styles.customImageBox}>
          <img className={styles.customImage} src={photo.url} />
          <div className={styles.customAlbumModals}>
            <div className={styles.customIconBox} onClick={() => this.handlePreview(photo)}>
              <Icon type="eye" className={styles.customIcon}/>
              <span>预览</span>
            </div>
            <div className={styles.customIconBox} onClick={() => this.handleCutpic(photo)}>
              <Icon type="edit" className={styles.customIcon}/>
              <span>抠图</span>
            </div>
          </div>
          <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDeletePhoto(photo)}>
            <div className={styles.deletePicBox}>
              <Icon type="delete" />
            </div>
          </Popconfirm>  
        </div>
        <div className={styles.customCard}>
          <p className={styles.customNodes}>{photo.picWidth} * {photo.picHeight}</p>
          <p className={styles.customNodes}>{photo.title}</p>
        </div>
      </Card>
    );
  }
  changeAlbumPage = (current, pageSize) => {
    this.setState({
      pagination: {
        ...this.state.pagination,
        current,
        pageSize,
      }
    });
    if (this.state.nicaiCrx) {
      this.setState({ loading: true });
      this.handleLoadAlbum({
        pageSize,
        current,
      });
    }
  }
  beforeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size / 1024 / 1024 >= 3) {
        message.warn('上传图片最大3M');
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          // console.log(e.target.result); //就是base64  
          this.state.nicaiCrx.innerText = JSON.stringify({data: e.target.result});
          const customEvent = document.createEvent('Event');
          customEvent.initEvent('uploadImg', true, true);
          this.state.nicaiCrx.dispatchEvent(customEvent);
          message.destroy();
          message.loading('上传中...', 60);
        }
      }
    }
  }
  handleCutpic = (img) => {
    if (img && img.url) {
      this.props.dispatch({
        type: 'album/showCutpic',
        payload: {
          cutpicKey: this.state.albumKey,
          src: img.url,
        }
      });
    }
  }
  render() {
    const { previewVisible, previewImage, ProgressVisible, ProgressPercent, itemList, pagination, loading } = this.state;
    return (
      <div>
        <div>
          <div className={styles.fileInpBox}>
            <label htmlFor="upload">添加图片</label>
            <input id="upload" className={styles.fileInp} type="file" onChange={this.beforeUpload} />
          </div>
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
          onChange={this.changeAlbumPage}
          onShowSizeChange={this.changeAlbumPage}
          style={{float: 'right', margin: '10px 20px'}}
        />
        <Modal visible={previewVisible} footer={null} width={720} onCancel={this.handleCancel}>
          <div style={{ padding: 20, height: 480, lineHeight: '440px', textAlign: 'center' }}>
            <img style={{ maxWidth: '100%', maxHeight: '100%', height: 'auto', width: 'auto' }} src={previewImage} />
          </div>
        </Modal>
        <Modal closable={false} footer={null} visible={ProgressVisible} onCancel={this.handleProCancel}>
          <Progress percent={ProgressPercent} status="active" />
        </Modal>
        <CutpicModal k={this.state.albumKey}/>
      </div>
    );
  }
}
