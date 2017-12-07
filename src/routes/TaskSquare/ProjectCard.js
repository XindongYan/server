import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Col, Row, Icon, Button, Tag } from 'antd';
import moment from 'moment';
import styles from './index.less';
import { routerRedux } from 'dva/router';

@connect(state => ({

}))

export default class ProjectCard extends PureComponent {
  state = {
   
  }

  componentDidMount() {
    
  }
  componentWillReceiveProps(nextProps) {
    
  }

  projectInto = (project) => {
    this.props.dispatch(routerRedux.push(`/taskSquare/task/list?project_id=${project._id}`));
  }
  render() {
    const { project } = this.props;
    const color = project.channel_name === '淘宝头条' ? 'orange' : 'blue';
    const borderColor = project.channel_name === '淘宝头条' ? 'orange' : '#7df';
    return (
      <Card className={styles.cardCol} style={{ marginBottom: 10, border: `1px solid ${borderColor}` }} bodyStyle={{ padding: 0 }}>
        <div className={styles.cardColTop}>
          <h3 title={project.name}>
            {project.name}
            <Tag color={color} style={{ marginLeft: 10 }}>{project.channel_name ? project.channel_name : '图文'}</Tag>
          </h3>
          <p title={project.merchant_tag}>{ project.merchant_tag}</p>
        </div>
        <div className={styles.cardColBottom}>
          <p className={styles.cardMsgDesc}>{ project.desc}</p>
          <div className={styles.draftMsgB}>
            { project.price !== 0 &&
              <span className={styles.cardMsgPrice}>
                  <Icon style={{ fontSize: 16 }} type="pay-circle" />
                  <span style={{ padding: '0 6px' }}>{ project.price }</span>
              </span>
            }
            { project.deadline &&
              <span className={styles.cardMsgDeadline}>截稿日期：{ moment(project.deadline).format('YYYY-MM-DD') }</span>
            }
            <Button style={{ float: 'right' }} onClick={() => this.projectInto(project)}>详情</Button>
          </div>
        </div>
      </Card>
    );
  }
}
