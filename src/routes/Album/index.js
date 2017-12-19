import React, { PureComponent } from 'react';
import { Card, Button, Input, Icon, message, Modal, Pagination, Spin, Progress } from 'antd';
import styles from './index.less';

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
    loading: true,
  }
  componentDidMount() {
    const { pagination } = this.state;
    const port = chrome.runtime.connect('kfcjndkonfgfjijadngeabdhhmilaihk', {
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
        loading: false,
      });
    });
    if (!this.state.port) {
      this.setState({ port });
    }
  }
  componentWillReceiveProps(nextProps) {
    
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
  renderPhoto = (photo) => {
    return (
      <Card style={{ width: 160, display: 'inline-block', margin: 10 }} bodyStyle={{ padding: 0 }} key={photo.id} >
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
  changeAlbumPage = (current, pageSize) => {
    if (this.state.port) {
      this.setState({ loading: true });
      this.state.port.postMessage({
        name: 'album',
        pageSize,
        currentPage: current,
      });
    }
  }
  beforeUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();   
    reader.readAsDataURL(file);   
    reader.onload = function(e){   
      console.log(e.target.result); //就是base64  
      if (this.state.port) {
        this.state.port.postMessage({
          name: 'image',
          data: e.target.result,
        });
      }
    }   
    // const promise = new Promise(function(resolve, reject) {
    //   const isLt3M = file.size / 1024 / 1024 <= 3;
    //   if (!isLt3M) {
    //     message.error('上传图片最大3M');
    //     reject(isLt3M);
    //   }
    //     resolve(isLt3M);
    // });
    // return promise;
  }
  render() {
    const { previewVisible, previewImage, ProgressVisible, ProgressPercent, itemList, pagination, loading } = this.state;
    const extra = (
      <Input type="file" onChange={this.beforeUpload}/>
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
