import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Modal, message, Tabs, Icon, Upload, Button, Pagination} from 'antd';
import { QINIU_DOMAIN, QINIU_UPLOAD_DOMAIN } from '../../constants';
import path from 'path';
import styles from './index.less';
const TabPane = Tabs.TabPane;

function beforeUpload(file, minSize){
  const promise = new Promise(function(resolve, reject) {
    const isLt3M = file.size / 1024 / 1024 <= 3;
    if (!isLt3M) {
      message.error('上传图片最大3M');
      reject(isLt3M);
    } else if (minSize) {
      const image = new Image();
      image.onload = function () {
        if(image.width < minSize.width || image.height < minSize.height) {
          message.error('图片大小不符合要求');
          reject(false);
        } else {
          resolve(true);
        }
      };
      const fr = new FileReader();
      fr.onload = function() {
          image.src = fr.result;
      };
      fr.readAsDataURL(file);
    } else {
      resolve(isLt3M);
    }
  });
  return promise;
}
@connect(state => ({
  currentUser: state.user.currentUser,
  visible: state.album.visible,
  qiniucloud: state.qiniucloud,
  currentKey: state.album.currentKey,
}))

  
export default class AlbumModal extends PureComponent {
  state = {
    choosen: [],
    fileList: [],
    previewImage: '',
    previewVisible: false,

    port: null,
    itemList: [],
    pagination: {
      pageSize: 12,
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
  handleOk = () => {
    if (this.state.choosen.length) {
      if (this.props.onOk) this.props.onOk(this.state.choosen);
      this.setState({ choosen: [], fileList: [] });
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
    this.setState({ choosen: [], fileList: [] });
  }
  handleChoose = (photo) => {
    const { mode } = this.props;
    const index = this.state.choosen.findIndex(item => item._id === photo._id);
    if( mode==='single' ) {
      this.setState({ choosen: [ photo ] });
    } else {
      if (index === -1) {
        this.setState({ choosen: [ ...this.state.choosen, { ...photo, uid: photo._id } ] });
      } else {
        const choosed = [...this.state.choosen];
        choosed.splice(index,1);
        this.setState({ choosen: [...choosed] });
      }
    }
  }
  makeUploadData = (file) => {
    const { qiniucloud } = this.props;
    const extname = path.extname(file.name);
    return {
      token: qiniucloud.uptoken,
      key: `${file.uid}${extname}`,
    }
  }

  handleChange = async ({file,fileList}) => {
    const { dispatch, currentUser, mode, minSize } = this.props;
    const that = this;
    const payload = {
      user_id: currentUser._id,
      originalname: file.name,
      album_name: '相册一',
    };
    if(mode==='single') {
      this.setState({ fileList: [file] });
    } else {
      this.setState({ fileList: fileList });
    }
    if (file.status === 'done' && file.response && !file.error) {
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
            if(mode==='single') {
              that.setState({ choosen: [ result1.photo ] });
            } else {
              that.setState({ choosen: [ ...that.state.choosen, result1.photo ] });
            }
            dispatch({
              type: 'album/fetch',
              payload: { user_id: currentUser._id }
            });
          }
        },
      });
    } else if (file.status === 'removed') {
      const index = this.state.choosen.findIndex(item => item.originalname === file.name);
      this.state.choosen.splice(index,1);
      this.setState({
        fileList: fileList,
      })
    }
  }

  renderPhoto = (photo, index) => {
    const { minSize } = this.props;
    const isChoosen = this.state.choosen.find(item => item.id === photo.id);
    return (
      <Card style={{ width: 140, display: 'inline-block', margin: 5 }} bodyStyle={{ padding: 0 }} key={photo.id}>
        <div className={styles.customImageBox} onClick={() => this.handleChoose(photo)}>
          <img
            className={styles.customImage}
            alt="example" width="100%"
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
  changeTab = (e) => {
    const { choosen } = this.state;
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
  handlePreview = (file) => {
    console.log(file)
    this.setState({
      previewImage: file.url || file.thumbUrl || '',
      previewVisible: true,
    });
  }
  handleImgCancel = () => {
    this.setState({
      previewImage: '',
      previewVisible: false,
    });
  }
  render() {
    const { visible, k, currentKey, minSize } = this.props;
    const { choosen, fileList, previewVisible, previewImage, itemList, pagination, loading } = this.state;
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
              <Upload
                name="file"
                accept="image/*"
                action={QINIU_UPLOAD_DOMAIN}
                data={this.makeUploadData}
                beforeUpload={(file) => beforeUpload(file,minSize)}
                onChange={this.handleChange}
                listType="picture-card"
                fileList={fileList}
                onPreview={this.handlePreview}
              >
                <div style={{height: '120px', 'paddingTop': '40px'}}>
                  <Icon type="plus" />
                  <div className="ant-upload-text">Upload</div>
                </div>
              </Upload>
              <Modal visible={previewVisible} footer={null} onCancel={this.handleImgCancel}>
                <div style={{ minHeight: 200 }}>
                  { previewImage &&
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  }
                </div>
              </Modal>
            </div>
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}
