import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Modal, message, Tabs, Icon, Upload, Button, Pagination, Spin} from 'antd';
import styles from './index.less';
import CropperModal from './CropperModal';
import CutpicModal from './CutpicModal';
const TabPane = Tabs.TabPane;

@connect(state => ({
  visible: state.album.visible,
  qiniucloud: state.qiniucloud,
  currentKey: state.album.currentKey,
}))

  
export default class AlbumModal extends PureComponent {
  state = {
    choosen: [],
    previewImage: '',
    nicaiCrx: null,
    itemList: [],
    pagination: {
      pageSize: 12,
      current: 1,
      total: 0,
    },
    loading: true,
    version: '',
    activeKey: 'album',
    firstUrl: '',
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.k === nextProps.currentKey) {
      if (!this.props.visible && nextProps.visible) {
        if (nextProps.k === 'material') {
          this.setState({
            activeKey: 'upload',
          });
        } else {
          this.setState({
            activeKey: 'album',
          });
        }
        const nicaiCrx = document.getElementById('nicaiCrx');
        nicaiCrx.addEventListener('setAlbum', this.setAlbum);
        nicaiCrx.addEventListener('uploadResult', this.uploadResult);
        nicaiCrx.addEventListener('setVersion', this.setVersion);
        if (!this.state.nicaiCrx) {
          this.setState({ nicaiCrx }, () => {
            setTimeout(() => {
              this.handleGetVersion();
            }, 600);
          });
        }
        setTimeout(() => {
          if(!this.state.version){
            message.destroy();
            message.warn('请安装尼采创作平台插件！', 60 * 60);
            this.setState({ loading: false });
          }
        }, 5000);
      } else if (this.props.visible && !nextProps.visible) {
        const nicaiCrx = this.state.nicaiCrx;
        nicaiCrx.removeEventListener('setAlbum', this.setAlbum);
        nicaiCrx.removeEventListener('uploadResult', this.uploadResult);
        this.setState({
          nicaiCrx: null,
        });
        this.handleClearInp();
      }
    }
  }
  setAlbum = (e) => {
    const data = JSON.parse(e.target.innerText);
    if (!data.error) {
      if (data.current === 1 && data.itemList.length > 0) {
        this.setState({
          firstUrl: data.itemList[0].url,
        });
      }
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
      message.warn(data.msg);
      this.setState({
        loading: false,
      });
    }
  }
  uploadResult = (e) => {
    const result = JSON.parse(e.target.innerText);
    if (this.props.k === this.props.currentKey) {
      if (!result.errorCode && result.data) {
        const choosen = [...this.state.choosen];
        choosen[result.index] = result.data[0];
        if (this.props.k === 'editor' || this.props.k === 'material'){
          this.setState({
            choosen: choosen,
          });
        } else {
          this.setState({
            choosen: choosen,
          });
        }
      } else {
        message.error(result.message);
      }
    }
  }
  setVersion = (e) => {
    const data = JSON.parse(e.target.innerText);
    if (this.props.k === this.props.currentKey) {
      if (data.version) {
        this.setState({
          version: data.version,
        });
      }
      this.state.nicaiCrx.removeEventListener('setVersion', this.setVersion);
      const { pagination } = this.state;
      if (data.error) {
        message.warn(data.msg);
        this.setState({
          loading: false,
        });
      } else {
        this.handleLoadAlbum({ pageSize: pagination.pageSize, current: 1 });
      }
    }
  }
  handleLoadAlbum = (params) => {
    this.state.nicaiCrx.innerText = JSON.stringify(params);
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getAlbum', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  handleGetVersion = () => {
    this.state.nicaiCrx.innerText = '';
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getVersion', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  handleOk = () => {
    if (this.state.choosen.length > 0) {
      if (this.props.minSize) {
        this.props.dispatch({
          type: 'album/showCropper',
          payload: {
            visible: true,
            src: this.state.choosen[0].url,
            width: this.props.minSize.width,
            height: this.props.minSize.height,
            picHeight: this.state.choosen[0].picHeight,
            picWidth: this.state.choosen[0].picWidth,
            cropperKey: this.props.currentKey,
          }
        });
        this.setState({ choosen: [] });
      } else {
        if (this.props.onOk) this.props.onOk(this.state.choosen);
        this.setState({ choosen: [] });
      }
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
    message.destroy();
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
    const { minSize, k } = this.props;
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
        { k !== 'editor' && minSize && (photo.picWidth < minSize.width || photo.picHeight < minSize.height) &&
          <div className={styles.diabledModal}>
            尺寸不符
          </div>
        }
        <div className="custom-card">
          <p className={styles.customNodes}>{photo.picWidth} * {photo.picHeight}</p>
          <p className={styles.customNodes}>{photo.title}</p>
        </div>
      </Card>
    );
  }

  previewPhoto = (photo, index) => {
    if (photo && photo.url) {
      return (
        <div className={styles.previewImg} key={index}>
          <img src={photo.url} />
        </div>
      );
    } else {
      return (
        <div key={index}>
          <Spin className={styles.previewImg}/>
        </div>
      );
    }
  }
  changeTab = (e) => {
    const { choosen, pagination } = this.state;
    this.setState({
      activeKey: e,
    });
    if (e === "album") {
      this.handleLoadAlbum({ pageSize: pagination.pageSize, current: pagination.current });
      this.handleClearInp();
    }
    this.setState({ choosen: [] });
  }
  changeAlbumPage = (current, pageSize) => {
    if (this.state.nicaiCrx) {
      this.setState({ loading: true });
      this.handleLoadAlbum({ pageSize, current });
    }
  }
  handleUpload = (e) => {
    const { k, minSize } = this.props;
    const { nicaiCrx, itemList, firstUrl } = this.state;
    const file = e.target.files[0];
    if (file) {
      if (file.size / 1024 / 1024 >= 3) {
        message.warn('上传图片最大3M');
      } else if (this.props.maxSize && file.size / 1024 / 1.024 > this.props.maxSize) {
        message.warn('请上传符合要求大小的图片');
      } else {
        var reader = new FileReader();  
        reader.readAsDataURL(file);
        //监听文件读取结束后事件
        reader.onloadend = (e1) => {
          if (minSize) {
            var img = new Image();
            img.src = e1.target.result;
            img.onload = (event) => {
              if (img.height < minSize.height || img.width < minSize.width) {
                message.warn(`图片尺寸不能小于${minSize.width}*${minSize.height}px`);
              } else {
                this.handleSubmitImg(e1.target.result);
              }
            }
          } else {
            this.handleSubmitImg(e1.target.result);
          }
        };
      }
    }
  }
  handleSubmitImg = (url) => {
    this.state.nicaiCrx.innerText = JSON.stringify({data: url, index: this.state.choosen.length});
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('uploadImg', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
    if (this.props.k === 'editor' || this.props.k === 'material'){
      this.setState({
        choosen: [ ...this.state.choosen, {} ],
      });
    } else {
      this.setState({
        choosen: [{}],
      });
    }
  }
  handleToCropper = () => {
    if (this.props.minSize) {
      this.handleOk();
    } else {
      this.props.dispatch({
        type: 'album/showCropper',
        payload: {
          visible: true,
          src: this.state.choosen[0].url,
          width: 0,
          height: 0,
          picHeight: this.state.choosen[0].picHeight,
          picWidth: this.state.choosen[0].picWidth,
          cropperKey: this.props.currentKey,
        }
      });
      this.setState({ choosen: [] });
      this.props.dispatch({
        type: 'album/hide',
      });
    }
  }
  handleToCutpic = () => {
    this.props.dispatch({
      type: 'album/showCutpic',
      payload: {
        cutpicKey: this.props.currentKey,
        src: this.state.choosen[0].url,
      }
    });
    // this.props.dispatch({
    //   type: 'album/hide',
    // });
  }
  handleCropperOk = (img) => {
    if (this.props.onOk) this.props.onOk([img]);
  }
  handleCutpicOk = (img) => {
    const { choosen, pagination } = this.state;
    this.setState({ choosen: [img] });
    this.handleLoadAlbum({ pageSize: pagination.pageSize, current: 1 });
  }
  handleGetBase64 = (img) =>{
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
    var dataURL = canvas.toDataURL();
    return dataURL;
  }
  handleClearInp = () => {
    const fileInp = this.refs.fileInp;
    if (fileInp) {
      fileInp.value = '';
    }
  }
  render() {
    const { visible, k, currentKey, minSize } = this.props;
    const { choosen, previewImage, itemList, pagination, loading } = this.state;
    return (
      <div>
        <Modal
          title="素材"
          width="992px"
          visible={k === currentKey && visible}
          bodyStyle={{ padding: '5px 20px' }}
          onCancel={this.handleCancel}
          footer={choosen && choosen.length === 1 ? [
            <Button key="cutpic" onClick={this.handleToCutpic}>抠图</Button>,
            <Button key="cropper" onClick={this.handleToCropper} style={{marginRight: 20}}>裁图</Button>,
            <Button key="cancel" onClick={this.handleCancel}>取消</Button>,
            <Button type="primary" key="ok" onClick={this.handleOk}>确定</Button>,
          ] : [
            <Button key="cancel" onClick={this.handleCancel}>取消</Button>,
            <Button type="primary" key="ok" onClick={this.handleOk}>确定</Button>,
          ]}
        >
          <Tabs defaultActiveKey="album" onChange={this.changeTab} activeKey={this.state.activeKey}>
            {this.props.k !== 'material' &&
              <TabPane tab={<span><Icon type="picture" />素材库</span>} key="album">
              <Spin spinning={loading}>
                <div>
                  {itemList.map(this.renderPhoto)}
                </div>
                <Pagination
                  {...pagination}
                  onChange={this.changeAlbumPage}
                  style={{float: 'right', margin: '10px 20px'}}
                />
              </Spin>
            </TabPane>}
            <TabPane tab={this.props.k !== 'material' ? <span><Icon type="upload" />上传</span> :  <span></span>} key="upload">
              <div>
                <div className={styles.uploadInpBox}>
                  <div className={styles.uploadViewBox}>
                    <Icon type="plus" style={{ fontSize: 32, color: '#6AF' }} />
                    <p>直接拖拽文件到虚线框内即可上传</p>
                  </div>
                  <input className={styles.fileInp} type="file" onChange={this.handleUpload} ref="fileInp" />
                </div>
                <p style={{ fontSize: 12 }}>请选择大小不超过 3 MB 的文件</p>
                <div className={styles.previewBox}>           
                  {choosen.map(this.previewPhoto)}
                </div>
              </div>
            </TabPane>
          </Tabs>
        </Modal>
        { k === currentKey &&
          <CropperModal k={currentKey} onOk={this.handleCropperOk} />
        }
        { k === currentKey &&
          <CutpicModal k={currentKey} onOk={this.handleCutpicOk} />
        }
      </div>
    );
  }
}
