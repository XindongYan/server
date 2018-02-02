import React, { PureComponent } from 'react';
import { Tag } from 'antd';
import styles from './index.less';

export default class TaskStatusColumn extends PureComponent {
  render() {
    const { status } = this.props;
    if (status === -3) {
      return '已创建';
    } else if (status === -2) {
      return (<Tag className={styles['ant-tag']} color="#C1C1C1">已上架</Tag>);
    } else if (status === -1) {
      return (<Tag className={styles['ant-tag']} color="#FFC125">已接单</Tag>);
    } else if (status === 0) {
      return (<Tag className={styles['ant-tag']} color="#108ee9">待审核</Tag>);
    } else if (status === 1) {
      return (<Tag className={styles['ant-tag']} color="#87d068">已通过</Tag>);
    } else if (status === 2) {
      return (<Tag className={styles['ant-tag']} color="#f50">未通过</Tag>);
    } else if (status === 3) {
      return (<Tag className={styles['ant-tag']} color="#FFA500">待发布</Tag>);
    } else if (status === 4) {
      return (<Tag className={styles['ant-tag']} color="#108ee9">已发布</Tag>);
    } else if (status === 5) {
      return (<Tag className={styles['ant-tag']} color="#87d068">淘宝通过</Tag>);
    } else if (status === 6) {
      return (<Tag className={styles['ant-tag']} color="#f50">淘宝不通过</Tag>);
    } else {
      return <span>{status}</span> ;
    }
  }
}
