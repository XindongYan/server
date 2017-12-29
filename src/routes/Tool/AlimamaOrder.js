import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Tabs, Modal, message, Button, Icon } from 'antd';
import { Link } from 'dva/router';
import AlimamaOrderList from './AlimamaOrderList';
import AlimamaShopList from './AlimamaShopList';
import styles from './AlimamaOrder.less';
const TabPane = Tabs.TabPane;

@connect(state => ({

}))

export default class AlimamaOrder extends PureComponent {
  state = {
    nicaiCrx: null,
    visible: false,
    version: '',
  }
  componentDidMount() {
    setTimeout(() => {
      if(!this.state.version){
        message.destroy();
        message.warn('请安装尼采创作平台插件！');
      }
    }, 3000);
    const nicaiCrx = document.getElementById('nicaiCrx');
    nicaiCrx.addEventListener('setAlimamaInfo', this.setAlimamaInfo);
    nicaiCrx.addEventListener('setVersion', this.setVersion);
    if (!this.state.nicaiCrx) {
      this.setState({ nicaiCrx }, () => {
        setTimeout(() => {
          this.handleGetVersion();
        }, 400);
      });
    }
  }
  componentWillUnmount() {
    this.setState({
      visible: false
    })
    const nicaiCrx = document.getElementById('nicaiCrx');
    nicaiCrx.removeEventListener('setAlimamaInfo', this.setAlimamaInfo);
    nicaiCrx.removeEventListener('setVersion', this.setVersion);

  }

  handleGetVersion = () => {
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getVersion', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  getAlimamaInfo = () => {
    this.state.nicaiCrx.innerText = '';
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getAlimamaInfo', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  setAlimamaInfo = (e) => {
    const data = JSON.parse(e.target.innerText);
    if (data.error) {
      this.setState({
        visible: true
      })
    }
  }
  setVersion = (e) => {
    const data = JSON.parse(e.target.innerText);
    if (data !== '1.0.4') {
      message.warn('插件版本较低，请更新！');
    }
    this.setState({
      version: data,
    })
    this.getAlimamaInfo();
  }
  handleOk = () => {
    this.setState({
      visible: false
    })
    window.open('http://pub.alimama.com/myunion.htm?spm=a219t.7900221/1.1998910419.db9f5f632.6cc0f2fbJH3A8I#!/report/detail/taoke');
    Modal.confirm({
      title: '是否已成功登陆阿里妈妈网站',
      okText: '是的',
      onOk: () => {
        this.getAlimamaInfo();
      },
      onCancel: () => {
        this.getAlimamaInfo();
      },
    });
  }
  render() {
    return (
      <div style={{ position: 'relative' }}>
        <Card id="alimama" bordered={false} bodyStyle={{ padding: 14 }}>
          <Tabs
            defaultActiveKey="1"
          >
            <TabPane tab="店铺" key="1">
              <AlimamaShopList />
            </TabPane>
            <TabPane tab="商品" key="2">
              <AlimamaOrderList />
            </TabPane>
          </Tabs>
        </Card>
        <Modal
          title={
            <span>
              <Icon type="warning" style={{ fontSize: 24, color: '#faad14', marginRight: 10 }} />
              阿里妈妈未登录
            </span>
          }
          closable={false}
          visible={this.state.visible}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleOk}>
              去登陆
            </Button>
          ]}
          getContainer={() => {return document.getElementById('alimama')}}
          bodyStyle={{ border: 'none' }}
          style={{ position: 'absolute', top: 200, right: 0, left: 0 }}
          maskStyle={{ position: 'absolute' }}
          wrapClassName={styles.modalOuterBox}
        >
          <p style={{ fontSize: 16, height: 40, lineHeight: '40px' }}>
            <span>当前页面功能需要先登录阿里妈妈网站</span>
          </p>
          <p>点击确定去登录</p>
        </Modal>
      </div>
    );
  }
}