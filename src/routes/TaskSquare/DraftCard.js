import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Col, Row, Icon, Button, message } from 'antd';
import moment from 'moment';
import styles from './index.less';
import { routerRedux } from 'dva/router';

@connect(state => ({
  currentUser: state.user.currentUser,
}))

export default class DraftCard extends PureComponent {
  state = {
   
  }

  componentDidMount() {
    
  }
  componentWillReceiveProps(nextProps) {
    
  }
  handleDeliver = (project) => {
    const { dispatch, currentUser } = this.props;
    dispatch({
      type: 'taskSquare/deliverTask',
      payload: {
        project_id: project._id,
        creator_id: currentUser._id,
        taker_id: currentUser._id,
      },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          message.success(result.msg);
        }
      },
    });
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
            { project.price ? 
              <span className={styles.cardMsgPrice}>
                  <Icon style={{ fontSize: 16 }} type="pay-circle" />
                  <span style={{ padding: '0 6px' }}>{ project.price }</span>
              </span> :
              <span style={{ float: 'left' }}>无</span>
            }
            { project.deadline ? 
              <span className={styles.cardMsgDeadline} style={{ marginLeft: 40, float: 'left' }}>截稿日期：{ moment(project.deadline).format('YYYY-MM-DD') }</span>
              : <span></span>
            }
            <Button style={{ float: 'right' }} onClick={() => this.handleDeliver(project)}>投稿</Button>
          </div>
        </div>
      </Card>
    );
  }
}
