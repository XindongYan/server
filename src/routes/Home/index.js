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
        <div>
          尼采插件：
          <a href={`${ORIGIN}/nicai.crx`} download="尼采插件.crx">
            点击下载
          </a>
          (要求:运行插件的chrome浏览器版本必须 >= 59.0)
        </div>
        <div>
          尼采插件(内部版)：
          <a href={`${ORIGIN}/test.nicai.zip`} download="尼采插件测试版.zip">
           点击下载
          </a>
          (非工作人员请勿下载)
        </div>
        <div style={{ marginTop: 10 }}>
          <p><a href={`${ORIGIN}/nicaiTeach.pdf`} target="_blank">点击查看插件安装步骤</a></p>
          <p><a href={`${ORIGIN}/chromeVersion.pdf`} target="_blank">chrome浏览器版本号查询步骤</a></p>
        </div>
      </Card>
    );
  }
}
