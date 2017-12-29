import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Tabs, Modal, message } from 'antd';
import { Link } from 'dva/router';
import AlimamaOrderList from './AlimamaOrderList';
import AlimamaShopList from './AlimamaShopList';
const TabPane = Tabs.TabPane;

@connect(state => ({

}))

export default class AlimamaOrder extends PureComponent {
  state = {
    nicaiCrx: null,
    visible: false,
  }
  componentDidMount() {
    const nicaiCrx = document.getElementById('nicaiCrx');
    nicaiCrx.addEventListener('setAlimamaInfo', this.setAlimamaInfo);
    if (!this.state.nicaiCrx) {
      this.setState({ nicaiCrx }, () => {
        setTimeout(() => {
          this.getAlimamaInfo();
        }, 400);
      });
    }
  }
  componentWillUnmount() {
    const nicaiCrx = document.getElementById('nicaiCrx');
    nicaiCrx.removeEventListener('setAlimamaInfo', this.setAlimamaInfo);
  }

  getAlimamaInfo = () => {
    this.state.nicaiCrx.innerText = '';
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getAlimamaInfo', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  setAlimamaInfo = (e) => {
    const data = JSON.parse(e.target.innerText);
    console.log(data);
    if (data.error) {
      const modal = Modal.warning({
        title: data.msg,
        content: '点击确定去登录',
        okText: '去登陆',
        onOk: () => {
          modal.destroy();
          window.open('http://pub.alimama.com/myunion.htm?spm=a219t.7900221/1.1998910419.db9f5f632.6cc0f2fbJH3A8I#!/report/detail/taoke');
          Modal.confirm({
            title: '是否已成功登陆阿里妈妈网站',
            okText: '是的',
            onOk: () => {
              location.reload();
            },
            onCancel: () => {
              this.getAlimamaInfo();
            },
          });
        },
      });
    }
  }
  render() {
    return (
      <div>
        <Card bordered={false} bodyStyle={{ padding: 14 }}>
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
          title="Modal"
          visible={this.state.visible}
          onOk={this.hideModal}
          onCancel={this.hideModal}
          okText="是的"
          cancelText="没有"
        >
          <p>Bla bla ...</p>
        </Modal>
      </div>
    );
  }
}