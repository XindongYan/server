import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Modal, message, Icon, Button, Tag, Collapse } from 'antd';
import moment from 'moment';
import path from 'path';
import styles from './index.less';

const Panel = Collapse.Panel;
@connect(state => ({

}))

  
export default class TaskDetail extends PureComponent {
  state = {
    fileBox: false,
  }
  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {

  }

  fileBoxVisible = () => {
    this.setState({
      fileBox: !(this.state.fileBox)
    })
  }
  render() {
    return (
      <Card title="任务详情" bordered={false} bodyStyle={{paddingBottom: 10 }} style={{ marginBottom: 10 }}>
        
      </Card>
    );
  }
}
