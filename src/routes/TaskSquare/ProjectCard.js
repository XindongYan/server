import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Icon, Button, Dropdown, Menu, Modal, Col, Row } from 'antd';
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
        <Card title={<TaskTitleColumn text={project.title} length={14}/>} className={styles.cardCol}>
          <p>商家标签：{ project.merchant_tag ? project.merchant_tag : '无' }</p>
          <p>项目描述：{ project.desc ? project.desc : '无' }</p>
          <p>截止日期：{ project.deadline ? moment(project.deadline).format('YYYY-MM-DD HH:mm:ss') : '无' }</p>
          <p>项目奖励：{ project.price ? project.price : '无' }</p>
        </Card>
      </Col>
    );
  }
}
