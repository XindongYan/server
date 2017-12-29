import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import styles from './index.less';

@connect(state => ({

}))

export default class Home extends PureComponent {
  state = {

  }

  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {
    
  }

  render() {
    return (
      <Card bordered={false} bodyStyle={{ padding: '50px 100px' }}>
        下载插件：
        <a href="http://oyufgm5i2.bkt.clouddn.com/rc-upload-1514542531793-6.zip" target="_blank">点击下载</a>
      </Card>
    );
  }
}
