import React, { PureComponent } from 'react';
import { Badge } from 'antd';
import { SOURCE } from '../constants';

export default class TaskSourceColumn extends PureComponent {
  render() {
    const { source, text } = this.props;
    if (source === SOURCE.task) {
      return (<Badge status="processing" text={text || "赏金任务"} />);
    } else if (source === SOURCE.deliver) {
      return (<Badge status="warning" text={text || "投稿"} />);
    } else if (source === SOURCE.create) {
      return (<Badge status="success" text={text || "我的"} />);
    } else if (source === SOURCE.pass) {
      return (<Badge status="error" text={text || "转交"} />);
    } else {
      return <span>{source}</span> ;
    }
  }
}