import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Modal, message, Tabs, Icon, Button, Spin } from 'antd';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
const TabPane = Tabs.TabPane;

@connect(state => ({
  visible: state.album.cutpicModal.visible,
  src: state.album.cutpicModal.src,
  image: state.album.cutpicModal.image,
}))

export default class CutpicModal extends PureComponent {
  state = {
    nicaiCrx: null,
    version: '',
    confirmLoading: false,
    loading: true,
    cutpicUrl: '',
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      const nicaiCrx = document.getElementById('nicaiCrx');
      nicaiCrx.addEventListener('setCutpic', this.setCutpic);
      nicaiCrx.addEventListener('setVersion', this.setVersion);
      nicaiCrx.addEventListener('uploadResult', this.uploadResult);
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
          message.warn('请安装尼采创作平台插件并用淘宝授权登录！', 60 * 60);
          this.setState({ loading: false });
        }
      }, 5000);
    } else if (this.props.visible && !nextProps.visible) {
      const nicaiCrx = document.getElementById('nicaiCrx');
      nicaiCrx.removeEventListener('setCutpic', this.setCutpic);
      nicaiCrx.removeEventListener('uploadResult', this.uploadResult);
    }
  }
  setVersion = (e) => {
    const data = JSON.parse(e.target.innerText);
    if (data.error) {
      message.warn(data.msg);
    }
    this.setState({
      version: data.version,
    }, () => {
      if (this.props.src) {
        this.getCutpic(this.props.src);
      }
    });
    nicaiCrx.removeEventListener('setVersion', this.setVersion);
  }
  setCutpic = (e) => {
    const response = JSON.parse(e.target.innerText);
    const { cutCoverUrl } = this.state;
    if (!response.error) {
      const data = response.data;
      console.log(data);
      if (data.result) {
        this.setState({
          cutpicUrl: data.result,
        });
      }
    } else {
      message.warn(data.msg);
    }
    this.setState({
      loading: false,
    });
  }
  uploadResult = (e) => {
    const result = JSON.parse(e.target.innerText);
    if (!result.errorCode) {
      this.setState({ confirmLoading: false });
      message.destroy();
      message.success('上传成功');
      this.props.dispatch({
        type: 'album/hideCutpic',
      });
    } else {
      message.error(result.message);
    }
  }
  handleGetVersion = () => {
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getVersion', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  getCutpic = (url) => {
    this.state.nicaiCrx.innerText = JSON.stringify({picUrl: url});
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getCutpic', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
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
  handleOk = () => {
    if (!this.state.loading && this.state.cutpicUrl) {
      let image = new Image();
      image.crossOrigin="anonymous";
      image.src = this.state.cutpicUrl;
      image.onload = () => {
        const base64 = this.handleGetBase64(image);
        this.handleSubmit(base64);
      }
    }
  }
  
  handleCancel = () => {
    this.props.dispatch({
      type: 'album/hideCutpic',
    });
  }

  render() {
    const { visible, src } = this.props;
    const { confirmLoading } = this.state;
    
    return (
      <Modal
        title="抠图"
        width="992px"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        bodyStyle={{ padding: 20 }}
        maskClosable={false}
        confirmLoading={confirmLoading}
      >
        <Spin spinning={this.state.loading}>
          <Row gutter={20}>
            <Col span={12}>
              <img
                src={src}
              />
            </Col>
            <Col span={12}>
              <img
                style={{ border: '1px solid #6af' }}
                src={this.state.cutpicUrl}
              />
            </Col>
          </Row>
        </Spin>
      </Modal>
    );
  }
}