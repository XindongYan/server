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
    const state = {
      redirect_uri: `${location.origin}/index.html`,
      web_origin: location.origin,
    };
    return (
      <div className={styles.main}>
        <div>
          <div style={{ marginBottom: 20 }} className={styles.desc}>使用淘宝授权登录</div>
          <a href={`https://oauth.taobao.com/authorize?client_id=23670142&response_type=code&redirect_uri=${ORIGIN}/api/taobao/auth&state=${encodeURIComponent(JSON.stringify(state))}&view=web`}>
            <Icon type="taobao-circle"  className={styles.iconTaobao}/>
          </a>
        </div>
        <div style={{ width: 300, textAlign: 'left', margin: '60px auto 10px' }}>
          <a href={`${location.origin}/nicai.crx`} download="尼采插件.crx">
            尼采插件下载
          </a>
          <span>(chrome浏览器版本 >= 59.0)</span>
          <p>
            <a style={{ marginRight: 15 }} href={`${location.origin}/userRegister.pdf`} target="_blank">用户注册说明</a>
            <a style={{ marginRight: 15 }} href={`${location.origin}/nicaiTeach.pdf`} target="_blank">插件安装说明</a>
            <a href={`${location.origin}/chromeVersion.pdf`} target="_blank">查看浏览器版本</a>
          </p>
        </div>
        
      </div>
    );
  }
}
