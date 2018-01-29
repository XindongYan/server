import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Col, Row, Icon, Button, message, Tag, Tooltip } from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';
import styles from './index.less';
import { routerRedux } from 'dva/router';

@connect(state => ({
  currentUser: state.user.currentUser,
}))

export default class SubmissionCard extends PureComponent {
  state = {
   
  }

  componentDidMount() {
    
  }
  componentWillReceiveProps(nextProps) {
    
  }

  handleDeliver = (project) => {
    const { dispatch, currentUser } = this.props;
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
          <Link to={`/taskSquare/submission/details?project_id=${project._id}`}>
            <h3 title={project.name} style={{ cursor: 'pointer' }}>
              {project.name}
            </h3>
          </Link>
          <div style={{ marginTop: 8 }}>
            <Tooltip title="活动ID">
              <Tag color="green">{ project.id}</Tag>
            </Tooltip>
            <Tooltip title="发布渠道">
              { project.channel_name &&
                <Tag color={color}>{ project.channel_name }</Tag>
              }
            </Tooltip>
            <Tooltip title="商家标签">
              <Tag color="cyan">{ project.merchant_tag}</Tag>
            </Tooltip>
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
            <Link to={`/taskSquare/submission/details?project_id=${project._id}`}>
              <Button type="primary" ghost style={{ float: 'right' }} onClick={this.handleDeliver}>详情</Button>
            </Link>
          </div>
        </div>
      </Card>
    );
  }
}
