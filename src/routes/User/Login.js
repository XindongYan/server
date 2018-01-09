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
          <div style={{ marginBottom: 20 }} className={styles.desc}>使用淘宝授权登录</div>
          <a href={`https://oauth.taobao.com/authorize?client_id=23670142&response_type=code&redirect_uri=${ORIGIN}/api/taobao/auth&state=login&view=web`}>
            <Icon type="taobao-circle"  className={styles.iconTaobao}/>
          </a>
        </div>
        <div style={{ marginTop: 45 }}>
          <a href={`${ORIGIN}/nicaiCrx_v1.0.4.crx`} download="尼采插件_v1.0.4.crx">
            尼采插件下载
          </a>
          <span>(chrome浏览器版本 >= 59.0)</span>
        </div>
        <p style={{ marginTop: 5 }}>
          <a style={{ marginRight: 15 }} href={`${ORIGIN}/nicaiTeach.pdf`} target="_blank">#插件安装步骤#</a>
          <a href={`${ORIGIN}/chromeVersion.pdf`} target="_blank">#chrome浏览器版本号#</a>
        </p>
      </div>
    );
  }
}
