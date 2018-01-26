import React, { PureComponent } from 'react';
import { Badge } from 'antd';
import { SOURCE } from '../constants';

export default class TaskIdColumn extends PureComponent {
  render() {
    const { source, text } = this.props;
    if (source === SOURCE.task) {
      return (<Badge status="processing" text={text} />);
    } else if (source === SOURCE.deliver) {
      return (<Badge status="warning" text={text} />);
    } else if (source === SOURCE.create) {
      return (<Badge status="success" text={text} />);
    } else if (source === SOURCE.pass) {
      return (<Badge status="error" text={text} />);
    } else {
      return <span>{source}</span> ;
    }
  }
}