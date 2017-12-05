import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import querystring from 'querystring';
import { Card, Button, Popconfirm, message, Row, Col } from 'antd';
// import $ from 'jquery';
import WeitaoForm from '../../components/Forms/WeitaoForm';
import TaskChat from '../../components/TaskChat';
import styles from './TableList.less';

@connect(state => ({

}))

export default class TaskOption extends PureComponent {
  state = {

  }
  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {

  }

  render() {
    return (
      <Card bordered={false} style={{ background: '#fff',minHeight: 400, padding: '40px' }} bodyStyle={{ padding: 0 }}>
        <Row gutter={20}>
          <Col span={12}>
            <Card bordered={false} style={{background: '#ccc'}}>Card content</Card>
          </Col>
          <Col span={12}>
            <Card bordered={false} style={{background: '#ccc'}}>Card content</Card>
          </Col>
        </Row>
      </Card>
    );
  }
}
