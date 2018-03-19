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
    const labelSpan = {md: 4, sm: 12, xs: 12};
    const valueSpan = {md: 20, sm: 12, xs: 12};
    return (
      <Card bordered={false} style={{ padding: '0 0 40px' }}>
          <Row gutter={2} style={rowStyle}>
            <Col {...labelSpan} style={labelStyle}>
              任务名称：
            </Col>
            <Col {...valueSpan}>
              <div>{task.name || '无'}</div>
            </Col>
          </Row>
          <Row gutter={2} style={rowStyle}>
            <Col {...labelSpan} style={labelStyle}>
              任务描述：
            </Col>
            <Col {...valueSpan}>
              <div style={{ wordWrap: 'break-word' }}>{task.desc || '无'}</div>
            </Col>
          </Row>
          <Row gutter={2} style={rowStyle}>
            <Col {...labelSpan} style={labelStyle}>
              渠道：
            </Col>
            <Col {...valueSpan}>
              <div>{task.channel_name || '无'}</div>
            </Col>
          </Row>
          <Row gutter={2} style={rowStyle}>
            <Col {...labelSpan} style={labelStyle}>
              商家名称：
            </Col>
            <Col {...valueSpan}>
              <div>{task.merchant_tag || '无'}</div>
            </Col>
          </Row>
          <Row gutter={2} style={rowStyle}>
            <Col {...labelSpan} style={labelStyle}>
              附件：
            </Col>
            <Col {...valueSpan}>
              { task.attachments && task.attachments.length > 0 ?
                task.attachments.map(item => <a target="_blank" href={item.url}>{item.name}</a>)
                : <span>无</span>
              }
            </Col>
          </Row>
          <Row gutter={2} style={rowStyle}>
            <Col {...labelSpan} style={labelStyle}>
              活动酬劳：
            </Col>
            <Col {...valueSpan}>
              <div>{`￥${task.price}`}</div>
            </Col>
          </Row>
          <Row gutter={2} style={rowStyle}>
            <Col {...labelSpan} style={labelStyle}>
              创建时间：
            </Col>
            <Col {...valueSpan}>
              <div>{moment(task.create_time).format('YYYY-MM-DD HH:mm')}</div>
            </Col>
          </Row>
      </Card>
    );
  }
}
