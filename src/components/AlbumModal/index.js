import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Modal, message, Tabs, Icon, Upload, Button, Pagination} from 'antd';
import { QINIU_DOMAIN, QINIU_UPLOAD_DOMAIN } from '../../constants';
import path from 'path';
import styles from './index.less';
const TabPane = Tabs.TabPane;

@connect(state => ({
  currentUser: state.user.currentUser,
  visible: state.album.visible,
  qiniucloud: state.qiniucloud,
  currentKey: state.album.currentKey,
  previewImgList: state.album.previewImgList,
}))

  
export default class AlbumModal extends PureComponent {
  state = {
    choosen: [],
    previewImage: '',
    port: null,
    itemList: [],
    pagination: {
      pageSize: 12,
      current: 1,
      total: 0,
    },
    loading: true,
    previewImgList: [],
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
      const result = JSON.parse(e.target.innerText);
      if (this.props.k === this.props.currentKey) {
        if (!result.errorCode) {
          message.success('上传成功');
          this.setState({
            choosen: [ ...this.state.choosen, result.data[0] ],
          })
        } else {
          message.error(result.message);
        }
      }
    });
    setTimeout(() => {
      this.handleLoadAlbum({ pageSize: pagination.pageSize, currentPage: pagination.current });
    }, 500);
    
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
  handleOk = () => {
    if (this.state.choosen.length > 0) {
      if (this.props.onOk) this.props.onOk(this.state.choosen);
      this.setState({ choosen: [] });
    }
    this.props.dispatch({
      type: 'album/hide',
    });
  }
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'album/hide',
    });
    this.setState({ choosen: [] });
  }
  handleChoose = (photo) => {
    const { mode } = this.props;
    const index = this.state.choosen.findIndex(item => item.id === photo.id);
    if( mode==='single' ) {
      this.setState({ choosen: [ photo ] });
    } else {
      if (index === -1) {
        this.setState({ choosen: [ ...this.state.choosen, { ...photo, uid: photo.id } ] });
      } else {
        const choosed = [...this.state.choosen];
        choosed.splice(index,1);
        this.setState({ choosen: [...choosed] });
      }
    }
  }
  renderPhoto = (photo, index) => {
    const { minSize } = this.props;
    return (
      <Card style={{ width: 140, display: 'inline-block', margin: 5 }} bodyStyle={{ padding: 0 }} key={photo.id}>
        <div className={styles.customImageBox} onClick={() => this.handleChoose(photo)}>
          <img
            className={styles.customImage}
            width="100%"
            src={photo.url}
          />
          <div style={{display: this.state.choosen.find(item => item.id === photo.id) ? 'block' : 'none'}} className={styles.chooseModal}>
            <Icon type="check" />
          </div>          
        </div>
        <div style={{display: minSize && (photo.picWidth < minSize.width || photo.picHeight < minSize.height) ? 'block' : 'none'}} className={styles.diabledModal}>尺寸不符</div>
        <div className="custom-card">
          <p className={styles.customNodes}>{photo.picWidth} * {photo.picHeight}</p>
          <p className={styles.customNodes}>{photo.title}</p>
        </div>
      </Card>
    );
  }

  previewPhoto = (photo, index) => {
    return (
      <div className={styles.previewImg} key={index}>
        <img src={photo.url} />
      </div>
    );
  }
  changeTab = (e) => {
    const { choosen, pagination } = this.state;
    if (e === "album") {
      this.handleLoadAlbum({ pageSize: pagination.pageSize, currentPage: pagination.currentPage });
    }
    this.setState({ choosen: [] });
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
  handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
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
  render() {
    const { visible, k, currentKey, minSize } = this.props;
    const { choosen, previewImage, itemList, pagination, loading, previewImgList } = this.state;
    return (
      <Modal
        title="素材"
        width="992px"
        visible={k === currentKey && visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        bodyStyle={{ padding: '5px 20px' }}
      >
        <Tabs defaultActiveKey="album" onChange={this.changeTab}>
          <TabPane tab={<span><Icon type="picture" />素材库</span>} key="album">
            <div>
              {itemList.map(this.renderPhoto)}
            </div>
            <Pagination
              {...pagination}
              onChange={this.changeAlbumPage}
              style={{float: 'right', margin: '10px 20px'}}
            />
          </TabPane>
          <TabPane tab={<span><Icon type="upload" />上传</span>} key="upload">
            <div className="uploadBox">
              <div className={styles.uploadInpBox}>
                <div className={styles.uploadViewBox}>
                  <Icon type="plus" style={{ fontSize: 32, color: '#6AF' }} />
                  <p>直接拖拽文件到虚线框内即可上传</p>
                </div>
                <input className={styles.fileInp} type="file" onChange={this.handleUpload} />
              </div>
              <p style={{ fontSize: 12 }}>请选择大小不超过 3 MB 的文件</p>
              <div className={styles.previewBox}>           
                {choosen.map(this.previewPhoto)}
              </div>
            </div>
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}
