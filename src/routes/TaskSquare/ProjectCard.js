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
    let color = 'volcano';
    let borderColor = '#FF6A00';
    if (project.channel_name === '淘宝头条') {
      color = 'volcano';
      borderColor = '#FF6A00';
    } else if (project.channel_name === '微淘') {
      color = 'orange';
      borderColor = '#ffe58f';
    } else {
      color = 'blue';
      borderColor = '#6AF';
    }
    const cardStyle = {
      marginBottom: 10,
      border: `none`,
      borderLeft: `5px solid ${borderColor}`,
      borderRadius: '2px 6px 6px 2px'
    };
    return (
      <Card className={styles.cardCol} style={cardStyle} bodyStyle={{ padding: 0 }}>
        <div className={styles.cardColTop}>
          <h3 title={project.name}>
            {project.name}
          </h3>
          <div title={project.merchant_tag}>
            <Tag color="gold">{ project.id}</Tag>
            { project.channel_name &&
              <Tag color={color}>{ project.channel_name }</Tag>
            }
            <Tag color="cyan">{ project.merchant_tag}</Tag>
          </div>
        </div>
        <div className={styles.cardColBottom}>
          <p className={styles.cardMsgDesc}>{ project.desc}</p>
          <div className={styles.draftMsgB}>
            <span className={styles.cardMsgPrice}>
                <Icon style={{ fontSize: 16 }} type="pay-circle" />
                <span style={{ padding: '0 6px' }}>{ project.price }</span>
            </span>
            { project.deadline &&
              <span className={styles.cardMsgDeadline}>截稿日期：{ moment(project.deadline).format('YYYY-MM-DD') }</span>
            }
            <Button type="primary" ghost style={{ float: 'right' }} onClick={() => this.projectInto(project)}>详情</Button>
          </div>
        </div>
      </Card>
    );
  }
}
