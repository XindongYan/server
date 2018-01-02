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
  currentUser: state.user.currentUser,
}))

export default class AlimamaOrder extends PureComponent {
  state = {
    nicaiCrx: null,
    visible: false,
    version: '',
    alimamaUser: {
      memberid: null,
      mmNick: '',
    },
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
    if (this.props.currentUser._id && this.props.currentUser.alimama) {
      this.setState({ alimamaUser: this.props.currentUser.alimama[0] });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser._id && nextProps.currentUser.alimama) {
      this.setState({ alimamaUser: nextProps.currentUser.alimama[0] });
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
    } else {
      if (data.alimamaUser && data.alimamaUser.memberid) {
        this.setState({ alimamaUser: data.alimamaUser });
      }
    }
  }
  setVersion = (e) => {
    const data = JSON.parse(e.target.innerText);
    if (data && data.length > 0) {
      const arr = data.split('.');
      const versionNumber = Number(arr[0]) * 100 + Number(arr[1]) * 10 + Number(arr[2]);
      if (data < 104) { // 1.0.4
        message.warn('插件版本较低，请更新！');
      }
    }
    
    this.setState({
      version: data,
    })
    this.getAlimamaInfo();
  }
  handleOk = () => {
    const { currentUser } = this.props;
    currentUser
    this.setState({
      visible: false
    })
    window.open('http://pub.alimama.com/myunion.htm?spm=a219t.7900221/1.1998910419.db9f5f632.6cc0f2fbJH3A8I#!/report/detail/taoke');
    Modal.confirm({
      title: '是否已成功登陆阿里妈妈网站',
      okText: '是的',
      onOk: () => {
        this.getAlimamaInfo();
        this.props.dispatch({
          type: 'tool/fetchAlimamaShops',
          payload: { user_id: currentUser._id },
        });
      },
      onCancel: () => {
        this.getAlimamaInfo();
      },
    });
  }
  render() {
    return (
      <div>
        <Card bordered={false} bodyStyle={{ padding: 14 }}>
          <Tabs
            defaultActiveKey="1"
            tabBarExtraContent={`数据来源于：${this.state.alimamaUser.mmNick}`}
          >
            <TabPane tab="店铺" key="1">
              <AlimamaShopList memberid={this.state.alimamaUser.memberid}/>
            </TabPane>
            <TabPane tab="商品" key="2">
              <AlimamaOrderList memberid={this.state.alimamaUser.memberid}/>
            </TabPane>
          </Tabs>
          <div
            id="alimama"
            style={{ position: 'absolute', width: '100%', minHeight: '500px', top: 0, height: '100%', minHeight: '500px', display: this.state.visible ? 'block' : 'none' }}>
          </div>
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