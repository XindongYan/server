import React, { PureComponent } from 'react';
import { connect } from 'dva';
import fetch from 'dva/fetch';
import path from 'path';
import { Card, Button, Upload, Icon, message, Modal, Pagination, Spin} from 'antd';
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
  }
  componentDidMount() {
    const { dispatch, currentUser, data } = this.props;
    if (currentUser._id) {
      dispatch({
        type: 'album/fetch',
        payload: {
          user_id: currentUser._id,
          ...data.pagination,
          currentPage: data.pagination.current,
        }
      });
    }
    dispatch({
      type: 'qiniucloud/fetchUptoken'
    });
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
  handleChange = async ({file}) => {
    const { dispatch, currentUser } = this.props;
    const payload = {
      user_id: currentUser._id,
      originalname: file.name,
      album_name: '相册一',
    };
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
  handleRemove = (photo) => {
    const { dispatch, currentUser } = this.props;
    dispatch({
      type: 'album/remove',
      payload: { _id: photo._id },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          message.success(result.msg);
          dispatch({
            type: 'album/fetch',
            payload: { user_id: currentUser._id }
          });
        }
      },
    });
  }
  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (photo) => {
    this.setState({
      previewImage: photo.href,
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
          <img className={styles.customImage} alt="example" width="100%" src={`${photo.href}?imageView2/2/w/300/h/300/q/100`} />
          <div className={styles.customModals}>
            <Icon type="eye" className={styles.customIcon} onClick={() => this.handlePreview(photo)}/>
            <Icon type="delete" className={styles.customIcon} onClick={() => this.handleRemove(photo)} />
          </div>
        </div>
        <div className="custom-card">
          <p className={styles.customNodes}>{photo.width} * {photo.height}</p>
          <p className={styles.customNodes}>{photo.originalname}</p>
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
    const { dispatch, currentUser } = this.props;
    dispatch({
      type: 'album/fetch',
      payload: {
        user_id: currentUser._id,
        pageSize,
        currentPage: current,
      }
    });
  }
  render() {
    const { data, loading } = this.props;
    const { previewVisible, previewImage } = this.state;
    const extra = (
      <Upload
        accept="image/*"
        name="file"
        action={QINIU_UPLOAD_DOMAIN}
        showUploadList={false}
        data={this.makeUploadData}
        onChange={this.handleChange}
      >
        <Button>
          <Icon type="upload" /> 点击上传
        </Button>
      </Upload>
    );
    return (
      <div>
        <Card
          title="素材"
          bodyStyle={{ padding: 15 }}
          extra={extra}
        >
          <Spin spinning={loading}>
            {data.list.map(this.renderPhoto)}
          </Spin>
        </Card>
        <Pagination
          {...data.pagination}
          onChange={this.changeAlbumPage}
          style={{float: 'right', margin: '10px 20px'}}
        />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
