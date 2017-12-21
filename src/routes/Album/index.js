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
    version: '',
  }
  componentDidMount() {
    const { pagination } = this.state;
    const nicaiCrx = document.getElementById('nicaiCrx');
    nicaiCrx.addEventListener('setAlbum', (e) => {
      const data = JSON.parse(e.target.innerText);
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
    nicaiCrx.addEventListener('uploadResult', (e) => {
      const data = JSON.parse(e.target.innerText);
      if (!data.errorCode) {
        message.success('上传成功');
        this.handleLoadAlbum({ pageSize: pagination.pageSize, current: 1 });
      } else {
        message.error(data.message);
      }
    });
    nicaiCrx.addEventListener('setVersion', (e) => {
      const data = JSON.parse(e.target.innerText);
      this.setState({
        version: data,
      })
    });
    setTimeout(() => {
      this.handleLoadAlbum({ pageSize: pagination.pageSize, current: pagination.current });
      this.handleGetVersion();
    }, 500);
    setTimeout(() => {
      if(!this.state.version){
        message.warn('请安装最新版尼采创作平台插件！');
      } else{
        console.log(this.state.version);
      }
    }, 3000);
    if (!this.state.nicaiCrx) {
      this.setState({ nicaiCrx });
    }
  }
  componentWillReceiveProps(nextProps) {
  }
  handleLoadAlbum = (params) => {
    this.state.nicaiCrx.innerText = JSON.stringify(params);
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getAlbum', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  handleGetVersion = () => {
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getVersion', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
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
    if (this.state.nicaiCrx) {
      this.setState({ loading: true });
      this.handleLoadAlbum({
        pageSize,
        current: current,
      });
    }
  }
  beforeUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();   
    reader.readAsDataURL(file);   
    reader.onload = (e) => {
      // console.log(e.target.result); //就是base64  
      this.state.nicaiCrx.innerText = JSON.stringify({data: e.target.result});
      const customEvent = document.createEvent('Event');
      customEvent.initEvent('uploadImg', true, true);
      this.state.nicaiCrx.dispatchEvent(customEvent);
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
        <label htmlFor="upload">添加图片</label>
        <input id="upload" className={styles.fileInp} type="file" onChange={this.beforeUpload} />
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
