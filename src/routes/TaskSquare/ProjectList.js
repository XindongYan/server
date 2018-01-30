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
  teamUser: state.user.teamUser,
}))

export default class FlowList extends PureComponent {
  state = {
    type: 1,
    searchValue: '',
  }

  componentDidMount() {
    const { dispatch, projects: { pagination }, teamUser } = this.props;
    if (teamUser.team_id) {
      dispatch({
        type: 'taskSquare/fetchProjects',
        payload: { ...pagination, type: this.state.type, team_id: teamUser.team_id }
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { dispatch, projects: { pagination }, teamUser } = nextProps;
    if (teamUser.team_id !== this.props.teamUser.team_id) {
      dispatch({
        type: 'taskSquare/fetchProjects',
        payload: { ...pagination, type: this.state.type, team_id: teamUser.team_id }
      });
    }
  }
  handleSearchChange = (e) => {
    if (e.target.value.length === 0) {
      this.handleSearch(e.target.value, 'search');
    }
    this.setState({ searchValue: e.target.value });
  }
  handleSearch = (value, name) => {
    const { dispatch, projects: { pagination }, teamUser } = this.props;
    const values = {
      ...pagination,
      type: this.state.type,
      team_id: teamUser.team_id,
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
          <ProjectCard key={index} project={item} />)
          : 
          <div style={{ padding: 50, textAlign: 'center', fontSize: 18, color: '#888' }}>
            暂无数据
          </div>
        }
      </Card>
    );
  }
}
