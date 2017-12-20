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
    nicaiCrx: null,
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
    const port = chrome.runtime.connect('fjnglclceahccegpanoeilhlacgfgncn', {
      name: 'album',
    });
    port.postMessage({ name: 'album', pageSize: pagination.pageSize, currentPage: pagination.current });
    port.onMessage.addListener((res) => {
      if (res.name === 'album'){
        const data = res.data;
        this.setState({
          itemList: data.itemList || [],
          pagination: {
            pageSize: data.pageSize,
            current: data.current,
            total: data.total,
          },
          loading: false,
        });
      } else if (res.name === 'uploadResule') {
        const data = res.result;
        console.log(data);
        if (!data.errorCode) {
          message.success('上传成功');
          port.postMessage({ name: 'album', pageSize: pagination.pageSize, currentPage: 1 });
        } else {
          message.error(data.message);
        }
      }
    });
    if (!this.state.port) {
      this.setState({ port });
    }
    let nicaiCrx = document.getElementById('nicaiCrx');
    
    nicaiCrx.addEventListener('setAlbum', (e) => {
      const data = JSON.parse(e.target.innerText);
      console.log(data);
      this.setState({
        itemList: data.itemList || [],
        pagination: {
          pageSize: data.pageSize,
          current: data.current,
          total: data.total,
        },
        loading: false,
      });
    });
    nicaiCrx.innerText = JSON.stringify({ pageSize: pagination.pageSize, currentPage: pagination.current });
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getAlbum', true, true);
    setTimeout(() => {
      nicaiCrx.dispatchEvent(customEvent);
    }, 1000);
    
    if (!this.state.nicaiCrx) {
      this.setState({ nicaiCrx });
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
    reader.onload = (e) => {   
      // console.log(e.target.result); //就是base64  
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
      <div className={styles.fileInpBox}>
        <div>添加图片</div>
        <input className={styles.fileInp} type="file" onChange={this.beforeUpload} />
      </div>
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
