import React, { PureComponent } from 'react';
import { Tooltip } from 'antd';
import { Link } from 'dva/router';

export default class TaskTitleColumn extends PureComponent {
  render() {
    const { length = 13, text } = this.props;
    const publicUrl = 'http://120.27.215.205/';
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