import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Col, Row, Icon, Button, message } from 'antd';
import moment from 'moment';
import styles from './index.less';
import { routerRedux } from 'dva/router';

@connect(state => ({

}))

export default class DraftCard extends PureComponent {
  state = {
   
  }

  componentDidMount() {
    
  }
  componentWillReceiveProps(nextProps) {
  }
  handleDeliver = (project) => {
    this.props.dispatch(routerRedux.push(`/writer/task/create?project_id=${project._id}&channel_name=${project.channel_name}`));
  }
  render() {
    const { project } = this.props;
    return (
      <Card className={styles.cardCol} style={{ marginBottom: 10 }} bodyStyle={{ padding: 0 }}>
        <div className={styles.cardColTop}>
          <h3 title={project.name}>{project.name}</h3>
          <p title={project.merchant_tag}>{ project.merchant_tag}</p>
        </div>
        <div className={styles.cardColBottom}>
          <p className={styles.draftCardMsg}>{ project.desc}</p>
          <div className={styles.draftMsgB}>
            { project.price !== 0 &&
              <span className={styles.cardMsgPrice}>
                  <Icon style={{ fontSize: 16 }} type="pay-circle" />
                  <span style={{ padding: '0 6px' }}>{ project.price }</span>
              </span>
            }
            { project.deadline &&
              <span className={styles.cardMsgDeadline} style={{ marginLeft: 40, float: 'left' }}>截稿日期：{ moment(project.deadline).format('YYYY-MM-DD') }</span>
            }
            <Button style={{ float: 'right' }} onClick={() => this.handleDeliver(project)}>投稿</Button>
          </div>
        </div>
      </Card>
    );
  }
}
