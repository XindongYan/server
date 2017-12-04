import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Col, Row, Icon } from 'antd';
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
    return (
      <Col span={8} style={{ padding: 5 }}>
        <Card className={styles.cardCol} bodyStyle={{ padding: 0 }} onClick={() => this.projectInto(project)}>
          <div className={styles.cardColTop}>
            <h3 title={project.name}>{project.name}</h3>
            <p title={project.merchant_tag}>{ project.merchant_tag}</p>
          </div>
          <div className={styles.cardColBottom}>
            <p className={styles.cardMsgDesc}>{ project.desc}</p>
            <div className={styles.cardMsgB}>
              { project.price ? 
                <span className={styles.cardMsgPrice}>
                    <Icon style={{ fontSize: 16 }} type="pay-circle" />
                    <span style={{ padding: '0 6px' }}>{ project.price }</span>
                </span> :
                <span>无</span>
              }
              { project.deadline ? 
                <span className={styles.cardMsgDeadline}>截稿日期：{ moment(project.deadline).format('YYYY-MM-DD') }</span>
                : <span></span>
              }
            </div>
          </div>
        </Card>
      </Col>
    );
  }
}
