import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Modal, message, Tabs, Icon, Button} from 'antd';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
const TabPane = Tabs.TabPane;

@connect(state => ({
  visible: state.album.jigsawModal.visible,
  src: state.album.jigsawModal.src,
  width: state.album.jigsawModal.width,
  height: state.album.jigsawModal.height,
  picWidth: state.album.jigsawModal.picWidth,
  picHeight: state.album.jigsawModal.picHeight,
  cropperKey: state.album.jigsawModal.cropperKey,
}))

export default class JigsawModal extends PureComponent {
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
        type: 'album/hideJigsaw',
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
      type: 'album/hideJigsaw',
    });
    message.destroy();
    this.setState({ dataUrl: '', confirmLoading: false });
  }

  render() {
    const { visible, src, width, height, picWidth, picHeight, cropperKey } = this.props;
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
        title="搭配"
        width="992px"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        bodyStyle={{ padding: '5px 20px' }}
        maskClosable={false}
        confirmLoading={confirmLoading}
      >
        <canvas id="canvas" width="400" height="400">
        </canvas>
      </Modal>
    );
  }
}
