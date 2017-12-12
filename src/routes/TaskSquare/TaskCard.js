import React, { PureComponent } from 'react';
import { Card, Button, Col, Tag, Menu, Dropdown, Icon, Tooltip } from 'antd';
import moment from 'moment';
import { Link } from 'dva/router';
import { TASK_APPROVE_STATUS } from '../../constants';
import styles from './index.less';
import TaskNameColumn from '../../components/TaskNameColumn';

export default class TaskCard extends PureComponent {
  state = {
    fileVisible: false,
  }

  render() {
    const { task, index } = this.props;
    const colorArr = ['#6a6aff','#2894ff','#00caca','#4f9d9d','#ffa042','#ffd306','#ff8040','#7373b9','#c07ab8','#a6a6d2'];
    const menu = (
      <Menu>
        { task.attachments.map((item,index) => 
          <Menu.Item key={item.uid}>
            <a style={{ color: '#40a9ff' }} target="_blank" href={item.url}>{item.name}</a>
          </Menu.Item>)
        }
      </Menu>
    );
    return (
      <Col span={6} key={index} style={{padding: "5px"}}>
        <Card style={{ width: "100%" }} bodyStyle={{ padding: 0 }} ref="taskCard">
          <Link to={`/project/task/view?_id=${task._id}`}>
            <div className={styles.customImage} style={{ background: colorArr[ task.id % 8 ] }}>
              <Tooltip title="任务标题">
                <h3><TaskNameColumn text={task.name} length={23}/></h3>
              </Tooltip>
            </div>
          </Link>
          <div className={styles.customCard}>
            <Tooltip title="任务ID">
              <Tag color="blue">{task.id}</Tag>
            </Tooltip>
            <p className={styles.descBox}>
              <Link to={`/project/task/view?_id=${task._id}`} style={{ color: '#444' }}>
                <Tooltip title="任务描述">{task.desc || ''}</Tooltip>
              </Link>
            </p>
            <div className={styles.customBtn} style={{ margin: 0, padding: 5 }}>
              <span className={styles.cardMsgPrice}>
                    <Icon style={{ fontSize: 16 }} type="pay-circle" />
                    <span style={{ padding: '0 6px' }}>{ task.price }</span>
                </span>
                <span></span>
              <Button size="small" type="primary"
              disabled={!(task.approve_status === TASK_APPROVE_STATUS.published)}
              onClick={() => this.props.onTake(task)}
              >抢单</Button>
            </div>
            { task.attachments && task.attachments.length > 0 ?
              <Dropdown overlay={menu} trigger={['click']}>
                <a style={{ display: 'block', height: 20 }} className="ant-dropdown-link" href="#">
                  查看附件<Icon type="down" />
                </a>
              </Dropdown> :
              <p style={{ height: 20 }}></p>
            }
          </div>
        </Card>
      </Col>
    )
  }
}
