import React, { PureComponent } from 'react';
import { Tooltip } from 'antd';
import { SOURCE } from '../constants';

export default class TaskIdColumn extends PureComponent {
  render() {
    const { source, text } = this.props;
    const dotStyle = {
      width: 6,
      height: 6,
      display: 'inline-block',
      borderRadius: '50%',
      verticalAlign: 'middle',
      position: 'relative',
      top: -1,
      marginRight: 8,
    };
    if (source === SOURCE.take) {
      return (<span><Tooltip placement="left" title="你接的任务(赏金任务)"><span style={{ ...dotStyle, backgroundColor: '#00b395' }} /></Tooltip>{text}</span>);
    } else if (source === SOURCE.deliver) {
      return (<span><Tooltip placement="left" title="你申请的投稿类型的稿子"><span style={{ ...dotStyle, backgroundColor: '#1C86EE' }} /></Tooltip>{text}</span>);
    } else if (source === SOURCE.create) {
      return (<span><Tooltip placement="left" title="你创建的稿子"><span style={{ ...dotStyle, backgroundColor: '#EE2C2C' }} /></Tooltip>{text}</span>);
    } else if (source === SOURCE.pass) {
      return (<span><Tooltip placement="left" title="由其它人转交给你的稿子"><span style={{ ...dotStyle, backgroundColor: '#9B30FF' }} /></Tooltip>{text}</span>);
    } else if (source === SOURCE.specify) {
      return (<span><Tooltip placement="left" title="由其它人指定给你的稿子"><span style={{ ...dotStyle, backgroundColor: '#FFD700' }} /></Tooltip>{text}</span>);
    } else {
      return text;
    }
  }
}