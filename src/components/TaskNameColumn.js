import React, { PureComponent } from 'react';
import { Tooltip } from 'antd';
import { Link } from 'dva/router';

export default class TaskNameColumn extends PureComponent {
  render() {
    const { length = 13, text } = this.props;
    if (text && text.length > length) {
      const spanText = `${text.substring(0, length)}...`;
      return (
        <Tooltip title={text}>
          <span>{spanText}</span>
        </Tooltip>
      );
    } else {
      return <span>{text || ''}</span>;
    }
  }
}