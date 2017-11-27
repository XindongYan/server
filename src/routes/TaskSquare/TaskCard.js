import React, { PureComponent } from 'react';
import { Card, Button, Dropdown, Menu, Modal, Col, Row, message } from 'antd';
import moment from 'moment';
import { TASK_APPROVE_STATUS } from '../../constants';
import styles from './index.less';
import TaskTitleColumn from '../../components/TaskTitleColumn';

export default class TaskCard extends PureComponent {
  state = {
   
  }
  
  render() {
    const { task, index } = this.props;
    const colorArr = ['#6a6aff','#2894ff','#00caca','#4f9d9d','#ffa042','#ffd306','#ff8040','#7373b9','#c07ab8','#a6a6d2'];
    return (
      <Col span={4} key={index} style={{padding: "5px"}}>
        <Card style={{ width: "100%" }} bodyStyle={{ padding: 0 }}>
          <div className={styles.customImage} style={{ background: colorArr[task.id%8] }}>
            <h3><TaskTitleColumn text={task.title} length={23}/></h3>
          </div>
          <div className={styles.customCard}>
            <p>商家标签:<TaskTitleColumn text={task.merchant_tag} length={16}/></p>
            <div className={styles.customBtn}>
              <Button size="small" type="primary"
              disabled={!(task.approve_status === TASK_APPROVE_STATUS.published)}
              onClick={() => this.props.onTake(task)}
              >抢单</Button>
            </div>
          </div>
        </Card>
      </Col>
    )
  }
}
