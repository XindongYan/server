import React, { PureComponent } from 'react';
import { connect } from 'dva';
import fetch from 'dva/fetch';
import path from 'path';
import { Card, Button, Upload, Icon, message, Modal, Pagination, Spin, Progress } from 'antd';
import { QINIU_DOMAIN, QINIU_UPLOAD_DOMAIN } from '../../constants';
import styles from './index.less';

@connect(state => ({
  currentUser: state.user.currentUser,
  data: state.album.data,
  loading: state.album.loading,
  qiniucloud: state.qiniucloud,
}))

export default class Album extends PureComponent {
  state = {
    previewVisible: false,
    previewImage: '',
    ProgressVisible: false,
    ProgressPercent: 10,
    port: null,
    itemList: [],
    pagination: {
      pageSize: 20,
      current: 1,
      total: 0,
    },
  }
  componentDidMount() {
    const { pagination } = this.state;
    const port = chrome.runtime.connect('fbogljkfccipgbpghamgcnhaooehbkcg', {
      name: 'album',
    });
    port.postMessage({ name: 'album', pageSize: pagination.pageSize, currentPage: pagination.current });
    port.onMessage.addListener((res) => {
      this.setState({
        itemList: res.itemList || [],
        pagination: {
          pageSize: res.pageSize,
          current: res.current,
          total: res.total,
        },
      });
    });
    if (!this.state.port) {
      this.setState({ port });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { dispatch, currentUser, data } = nextProps;
    if (currentUser._id !== this.props.currentUser._id) {
      dispatch({
        type: 'album/fetch',
        payload: {
          user_id: currentUser._id,
          ...data.pagination,
          currentPage: data.pagination.current,
        }
      });
    }
  }
  handleChange = async ({file,event}) => {
    const { dispatch, currentUser } = this.props;
    const payload = {
      user_id: currentUser._id,
      originalname: file.name,
      album_name: '相册一',
    };
    if (file.status === "uploading") {
      this.setState({
        ProgressVisible: true,
        ProgressPercent: parseInt(event.percent) - 1,
      })
    } else {
      this.setState({
        ProgressVisible: false,
      })
    }
    if (file.response && !file.error) {
      const url = `${QINIU_DOMAIN}/${file.response.key}`;
      payload.href = url;
      const result = await fetch(`${url}?imageInfo`, {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      }).then(response => response.json());
      payload.width = result.width;
      payload.height = result.height;
      dispatch({
        type: 'album/add',
        payload,
        callback: (result1) => {
          if (result1.error) {
            message.error(result1.msg);
          } else {
            message.success(result1.msg);
            dispatch({
              type: 'album/fetch',
              payload: { user_id: currentUser._id }
            });
          }
        },
      });
    }
  }
  handleCancel = () => {
    this.setState({
      previewVisible: false,
    },() => {
      this.setState({
        previewImage: '',
      })
    })
  }

  handlePreview = (photo) => {
    this.setState({
      previewImage: photo.url,
      previewVisible: true,
    });
  }
  makeUploadData = (file) => {
    const { qiniucloud } = this.props;
    const extname = path.extname(file.name);
    return {
      token: qiniucloud.uptoken,
      key: `${file.uid}${extname}`,
    }
  }
  renderPhoto = (photo) => {
    return (
      <Card style={{ width: 160, display: 'inline-block', margin: 10 }} bodyStyle={{ padding: 0 }} key={photo._id} >
        <div className={styles.customImageBox}>
          <img className={styles.customImage} src={photo.url} />
          <div className={styles.customModals}>
            <Icon type="eye" className={styles.customIcon} onClick={() => this.handlePreview(photo)}/>
            <Icon type="delete" className={styles.customIcon} onClick={() => console.log('remove')} />
          </div>
        </div>
        <div className={styles.customCard}>
          <p className={styles.customNodes}>{photo.picWidth} * {photo.picHeight}</p>
          <p className={styles.customNodes}>{photo.title}</p>
        </div>
      </Card>
    );
  }
  showAlbumModal = () => {
    const { dispatch, currentUser } = this.props;
    dispatch({
      type: 'album/show',
    });
  }
  changeAlbumPage = (current, pageSize) => {
    if (this.state.port) {
      this.state.port.postMessage({
        name: 'album',
        pageSize,
        currentPage: current,
      });
    }
  }
  beforeUpload = (file) => {
    const promise = new Promise(function(resolve, reject) {
      const isLt3M = file.size / 1024 / 1024 <= 3;
      if (!isLt3M) {
        message.error('上传图片最大3M');
        reject(isLt3M);
      }
      resolve(isLt3M);
    });
    return promise;
  }
  render() {
    const { loading } = this.props;
    const { previewVisible, previewImage, ProgressVisible, ProgressPercent, itemList, pagination } = this.state;
    const extra = (
      <Upload
        accept="image/*"
        name="file"
        action={QINIU_UPLOAD_DOMAIN}
        showUploadList={false}
        data={this.makeUploadData}
        onChange={this.handleChange}
        beforeUpload={this.beforeUpload}
      >
        <Button onClick={() => {this.setState({ ProgressPercent: 10 })}}>
          <Icon type="upload" /> 点击上传
        </Button>
      </Upload>
    );
    return (
      <div>
        <Card
          title="图片"
          bodyStyle={{ padding: 15 }}
          extra={extra}
        >
          <Spin spinning={loading}>
            {itemList.map(this.renderPhoto)}
          </Spin>
        </Card>
        <Pagination
          {...pagination}
          onChange={this.changeAlbumPage}
          style={{float: 'right', margin: '10px 20px'}}
        />
        <Modal visible={previewVisible} footer={null} width={620} onCancel={this.handleCancel}>
          <div style={{ padding: 20, height: 480, lineHeight: '420px', textAlign: 'center' }}>
            <img style={{ maxWidth: '100%', maxHeight: '100%', height: 'auto', width: 'auto' }} src={previewImage} />
          </div>
        </Modal>
        <Modal closable={false} footer={null} visible={ProgressVisible} onCancel={this.handleProCancel}>
          <Progress percent={ProgressPercent} status="active" />
        </Modal>
      </div>
    );
  }
}
