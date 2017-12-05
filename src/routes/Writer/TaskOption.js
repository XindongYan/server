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
    this.props.dispatch(routerRedux.push(`/writer/task/create?channel_name=${value}`));
  }
  render() {
    return (
      <Card bordered={false} style={{ background: '#fff',minHeight: 400, padding: 40 }} bodyStyle={{ padding: 0 }}>
        <Row gutter={20} style={{ width: 600, margin: 'auto' }}>
          { CHANNEL_NAMES.map(item => 
              <Col span={12} key={item}>
                <Card bordered={false} style={{ textAlign: 'center'}}>
                  <div className={styles.channelBox} onClick={() => this.handleDeliver(item)}>
                    <div className={styles.channelImgBox}>
                      <img src="http://oyufgm5i2.bkt.clouddn.com/rc-upload-1512457823676-4.png" />
                    </div>
                    <div className={styles.channelNameBox}>{item}</div>
                  </div>
                </Card>
              </Col>
            )}
        </Row>
      </Card>
    );
  }
}
