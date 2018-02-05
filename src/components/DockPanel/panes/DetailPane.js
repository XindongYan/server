import React, { PureComponent } from 'react';
import { Card, Row, Col } from 'antd';
import moment from 'moment';

export default class DetailPane extends PureComponent {
  state = {
  }
  render() {
    const { task } = this.props;
    const rowStyle = {
      'height': '40px',
      'lineHeight': '40px',
    };
    const labelStyle = { textAlign: 'right' };
    return (
      <Card bordered={false} style={{ padding: '0 0 40px' }}>
          <Row gutter={2} style={rowStyle}>
            <Col span={2} style={labelStyle}>
              任务标题：
            </Col>
            <Col span={22}>
              <div>{task.name || '无'}</div>
            </Col>
          </Row>
          <Row gutter={2} style={rowStyle}>
            <Col span={2} style={labelStyle}>
              商家标签：
            </Col>
            <Col span={22}>
              <div>{task.merchant_tag || '无'}</div>
            </Col>
          </Row>
          <Row gutter={2} style={rowStyle}>
            <Col span={2} style={labelStyle}>
              渠道：
            </Col>
            <Col span={22}>
              <div>{task.channel_name || '无'}</div>
            </Col>
          </Row>
          <Row gutter={2} style={rowStyle}>
            <Col span={2} style={labelStyle}>
              任务描述：
            </Col>
            <Col span={22}>
              <div style={{ wordWrap: 'break-word' }}>{task.desc || '无'}</div>
            </Col>
          </Row>
          <Row gutter={2} style={rowStyle}>
            <Col span={2} style={labelStyle}>
              附 件：
            </Col>
            <Col span={22}>
              { task.attachments && task.attachments.length > 0 ?
                task.attachments.map(item => <a target="_blank" href={item.url}>{item.name}</a>)
                : <span>无</span>
              }
            </Col>
          </Row>
          <Row gutter={2} style={rowStyle}>
            <Col span={2} style={labelStyle}>
              创建时间：
            </Col>
            <Col span={22}>
              <div>{moment(task.create_time).format('YYYY-MM-DD HH:mm')}</div>
            </Col>
          </Row>
          <Row gutter={2} style={rowStyle}>
            <Col span={2} style={labelStyle}>
              活动酬劳：
            </Col>
            <Col span={22}>
              <div>{`￥${task.price}`}</div>
            </Col>
          </Row>
      </Card>
    );
  }
}
