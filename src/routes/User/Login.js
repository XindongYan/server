import React, { Component } from 'react';
import { Icon } from 'antd';
import styles from './Login.less';
import { ORIGIN } from '../../constants';
import querystring from 'querystring';

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
          <a href={`https://oauth.taobao.com/authorize?client_id=23670142&response_type=code&redirect_uri=${ORIGIN}/api/taobao/auth&state=${encodeURIComponent(querystring.stringify(state))}&view=web`}>
            <Icon type="taobao-circle"  className={styles.iconTaobao}/>
          </a>
        </div>
        <div style={{ width: 300, textAlign: 'left', margin: '60px auto 10px' }}>
          <a href="/nicai.crx" download="尼采插件.crx">
            尼采插件下载
          </a>
          <span>(chrome浏览器版本 > 59.0)</span>
          <p>
            <a style={{ marginRight: 15 }} href="/userRegister.pdf" target="_blank">用户注册说明</a>
          </p>
          <p>
            <a style={{ marginRight: 15 }} href="http://v.youku.com/v_show/id_XMzQ1Mjc2NzUyMA==.html?spm=a2hzp.8253869.0.0" target="_blank">《网站登录注册演示视频》</a>
          </p>
        </div>
        
      </div>
    );
  }
}
