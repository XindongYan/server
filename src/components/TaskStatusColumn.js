import React, { PureComponent } from 'react';
import { Tag } from 'antd';

export default class TaskStatusColumn extends PureComponent {
  render() {
    const { status } = this.props;
    if (status === -3) {
      return '已创建';
    } else if (status === -2) {
      return (<Tag color="#FFF5EE">已上架</Tag>);
    } else if (status === -1) {
      return (<Tag color="#FFC125">已接单</Tag>);
    } else if (status === 0) {
      return (<Tag color="#108ee9">待审核</Tag>);
    } else if (status === 1) {
      return (<Tag color="#87d068">已通过</Tag>);
    } else if (status === 2) {
      return (<Tag color="#f50">未通过</Tag>);
    } else if (status === 3) {
      return (<Tag color="#FFD700">待发布</Tag>);
    } else if (status === 4) {
      return (<Tag color="#108ee9">已发布</Tag>);
    } else if (status === 5) {
      return (<Tag color="#87d068">淘宝通过</Tag>);
    } else if (status === 6) {
      return (<Tag color="#f50">淘宝不通过</Tag>);
    } else {
      return <span>{status}</span> ;
    }
  }
}