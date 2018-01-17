import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, message, Input, Button, Row, Col } from 'antd';

import qrcode from './qrcode.js';
import styles from './index.less';

@connect(state => ({

}))

export default class Extension extends PureComponent {
  state = {
    publicQRcodeUrl: '',
  }
  componentDidMount() {
    document.addEventListener('copy', this.handelCopy);
  }
  componentWillReceiveProps(nextProps) {
    const { url, visible } = nextProps;
    const show = visible || this.state.visible;
    if (url) {
      const qr = qrcode.qrcode(6, 'M');
      qr.addData(url);  // 解决中文乱码
      qr.make();
      const tag = qr.createImgTag(5, 10);  // 获取base64编码图片字符串
      const base64 = tag.match(/src="([^"]*)"/)[1];  // 获取图片src数据
      // base64 = base64.replace(/^data:image\/\w+;base64,/, '');  // 获取base64编码
      // base64 = new Buffer(base64, 'base64');  // 新建base64图片缓存
      const publicQRcodeUrl = base64;
      this.setState({
        publicQRcodeUrl,
      });
    }
  }
  componentWillUnmount() {
    document.removeEventListener('copy', this.handelCopy);
    this.setState({
      publicQRcodeUrl: '',
    })
  }
  handleCopyClick() {
    document.execCommand('copy');
  }
  handelCopy = (ev) => {
    if (this.props.visible) {
      ev.preventDefault();
      ev.clipboardData.setData('text/plain', this.props.url || '');
      message.success('复制成功', 3);
    }
  }
  render() {
    const { visible, url } = this.props;
    return (
        <Modal
          width={700}
          title="推广"
          visible={this.props.visible}
          footer={null}
          onCancel={() => this.props.onCancel()}
        >
          <div style={{ padding: '0 0 20px' }}>
            <div>
              <p style={{ fontSize: 12, textAlign: 'center' }}>
                用手机淘宝扫描二维码或复制下面的链接，推广您发布的内容
              </p>
            </div>
            <div className={styles.QRcodePic}>
              <img src={this.state.publicQRcodeUrl} alt="二维码加载中..." />
            </div>
            <Row gutter={16}>
              <Col span={20}>
                <Input
                  value={url || ''}
                  disabled={true}
                  id="box"
                />
              </Col>
              <Col span={4}>
                <Button type="primary" onClick={this.handleCopyClick}>复制</Button>
              </Col>
            </Row>
          </div>
        </Modal>
    );
  }
}
