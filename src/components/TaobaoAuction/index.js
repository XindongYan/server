import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Modal, message, Icon, Button, Input } from 'antd';
import styles from './index.less';

@connect(state => ({

}))

  
export default class TaobaoAuction extends PureComponent {
  state = {
    nicaiCrx: null,
    version: '',
    search: '',
    images: [],
    data: null,
    url: '',
    choose: '',
  }
  componentDidMount() {
    
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      const nicaiCrx = document.getElementById('nicaiCrx');
      nicaiCrx.addEventListener('setVersion', this.setVersion);
      nicaiCrx.addEventListener('setAuction', this.setAuction);
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
      nicaiCrx.removeEventListener('setVersion', this.setVersion);
      nicaiCrx.removeEventListener('setAuction', this.setAuction);
    }
  }

  setVersion = (e) => {
    const data = JSON.parse(e.target.innerText);
    console.log(data);
    this.setState({
      version: data,
    })
  }
  setAuction = (e) => {
    const result = JSON.parse(e.target.innerText);
    console.log(result);
    if (result.error) {
      message.error(result.msg)
    } else {
      this.setState({
        data: result.data,
        images: result.data.images || [],
        url: result.data.item.itemUrl,
      })
    }
  }
  handleGetVersion = () => {
    this.state.nicaiCrx.innerText = '';
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getVersion', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  handleGetAuction = () => {
    this.setState({
      images: [],
      data: null,
      choose: '',
    })
    if (this.state.search) {
      this.state.nicaiCrx.innerText = JSON.stringify(this.state.search);
      const customEvent = document.createEvent('Event');
      customEvent.initEvent('getAuction', true, true);
      this.state.nicaiCrx.dispatchEvent(customEvent);
    } else {
      message.warn('请输入商品链接');
    }
  }
  handleChooseImg = (photo) => {
    this.setState({
      choose: photo,
    })
  }
  handleOk = () => {
    if (!this.state.data) {
      message.warn('请根据链接搜索商品');
    } else if (!this.state.choose) {
      message.warn('请选择商品主图');
    } else {
      if (this.props.onOk) this.props.onOk(this.state.url, this.state.choose);
      if (this.props.onCancel) this.props.onCancel();
    }
  }
  handleCancel = () => {
    // this.setState({
      // search: '',
    // })
    if (this.props.onCancel) this.props.onCancel();
  }
  render() {
    const { visible } = this.props;
    const { search, images, data } = this.state;
    return (
      <Modal
        title="添加宝贝"
        width="800px"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        bodyStyle={{ padding: '5px 20px' }}
      >
        <div style={{ padding: 10 }}>
          <Row>
            <Col span={20}>
              <Input
                value={search}
                onChange={(e) => {this.setState({ search: e.target.value })}}
              />
            </Col>
            <Col span={4}>
              <Button style={{ margin: '0 10px' }} onClick={this.handleGetAuction}>搜索商品</Button>
            </Col>
          </Row>
          { data &&
            <div style={{ margin: '10px 0' }}>
              <p>{data.title}</p>
              <p>价格：¥ {data.item.finalPrice}</p>
              <p>选择商品主图：</p>
            </div>
          }
          <div className={styles.showBox}>
            { images.map((item, index) => <div className={styles.imgBox} key={index} onClick={() => this.handleChooseImg(item)}>
                <img src={item} />
                { item === this.state.choose &&
                  <div className={styles.imgChoose}>
                    <Icon type="check" />
                  </div>
                }
              </div>)
            }
          </div>
        </div>
      </Modal>
    );
  }
}
