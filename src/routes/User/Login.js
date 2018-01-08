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
        <a href={`https://oauth.taobao.com/authorize?client_id=23670142&response_type=code&redirect_uri=${ORIGIN}/api/taobao/auth&state=login&view=web`}>
          <Icon type="taobao-circle"  className={styles.iconTaobao}/>
          <div className={styles.desc}>使用淘宝授权登录</div>
        </a>
      </div>
    );
  }
}
