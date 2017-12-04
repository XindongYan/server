import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Spin, Tabs } from 'antd';
import styles from './index.less';
import ProjectCard from './ProjectCard.js';
import DraftCard from './DraftCard.js';

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
      <Card bordered={false} bodyStyle={{ padding: "0 10px" }}>
        <Tabs defaultActiveKey="1" onChange={this.tabChange}>
          <TabPane tab="活动广场" key="1">
            <Spin spinning={loading}>
              <Row gutter={16} style={{padding: '0 5px'}}>
                {projects.list.map((item,index) => 
                  <ProjectCard key={index} project={item} />)
                }
              </Row>
            </Spin>
          </TabPane>
          <TabPane tab="投稿" key="2">
            {projects.list.map((item,index) => 
              <DraftCard key={index} project={item} />)
            }
          </TabPane>
        </Tabs>
      </Card>
    );
  }
}
