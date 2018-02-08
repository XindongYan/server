import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Modal, message, Tabs, Icon, Button, Tooltip, Spin } from 'antd';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
const TabPane = Tabs.TabPane;

@connect(state => ({
  visible: state.album.cropperModal.visible,
  src: state.album.cropperModal.src,
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
    outputWidth: 0,
    outputHeight: 0,
    setCropData: true,
    frameWidth: (992-40) * 0.58,
    frameHeight: 360,
    loading: false,
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.k === nextProps.cropperKey) {
      if (!this.props.visible && nextProps.visible) {
        const nicaiCrx = document.getElementById('nicaiCrx');
        nicaiCrx.addEventListener('uploadResult', this.uploadResult);
        nicaiCrx.addEventListener('setVersion', this.setVersion);
        if (!this.state.nicaiCrx) {
          this.setState({ nicaiCrx }, () => {
            setTimeout(() => {
              this.handleGetVersion();
            }, 600);
          });
        }
        // setTimeout(() => {
        //   if(!this.state.version){
        //     message.destroy();
        //     message.warn('请安装尼采创作平台插件！', 60 * 60);
        //     this.setState({ loading: false });
        //   }
        // }, 5000);
        this.setState({
          loading: true,
        });
      } else if (this.props.visible && !nextProps.visible) {
        const nicaiCrx = document.getElementById('nicaiCrx');
        nicaiCrx.removeEventListener('uploadResult', this.uploadResult);
        this.setState({
          nicaiCrx: null,
          setCropData: true,
          outputWidth: 0,
          outputHeight: 0,
        });
      }
    }
  }
  uploadResult = (e) => {
    const result = JSON.parse(e.target.innerText);
    if (!result.errorCode && result.data.length > 0) {
      this.setState({ confirmLoading: false });
      message.destroy();
      message.success('上传成功');
      if (this.props.onOk) this.props.onOk({
        materialId: result.data[0].materialId,
        picWidth: result.data[0].picWidth,
        picHeight: result.data[0].picHeight,
        url: result.data[0].url,
      });
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
    if (data.error) {
      message.warn(data.msg);
    }
    this.setState({
      version: data.version,
    });
    this.state.nicaiCrx.removeEventListener('setVersion', this.setVersion);
  }
  handleGetVersion = () => {
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getVersion', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  handledataURLtoBlob = (dataurl) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while(n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
      type: mime
    });
  }
  handleOk = () => {
    if (this.state.dataUrl && !this.state.confirmLoading) {
      const { maxSize } = this.props;
      const dataSize = this.handledataURLtoBlob(this.state.dataUrl).size;
      const imgSize = Math.ceil(dataSize / 1024 * 1.024);
      if (imgSize > 500) {
        let n = ((maxSize/imgSize).toFixed(2) + '').substr(0, 3);
        if (n < 0.1) {
          n = 0.1;
        }
        const newDataUrl = this.refs.cropper.getCroppedCanvas({fillColor:'#fff'}).toDataURL("image/jpeg", n);
        this.handleSubmit(newDataUrl);
      } else {
        this.handleSubmit(this.state.dataUrl);
      }
    }
  }
  handleSubmit = (url) => {
    this.setState({ confirmLoading: true });
    nicaiCrx.innerText = JSON.stringify({data: url});
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('uploadImg', true, true);
    nicaiCrx.dispatchEvent(customEvent);
    message.destroy();
    message.loading('上传中 ...', 60 * 60);
  }
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'album/hideCropper',
    });
    message.destroy();
    this.setState({ dataUrl: '', confirmLoading: false });
  }

  _crop = () => {
    if (this.state.setCropData) {
      if (this.props.width === 0) {
        const { frameWidth, frameHeight} = this.state;
        const rate = this.handelGetRate();
        const width = 500 / rate;
        const height = 500 / rate;
        rate
        this.refs.cropper.setCropBoxData({ width, height, top: (frameHeight-height)/2, left: (frameWidth-width)/2 });
        this.setState({
          outputWidth: 500,
          outputHeight: 500,
          setCropData: false,
          loading: false,
        });
      }
    }
    const canvas = this.refs.cropper.getCroppedCanvas();
    const dataUrl = canvas.toDataURL();
    this.setState({
      dataUrl,
      outputWidth: canvas.width,
      outputHeight: canvas.height,
      loading: false,
    });
  }
  handelGetRate = () => {
    const { picWidth, picHeight } = this.props;
    const { frameWidth, frameHeight} = this.state;
    let rate = 1;
    if (picWidth/frameWidth > picHeight / frameHeight) {
      rate = picWidth/frameWidth;
    } else {
      rate = picHeight / frameHeight;
    }
    console.log(rate);
    console.log(rate.toFixed(2));
    return rate.toFixed(2);
  }
  render() {
    const { visible, src, width, height, picWidth, picHeight, cropperKey, k } = this.props;
    const { dataUrl, confirmLoading, frameWidth, frameHeight } = this.state;
    let aspectRatio = 0;
    if (width > 0) {
      aspectRatio = width / height;
    }
    const rate = this.handelGetRate();
    return (
      <Modal
        title="裁切"
        width="992px"
        visible={k === cropperKey && visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        bodyStyle={{ padding: '5px 20px' }}
        maskClosable={false}
        confirmLoading={confirmLoading}
      >
        <Spin spinning={this.state.loading}>
        {k === cropperKey && visible &&
          <Cropper
            ref='cropper'
            src={src}
            style={{height: frameHeight, width: '58%', display: 'inline-block', verticalAlign: 'middle', background: '#fff' }}
            crossOrigin="anonymous"
            // Cropper.js options
            aspectRatio={aspectRatio}
            minCropBoxWidth={width / rate}
            minCropBoxHeight={height / rate}
            zoomable={false}
            guides={false}
            dragMode="none"
            viewMode={1}
            crop={this._crop.bind(this)}
          />
        }
        <div style={{ width: '40%', display: 'inline-block', verticalAlign: 'middle', marginLeft: 10, textAlign: 'center' }}>
          <div>{this.state.outputWidth}x{this.state.outputHeight}</div>
          <img
            src={dataUrl}
            style={{ maxWidth: '100%', maxHeight: frameHeight - 21 }}
          />
        </div>
        </Spin>
      </Modal>
    );
  }
}
