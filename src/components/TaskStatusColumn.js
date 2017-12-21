import React, { PureComponent } from 'react';
import { Badge } from 'antd';

export default class TaskStatusColumn extends PureComponent {
  render() {
    const { status } = this.props;
    if (status === -3) {
      return '已创建';
    } else if (status === -2) {
      return (<Badge status="default" text="已发布" />);
    } else if (status === -1) {
      return (<Badge status="warning" text="已接单" />);
    } else if (status === 0) {
      return (<Badge status="processing" text="待审核" />);
    } else if (status === 1) {
      return (<Badge status="success" text="已通过" />);
    } else if (status === 2) {
      return (<Badge status="error" text="未通过" />);
    } else if (status === 3) {
      return (<Badge status="success" text="待发布到淘宝" />);
    } else if (status === 4) {
      return (<Badge status="processing" text="已发布到淘宝" />);
    } else if (status === 5) {
      return (<Badge status="success" text="淘宝通过" />);
    } else if (status === 6) {
      return (<Badge status="error" text="淘宝不通过" />);
    } else {
      return <span>{status}</span> ;
    }
  }
}