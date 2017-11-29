import React, { PureComponent } from 'react';
import { Tag } from 'antd';

export default class TaskStatusColumn extends PureComponent {
  render() {
    const { status } = this.props;
    // 审核状态： -3 创建 -2 发布 -1 接单 0 待审核 1 通过 2 未通过,
    if (status === -3) {
      return (<Tag>已创建</Tag>);
    } else if (status === -2) {
      return (<Tag color="green">已发布</Tag>);
    } else if (status === -1) {
      return (<Tag color="#2db7f5">已接单</Tag>);
    } else if (status === 0) {
      return (<Tag color="#108ee9">审核中</Tag>);
    } else if (status === 1) {
      return (<Tag color="#87d068">已通过</Tag>);
    } else if (status === 2) {
      return (<Tag color="#f50">未通过</Tag>);
    } else {
      return <span>{status}</span> ;
    }
  }
}