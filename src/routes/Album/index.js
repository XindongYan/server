import React, { PureComponent } from 'react';
import { Card, Button, Input, Icon, message, Modal, Pagination, Spin, Progress } from 'antd';
import styles from './index.less';

export default class Album extends PureComponent {
  state = {
    previewVisible: false,
    previewImage: '',
    ProgressVisible: false,
    ProgressPercent: 10,
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
    const nicaiCrx = document.getElementById('nicaiCrx');
    nicaiCrx.addEventListener('setAlbum', this.setAlbum);
    nicaiCrx.addEventListener('uploadResult', this.uploadResult);
    nicaiCrx.addEventListener('setVersion', this.setVersion);
    setTimeout(() => {
      if(!this.state.version){
        message.destroy();
        message.warn('请安装尼采创作平台插件并用淘宝授权登录！', 60 * 60);
        this.setState({ loading: false });
      }
    }, 3000);
    if (!this.state.nicaiCrx) {
      this.setState({ nicaiCrx }, () => {
        setTimeout(() => {
          this.handleGetVersion();
        }, 400);
      });
    }
  }
  componentWillReceiveProps(nextProps) {
  }
  componentWillUnmount() {
    const nicaiCrx = document.getElementById('nicaiCrx');
    nicaiCrx.removeEventListener('setAlbum', this.setAlbum);
    nicaiCrx.removeEventListener('uploadResult', this.uploadResult);
    nicaiCrx.removeEventListener('setVersion', this.setVersion);
  }
  setAlbum = (e) => {
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
  }
  uploadResult = (e) => {
    const data = JSON.parse(e.target.innerText);
    const { pagination } = this.state;
    if (!data.errorCode) {
      message.success('上传成功');
      this.handleLoadAlbum({ pageSize: pagination.pageSize, current: 1 });
    } else {
      message.error(data.message);
    }
  }
  setVersion = (e) => {
    const data = JSON.parse(e.target.innerText);
    const { pagination } = this.state;
    this.handleLoadAlbum({ pageSize: pagination.pageSize, current: 1 });
    this.setState({
      version: data,
    })
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
    this.setState({
      pagination: {
        ...this.state.pagination,
        current,
        pageSize,
      }
    })
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
        console.log(file.size)
        const reader = new FileReader();   
        reader.readAsDataURL(file);   
        reader.onload = (e) => {
          // console.log(e.target.result); //就是base64  
          this.state.nicaiCrx.innerText = JSON.stringify({data: e.target.result});
          const customEvent = document.createEvent('Event');
          customEvent.initEvent('uploadImg', true, true);
          this.state.nicaiCrx.dispatchEvent(customEvent);
        }
      }
    }
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
          {...{
            showSizeChanger: true,
            showQuickJumper: true,
            ...pagination,
          }}
          onChange={this.changeAlbumPage}
          onShowSizeChange={this.changeAlbumPage}
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
