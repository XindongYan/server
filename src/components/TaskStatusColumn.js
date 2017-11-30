import React, { PureComponent } from 'react';
import { Badge } from 'antd';

export default class TaskStatusColumn extends PureComponent {
  render() {
    const { status } = this.props;
    // 审核状态： -3 创建 -2 发布 -1 接单 0 待审核 1 通过 2 未通过,
    if (status === -3) {
      return '已创建';
    } else if (status === -2) {
      return (<Badge status="default" text="已发布" />);
    } else if (status === -1) {
      return (<Badge status="warning" text="已接单" />);
    } else if (status === 0) {
      return (<Badge status="processing" text="审核中" />);
    } else if (status === 1) {
      return (<Badge status="success" text="已通过" />);
    } else if (status === 2) {
      return (<Badge status="error" text="未通过" />);
    } else {
      return <span>{status}</span> ;
    }
  }
}