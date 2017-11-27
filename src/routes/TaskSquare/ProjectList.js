import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Select, Icon, Button, Dropdown, Menu, Checkbox, Modal, message, Radio, Col, Row } from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';
import styles from './index.less';
import ProjectCard from './ProjectCard.js';
import TaskList from './TaskList.js'
@connect(state => ({
  projects: state.taskSquare.projects,
  loading: state.taskSquare.projectsLoading,
}))

export default class FlowList extends PureComponent {
  state = {
  
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'taskSquare/fetchProjects',
      payload: {}
    });
  }
  componentWillReceiveProps(nextProps) {
    
  }

  render() {
    const { projects, loading } = this.props;
    return (
      <Card bordered={false} bodyStyle={{ padding: "0 10px" }}>
        <Row gutter={16}>
          {projects.list.map((item,index) => 
            <ProjectCard key={index} project={item} />)
          }
        </Row>
      </Card>
    );
  }
}
