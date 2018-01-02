import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import styles from './index.less';
import { ORIGIN } from '../../constants';

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
        尼采插件v1.0.4：
        <a href={`${ORIGIN}/nicaiCrx_v1.0.4.zip`} download="尼采插件_v1.0.4.zip">点击下载 (要求:运行插件的chrome浏览器版本必须 >= 59.0)</a>
      </Card>
    );
  }
}