import React, { PureComponent } from 'react';
import { Tooltip } from 'antd';
import moment from 'moment';

export default class DateTimeColumn extends PureComponent {
  render() {
    const { value } = this.props;
    if (value) {
      return (
        <Tooltip placement="top" title={moment(value).format('YYYY-MM-DD HH:mm:ss')}>
          {moment(value).fromNow()}
        </Tooltip>
      )
    } else {
      return '';
    }
  }
}