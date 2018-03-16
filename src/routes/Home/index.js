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
        <div>
          尼采插件：
          <a href="/nicai.crx" download="尼采插件.crx">
            点击下载
          </a>
          (要求:运行插件的chrome浏览器版本必须 > 59.0)
        </div>
        <div style={{ marginTop: 10 }}>
          <p><a href="/nicaiTeach.pdf" target="_blank">点击查看插件安装步骤</a></p>
          <p><a href="/chromeVersion.pdf" target="_blank">chrome浏览器版本号查询步骤</a></p>
          <p><a href="http://v.youku.com/v_show/id_XMzQ1MjcwMjczMg==.html?spm=a2hzp.8253869.0.0" target="_blank">《网站使用流程演示视频》</a></p>
        </div>
      </Card>
    );
  }
}
