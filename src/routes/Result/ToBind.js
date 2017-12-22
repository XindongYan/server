import React from 'react';
import { Button, Icon, Card } from 'antd';
import { Link } from 'dva/router';
import Result from '../../components/Result';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { ORIGIN } from '../../constants';
import querystring from 'querystring';

const redirectUrl = `https://oauth.taobao.com/authorize?client_id=23670142&response_type=code&redirect_uri=${ORIGIN}/api/taobao/auth&state=bind&view=web`;
const extra = (
  <div>
    <div style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.85)', fontWeight: '500', marginBottom: 16 }}>
      您还可以：
    </div>
    <div style={{ marginBottom: 16 }}>
      <Icon style={{ color: '#f5222d', marginRight: 8 }} type="close-circle-o" />未注册尼采创作平台账户
      <Link style={{ marginLeft: 16 }} to="/user/register">立即注册 <Icon type="right" /></Link>
    </div>
    <div>
      <Icon style={{ color: '#f5222d', marginRight: 8 }} type="close-circle-o" />已注册尼采创作平台账户
      <Link style={{ marginLeft: 16 }}
      to={`/user/login?${querystring.stringify({redirectUrl})}`}>
      立即登录绑定 <Icon type="right" /></Link>
    </div>
  </div>
);

const actions = <span />;

export default () => (
  <Result
    type="warning"
    title="未绑定"
    description="您的淘宝账号未与尼采创作平台账号绑定"
    extra={extra}
    actions={actions}
    style={{ marginTop: 48, marginBottom: 16 }}
  />
);
