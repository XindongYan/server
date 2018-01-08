import React from 'react';
import { Button } from 'antd';
import { Link } from 'dva/router';
import Result from '../../components/Result';
import styles from './RegisterResult.less';

const title = <div className={styles.title}>你的账户注册成功</div>;

const actions = (
  <div className={styles.actions}>
    <Link to="/"><Button size="large">去首页</Button></Link>
  </div>
);

export default () => (
  <Result
    className={styles.registerResult}
    type="success"
    title={title}
    description=""
    actions={actions}
    style={{ marginTop: 56 }}
  />
);
