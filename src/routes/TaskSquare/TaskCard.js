import React, { PureComponent } from 'react';
import { Card, Button, Dropdown, Menu, Modal, Col, Row, message } from 'antd';
import moment from 'moment';
import { TASK_APPROVE_STATUS } from '../../constants';
import styles from './index.less';

export default class TaskCard extends PureComponent {
  state = {
   
  }
  
  render() {
    const { task, index } = this.props;
    const colorArr = ['#6a6aff','#2894ff','#00ffff','#1afd9c','#ffa042','#ffd306','#ff8040','#cf9e9e','#c07ab8','#a6a6d2'];
    return (
      <Col span={4} key={index} style={{margin: "5px"}}>
        <Card style={{ width: "100%" }} bodyStyle={{ padding: 0 }}>
          <div className={styles.customImage} style={{ background: colorArr[task.id%8] }}>
          </div>
          <div className={styles.customCard}>
            <h3>{task.title}</h3>
            <p>商家标签:{task.desc}</p>
            <div className={styles.customBtn}>
              <Button size="small" type="primary"
              disabled={!(task.approve_status === TASK_APPROVE_STATUS.published)}
              onClick={() => this.props.onTake(task)}
              >抢单</Button>
            </div>
          </div>
        </Card>
      </Col>
    );
  }
}
