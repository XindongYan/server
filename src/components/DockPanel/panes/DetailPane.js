import React, { PureComponent } from 'react';
import { Card, Row, Col } from 'antd';

export default class DetailPane extends PureComponent {
  state = {
  }
  render() {
    const { task } = this.props;
    const labelStyle = {
      'height': '40px',
      'lineHeight': '40px',
    };
    return (
      <Card bordered={false} style={{ padding: '0 0 40px' }}>
          <Row gutter={24} style={labelStyle}>
            <Col span={6}>
              任务标题：
            </Col>
            <Col span={18}>
              <div>{task.name || '无'}</div>
            </Col>
          </Row>
          <Row gutter={24} style={labelStyle}>
            <Col span={6}>
              任务描述：
            </Col>
            <Col span={18}>
              <div style={{ wordWrap: 'break-word' }}>{task.desc || '无'}</div>
            </Col>
          </Row>
          <Row gutter={24} style={labelStyle}>
            <Col span={6}>
              附 件：
            </Col>
            <Col span={18}>
              { task.attachments && task.attachments.length > 0 ?
                task.attachments.map(item => <a target="_blank" href={item.url}>{item.name}</a>)
                : <span>无</span>
              }
            </Col>
          </Row>
      </Card>
    );
  }
}
