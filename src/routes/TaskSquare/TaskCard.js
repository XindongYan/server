import React, { PureComponent } from 'react';
import { Card, Button, Col, Tag } from 'antd';
import moment from 'moment';
import { TASK_APPROVE_STATUS } from '../../constants';
import styles from './index.less';
import TaskNameColumn from '../../components/TaskNameColumn';

export default class TaskCard extends PureComponent {
  state = {
   
  }

  render() {
    const { task, index } = this.props;
    const colorArr = ['#6a6aff','#2894ff','#00caca','#4f9d9d','#ffa042','#ffd306','#ff8040','#7373b9','#c07ab8','#a6a6d2'];
    return (
      <Col span={6} key={index} style={{padding: "5px"}}>
        <Card style={{ width: "100%" }} bodyStyle={{ padding: 0 }}>
          <div className={styles.customImage} style={{ background: colorArr[ task.id % 8 ] }}>
            <h3><TaskNameColumn text={task.name} length={23}/></h3>
          </div>
          <div className={styles.customCard}>
            <Tag color="blue">{task.id}</Tag>
            <p className={styles.descBox}>{task.desc || '无描述'}</p>
            <div className={styles.customBtn} style={{ margin: 0, padding: 5 }}>
              { task.price ? 
                <span className={styles.cardMsgPrice}>
                    <Icon style={{ fontSize: 16 }} type="pay-circle" />
                    <span style={{ padding: '0 6px' }}>{ task.price }</span>
                </span> :
                <span></span>
              }
              <Button size="small" type="primary"
              disabled={!(task.approve_status === TASK_APPROVE_STATUS.published)}
              onClick={() => this.props.onTake(task)}
              >抢单</Button>
            </div>
            <ul className={styles.filesBox}>
              { task.attachments && task.attachments.length > 0 ?
                task.attachments.map((item,index) => <li key={index}><a href={item.url}>{item.name}</a></li>)
                : <li></li>
              }
            </ul>
          </div>
        </Card>
      </Col>
    )
  }
}
