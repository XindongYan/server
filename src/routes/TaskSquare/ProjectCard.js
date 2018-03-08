import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Col, Row, Icon, Button, Tag, Tooltip } from 'antd';
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
    window.scrollTo(0, 0);
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
    } else if (project.channel_name === '生活研究所') {
      borderColor = '#eb5f96';
      color = 'magenta';
    } else {
      color = 'blue';
      borderColor = '#6AF';
    }
    const cardStyle = {
      marginBottom: 15,
      border: `none`,
      borderLeft: `5px solid ${borderColor}`,
      borderRadius: 4,
    };
    return (
      <Card className={styles.cardCol} style={cardStyle} bodyStyle={{ padding: '0 30px 5px 10px' }}>
        <div className={styles.cardColTop}>
          <h3 title={project.name}>
            {project.name}
          </h3>
          <div style={{ marginTop: 8 }}>
            <Tooltip title="活动ID">
              <Tag color="green">{ project.id}</Tag>
            </Tooltip>
            <Tooltip title="发布渠道">
              { project.channel_name &&
                <Tag color={color}>{ project.channel_name }</Tag>
              }
            </Tooltip>
            {project.merchant_tag && <Tooltip title="商家标签">
              <Tag color="cyan">{project.merchant_tag}</Tag>
            </Tooltip>}
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
