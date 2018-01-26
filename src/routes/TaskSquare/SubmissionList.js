import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Spin, Tabs, Input } from 'antd';
import styles from './index.less';
import ProjectCard from './ProjectCard.js';
import SubmissionCard from './SubmissionCard.js';

const TabPane = Tabs.TabPane;
const Search = Input.Search;

@connect(state => ({
  projects: state.taskSquare.projects,
  loading: state.taskSquare.projectsLoading,
}))

export default class SubmissionList extends PureComponent {
  state = {
    type: 2,
    searchValue: '',
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
  handleSearchChange = (e) => {
    if (e.target.value.length === 0) {
      this.handleSearch(e.target.value, 'search');
    }
    this.setState({ searchValue: e.target.value });
  }
  handleSearch = (value, name) => {
    const { dispatch, projects: { pagination } } = this.props;
    const values = {
      ...pagination,
      type: this.state.type
    };
    values[name] = value;
    dispatch({
      type: 'taskSquare/fetchProjects',
      payload: values,
    });
  }
  render() {
    const { projects, loading } = this.props;
    return (
      <Card bordered={false} bodyStyle={{ padding: '0 10px' }} style={{ background: 'none' }}>
        <div style={{ marginBottom: 15 }} align="right">
          <Search
            style={{ width: 400 }}
            placeholder="ID／名称／商家标签"
            onChange={this.handleSearchChange}
            onSearch={(value) => this.handleSearch(value, 'search')}
            enterButton
          />
        </div>
        {projects.list && projects.list.length > 0 ?
          projects.list.map((item,index) => 
          <SubmissionCard key={index} project={item} />)
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
