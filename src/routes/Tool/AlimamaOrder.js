import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import querystring from 'querystring';
import { Table, Card, Button, Tabs, Modal, message } from 'antd';
import { Link } from 'dva/router';
import AlimamaOrderList from './AlimamaOrderList';
import AlimamaShopOrderList from './AlimamaShopOrderList';
const TabPane = Tabs.TabPane;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({

}))

export default class AlimamaOrder extends PureComponent {
  state = {
  }
  componentDidMount() {

    Modal.confirm({
      title: '更新数据需要登录阿里妈妈',
      content: '点击确定去登录',
      onOk() {
        window.open('http://pub.alimama.com/myunion.htm?spm=a219t.7900221/1.1998910419.db9f5f632.6cc0f2fbJH3A8I#!/report/detail/taoke');
      },
      onCancel() {
        
      },
    });
  }

  render() {
    return (
      <div>
        <Card bordered={false} bodyStyle={{ padding: 14 }}>
          <Tabs
            defaultActiveKey="1"
          >
            <TabPane tab="店铺" key="1">
              <AlimamaShopOrderList />
            </TabPane>
            <TabPane tab="商品" key="2">
              <AlimamaOrderList />
            </TabPane>
          </Tabs>
        </Card>
      </div>
    );
  }
}