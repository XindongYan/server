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
          <div className={styles.customImage} style={{ background: "#d95940" }}>
            <Link to={`/project/task/view?_id=${task._id}`}>
              <h3><TaskNameColumn text={task.name} length={23}/></h3>
            </Link>
          </div>
          <div className={styles.customCard}>
             <Tooltip title="任务ID">
              <Tag color="blue">{task.id}</Tag>
            </Tooltip>
            <p className={styles.descBox}>{task.desc || '无描述'}</p>
            <p>
              <a href="javascript:;" onClick={() => {this.setState({ fileVisible: true })}}>
                
              </a>
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
