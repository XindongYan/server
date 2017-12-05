import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import querystring from 'querystring';
import { Card, Button, Popconfirm, message } from 'antd';
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
      <Card bordered={false} title="" style={{ background: 'none' }} bodyStyle={{ padding: 0 }}>
        
      </Card>
    );
  }
}
