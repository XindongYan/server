import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Col, Row } from 'antd';
import moment from 'moment';
import styles from './index.less';
import { routerRedux } from 'dva/router';
import TaskTitleColumn from '../../components/TaskTitleColumn';

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
      <Col span={8} onClick={() => this.projectInto(project)}>
        <Card className={styles.cardCol} bodyStyle={{ padding: 0 }}>
          <div className={styles.cardColTop}>
            <h3 title={project.title}>{project.title}</h3>
            <p title={project.merchant_tag}>{ project.merchant_tag ? project.merchant_tag : '无' }</p>
          </div>
          <div className={styles.cardColBottom}>
            <p className={styles.cardMsgDesc}>项目描述：{ project.desc ? project.desc : '无' }</p>
            <div className={styles.cardMsgB}>
              <span className={styles.cardMsgPrice}>报酬：{ project.price ? project.price : '无' }</span>
              <span className={styles.cardMsgDeadline}>{ project.deadline ? moment(project.deadline).format('YYYY-MM-DD HH:mm:ss') : '无' }</span>
            </div>
          </div>
        </Card>
      </Col>
    );
  }
}
