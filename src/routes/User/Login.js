import React, { Component } from 'react';
import { Icon } from 'antd';
import styles from './Login.less';
import { ORIGIN } from '../../constants';

export default class Login extends Component {
  state = {
  }

  componentWillReceiveProps(nextProps) {

  }

  componentWillUnmount() {

  }
  render() {
    return (
      <div className={styles.main}>
        <div>
          <a href={`https://oauth.taobao.com/authorize?client_id=23670142&response_type=code&redirect_uri=${ORIGIN}/api/taobao/auth&state=login&view=web`}>
            <div className={styles.desc}>使用淘宝授权登录</div>
            <Icon type="taobao-circle"  className={styles.iconTaobao}/>
          </a>
        </div>
        <div style={{ marginTop: 20 }}>
          <a href={`${ORIGIN}/nicaiCrx_v1.0.4.crx`} download="尼采插件_v1.0.4.crx">
            尼采插件点击下载
          </a>
          <p>(要求:运行插件的chrome浏览器版本必须 >= 59.0)</p>
        </div>
        <p style={{ marginTop: 5 }}>
          <a style={{ marginRight: 20 }} href={`${ORIGIN}/nicaiTeach.pdf`} target="_blank">#插件安装步骤#</a>
          <a href={`${ORIGIN}/chromeVersion.pdf`} target="_blank">#chrome浏览器版本号#</a>
        </p>
      </div>
    );
  }
}
