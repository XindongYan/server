import React, { PureComponent } from 'react';
import { Card, Button, Input, Icon, message, Modal, Pagination, Spin, Progress } from 'antd';
import styles from './index.less';
import AuctionModal from '../../components/AuctionModal';

export default class Auction extends PureComponent {
  state = {
    nicaiCrx: null,
    version: '',
    search: '',
    images: [],
    data: null,
    url: '',
    choose: '',
    itemList: [],
    visible: false,
    pagination: {
      pageSize: 20,
      current: 1,
      total: 0,
    },
    loading: true,
  }
  componentDidMount() {
    const nicaiCrx = document.getElementById('nicaiCrx');
    nicaiCrx.addEventListener('setAuction', this.setAuction);
    nicaiCrx.addEventListener('uploadResult', this.uploadResult);
    nicaiCrx.addEventListener('setVersion', this.setVersion);
    setTimeout(() => {
      if(!this.state.version){
        message.destroy();
        message.warn('请安装尼采创作平台插件并用淘宝授权登录！', 60 * 60);
        this.setState({ loading: false });
      }
    }, 5000);
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
    nicaiCrx.removeEventListener('setAuction', this.setAuction);
    nicaiCrx.removeEventListener('uploadResult', this.uploadResult);
    nicaiCrx.removeEventListener('setVersion', this.setVersion);
  }
  setAuction = (e) => {
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
      message.success('上传成功');
      this.handleGetAuction({ pageSize: pagination.pageSize, current: 1 });
    } else {
      message.error(data.message);
    }
  }
  setVersion = (e) => {
    const data = JSON.parse(e.target.innerText);
    const { pagination } = this.state;
    if (data.error) {
      message.warn(data.msg);
      this.setState({
        loading: false,
      });
    } else {
      this.handleGetAuction({ pageSize: pagination.pageSize, current: 1 });
    }
    this.setState({
      version: data.version,
    })
  }

  handleGetAuction = (params) => {
    this.state.nicaiCrx.innerText = JSON.stringify(params);
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getAuction', true, true);
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
            {/*
              <Icon type="delete" className={styles.customIcon} onClick={() => console.log('remove')} />
            */}
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
      this.handleGetAuction({
        pageSize,
        current,
      });
    }
  }
  handleAddProduct = () => {

  }
  render() {
    const { previewVisible, previewImage, ProgressVisible, ProgressPercent, itemList, pagination, loading } = this.state;
    const extra = (
      <div className={styles.fileInpBox}>
        <label htmlFor="upload">添加商品</label>
        <input id="upload" className={styles.fileInp} type="file" onChange={this.beforeUpload} />
      </div>
    );
    return (
      <div>
        <Card
          title="商品"
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
        <Modal visible={previewVisible} footer={null} width={720} onCancel={this.handleCancel}>
          <div style={{ padding: 20, height: 480, lineHeight: '440px', textAlign: 'center' }}>
            <img style={{ maxWidth: '100%', maxHeight: '100%', height: 'auto', width: 'auto' }} src={previewImage} />
          </div>
        </Modal>
        <Modal closable={false} footer={null} visible={ProgressVisible} onCancel={this.handleProCancel}>
          <Progress percent={ProgressPercent} status="active" />
        </Modal>
        <AuctionModal visible={this.state.visible} onOk={this.handleAddProduct} onCancel={this.handleAuctionHide} />
      </div>
    );
  }
}
