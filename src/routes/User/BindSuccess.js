import React from 'react';
import { Button, Icon, Card } from 'antd';
import { Link } from 'dva/router';
import Result from '../../components/Result';

const actions = <Link to="/">返回首页</Link>;

export default () => (
  <Result
    type="success"
    title="绑定成功"
    description="您已成功绑定淘宝账号"
    actions={actions}
    style={{ marginTop: 48, marginBottom: 16 }}
  />
);
