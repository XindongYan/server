import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import querystring from 'querystring';
import { Card, Button, Popconfirm, message, Row, Col } from 'antd';
import { CHANNEL_NAMES } from '../../constants';
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
  handleDeliver = (value) => {
    const task_type = value === '直播脚本' ? 3 : 1;
    this.props.dispatch(routerRedux.push(`/writer/task/create?channel_name=${value}&task_type=${task_type}`));
  }
  render() {
    const cardList = [ ...CHANNEL_NAMES, '直播脚本'];
    return (
      <Card bordered={false} style={{ background: '#fff',minHeight: 400, padding: '100px 40px 0' }} bodyStyle={{ padding: 0 }}>
        <Row gutter={20} style={{ width: 600, margin: 'auto' }}>
          { cardList.map((item, index) => 
            <Col span={6} key={index}>
              <Card bordered={false} style={{ textAlign: 'center'}}>
                <div className={styles.channelBox} onClick={() => this.handleDeliver(item)}>
                  <div className={styles.channelImgBox}>
                    <img src="http://oyufgm5i2.bkt.clouddn.com/rc-upload-1512457823676-4.png" />
                  </div>
                  <div className={styles.channelNameBox}>{item}</div>
                </div>
              </Card>
            </Col>)
          }
        </Row>
      </Card>
    );
  }
}
