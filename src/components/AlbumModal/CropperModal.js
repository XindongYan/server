import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Modal, message, Tabs, Icon, Button} from 'antd';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
const TabPane = Tabs.TabPane;

@connect(state => ({
  visible: state.album.cropperModal.visible,
  src: state.album.cropperModal.src,
  aspectRatio: state.album.cropperModal.aspectRatio,
  data: state.album.cropperModal.data,
  width: state.album.cropperModal.width,
  height: state.album.cropperModal.height,
  picWidth: state.album.cropperModal.picWidth,
  picHeight: state.album.cropperModal.picHeight,
  cropperKey: state.album.cropperModal.cropperKey,
}))

export default class CropperModal extends PureComponent {
  state = {
    dataUrl: '',
    nicaiCrx: null,
    version: '',
    confirmLoading: false,
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      const nicaiCrx = document.getElementById('nicaiCrx');
      nicaiCrx.addEventListener('uploadResult', this.uploadResult);
      nicaiCrx.addEventListener('setVersion', this.setVersion);
      if (!this.state.nicaiCrx) {
        this.setState({ nicaiCrx }, () => {
          setTimeout(() => {
            this.handleGetVersion();
          }, 400);
        });
      }
      setTimeout(() => {
        if(!this.state.version){
          message.destroy();
          message.warn('请安装尼采创作平台插件并用淘宝授权登录！', 60 * 60);
          this.setState({ loading: false });
        }
      }, 3000);
    } else if (this.props.visible && !nextProps.visible) {
      const nicaiCrx = document.getElementById('nicaiCrx');
      nicaiCrx.removeEventListener('uploadResult', this.uploadResult);
      nicaiCrx.removeEventListener('setVersion', this.setVersion);
    }
  }
  uploadResult = (e) => {
    const result = JSON.parse(e.target.innerText);
    if (!result.errorCode) {
      this.setState({ confirmLoading: false });
      message.destroy();
      message.success('上传成功');
      if (this.props.onOk) this.props.onOk(result.data[0].url);
      this.setState({ dataUrl: '' });
      this.props.dispatch({
        type: 'album/hideCropper',
      });
    } else {
      message.error(result.message);
    }
  }
  setVersion = (e) => {
    const data = JSON.parse(e.target.innerText);
    this.setState({
      version: data,
    })
  }
  handleGetVersion = () => {
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getVersion', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  handleOk = () => {
    if (this.state.dataUrl && !this.state.confirmLoading) {
      this.setState({ confirmLoading: true });
      nicaiCrx.innerText = JSON.stringify({data: this.state.dataUrl});
      const customEvent = document.createEvent('Event');
      customEvent.initEvent('uploadImg', true, true);
      nicaiCrx.dispatchEvent(customEvent);
      message.destroy();
      message.loading('上传中 ...', 60 * 60);
    }
  }
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'album/hideCropper',
    });
    this.setState({ dataUrl: '' });
  }

  _crop = () => {
    const dataUrl = this.refs.cropper.getCroppedCanvas().toDataURL();
    // console.log(dataUrl);
    this.setState({ dataUrl: dataUrl });
  }
  render() {
    const { visible, minSize, src, aspectRatio, data, width, height, picWidth, picHeight, cropperKey } = this.props;
    const { dataUrl, confirmLoading } = this.state;
    let rate = 1;
    // const frameWidth = (992-40) * 0.62;
    const frameHeight = 400;
    // if (picWidth/frameWidth > picHeight / frameHeight) {
    //   rate = picWidth/frameWidth;
    // } else {
      rate = picHeight / frameHeight;
    // }
    return (
      <Modal
        title="裁切"
        width="992px"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        bodyStyle={{ padding: '5px 20px' }}
        maskClosable={false}
        confirmLoading={confirmLoading}
      >
        {visible && <Cropper
          ref='cropper'
          src={src}
          style={{height: 400, display: 'inline-block', verticalAlign: 'middle'}}
          crossOrigin="anonymous"
          // Cropper.js options
          aspectRatio={width / height}
          minCropBoxWidth={width / rate}
          minCropBoxHeight={height / rate}
          zoomable={false}
          guides={false}
          crop={this._crop.bind(this)} /> }
        <div style={{ width: '38%',  display: 'inline-block', verticalAlign: 'middle', marginLeft: 10, paddingTop: 10}}>
          <img
            src={dataUrl}
            style={{ width: '100%'}}
          />
        </div>
      </Modal>
    );
  }
}
