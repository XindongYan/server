import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Spin } from 'antd';
import styles from './index.less';
import ProjectCard from './ProjectCard.js';

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
        <Spin spinning={loading}>
          <Row gutter={16}>
            {projects.list.map((item,index) => 
              <ProjectCard key={index} project={item} />)
            }
          </Row>
        </Spin>
      </Card>
    );
  }
}
