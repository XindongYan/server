import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Spin, Tabs } from 'antd';
import styles from './index.less';
import ProjectCard from './ProjectCard.js';
import SubmissionCard from './SubmissionCard.js';

const TabPane = Tabs.TabPane;
@connect(state => ({
  projects: state.taskSquare.projects,
  loading: state.taskSquare.projectsLoading,
}))

export default class FlowList extends PureComponent {
  state = {
    type: 1,
    page: {
      currentPage: 1,
      pageSize: 9999,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'taskSquare/fetchProjects',
      payload: { ...this.state.page, type: this.state.type }
    });
  }
  componentWillReceiveProps(nextProps) {
    
  }

  tabChange = (e) => {
    this.setState({
      type: e
    },() => {
      this.props.dispatch({
        type: 'taskSquare/fetchProjects',
        payload: { ...this.state.page, type: this.state.type }
      });
    })
  }
  render() {
    const { projects, loading } = this.props;
    return (
      <Card bordered={false} bodyStyle={{ padding: '0 10px' }} style={{ background: 'none' }}>
        {projects.list && projects.list.length > 0 ?
          projects.list.map((item,index) => 
          <ProjectCard key={index} project={item} />)
          : 
          <div style={{ padding: 50, textAlign: 'center', fontSize: 18, color: '#888' }}>
            暂无数据
          </div>
        }
        { /*
          <Tabs defaultActiveKey="1" onChange={this.tabChange}>
            <TabPane tab="活动" key="1">
              
            </TabPane>
             <TabPane tab="投稿" key="2">
              {projects.list.map((item,index) => 
                <SubmissionCard key={index} project={item} />)
              }
            </TabPane>
          </Tabs>
        */ }
      </Card>
    );
  }
}
