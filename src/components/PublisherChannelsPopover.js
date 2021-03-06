import React, { PureComponent } from 'react';
import { Popover, Tag } from 'antd';
import { COLORS } from '../constants';

export default class PublisherChannelsPopover extends PureComponent {
  render() {
    const { channel_list } = this.props;
    const list = [];
    channel_list.forEach(item => {
      item.activityList.find(item1 => {
        if (item1.remainCount && item1.remainCount > 0)
          list.push({...item1, text: `${item.name} / ${item1.name}`});
      });
    });
    return (
      <Popover
        placement="left"
        title="可发渠道"
        content={
          <div style={{ width: 250 }}>
            {list.map((item, index) => <div key={index} style={{ margin: '5px 0 5px' }}><Tag color={COLORS[index]}>{item.text}：{item.remainCount}篇</Tag></div>)}
            <strong>注：除【微淘】外，其他渠道需要去阿里创作平台申请</strong>
          </div>}
      >
      {this.props.children}</Popover>
    );
  }
}