import React, { PureComponent } from 'react';
import { connect } from 'dva';
import fetch from 'dva/fetch';
import path from 'path';
import { Table, Card, Button, Upload, Icon, message } from 'antd';
import { QINIU_DOMAIN, QINIU_UPLOAD_DOMAIN } from '../../constants';

@connect(state => ({
  currentUser: state.user.currentUser,
  data: state.album.data,
  loading: state.album.loading,
  qiniucloud: state.qiniucloud,
}))

export default class Album extends PureComponent {
  state = {
    choosen: [],
  }
  componentDidMount() {
    const { dispatch, currentUser } = this.props;
    dispatch({
      type: 'album/fetch',
      payload: { user_id: currentUser._id }
    });
    dispatch({
      type: 'qiniucloud/fetchUptoken'
    });
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
  makeUploadData = (file) => {
    const { qiniucloud } = this.props;
    const extname = path.extname(file.name);
    return {
      token: qiniucloud.uptoken,
      key: `${file.uid}${extname}`,
    }
  }
  renderPhoto = (photo) => {
    const isChoosen = this.state.choosen.find(item => item._id === photo._id);
    return (
      <Card style={{ width: 140, display: 'inline-block', margin: 5 }} bodyStyle={{ padding: 0 }} key={photo._id} >
        <div className="custom-image">
          <img style={{ display: 'block' }} alt="example" width="100%" src={`${photo.href}?imageView2/2/w/300/h/300/q/100`} />
        </div>
        <div className="custom-card">
          <h3>{photo.width} x {photo.height}</h3>
          <p style={{ color: "#999" }}>{photo.originalname}</p>
        </div>
      </Card>
    );
  }
  render() {
    const { data, loading, visible } = this.props;
    const extra = (
      <Upload name="file" action={QINIU_UPLOAD_DOMAIN} showUploadList={false} data={this.makeUploadData} onChange={this.handleChange}>
        <Button>
          <Icon type="upload" /> 点击上传
        </Button>
      </Upload>
      );
    return (
      <Card
        title="素材"
        bodyStyle={{ padding: 15 }}
        extra={extra}
      >
        {data.list.map(this.renderPhoto)}
      </Card>
    );
  }
}
