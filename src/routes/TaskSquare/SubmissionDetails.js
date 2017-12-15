import React, { PureComponent } from 'react';
import { connect } from 'dva';
import querystring from 'querystring';
import { Card, message, Row, Spin } from 'antd';
import styles from './index.less';
import ProjectDetail from '../../components/ProjectDetail';
import { ORIGIN } from '../../constants';
import { routerRedux } from 'dva/router';

@connect(state => ({
  project: state.taskSquare.project,
  loading: state.taskSquare.tasksLoading,
  currentUser: state.user.currentUser,
}))

export default class SubmissionDetails extends PureComponent {
  state = {
    page: {
      currentPage: 1,
      pageSize: 9999,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    dispatch({
      type: 'taskSquare/fetchProject',
      payload: { ...this.state.page, _id: query.project_id }
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'taskSquare/clearProjectTasks',
    });
  }
  createTaskInto = () => {
    const { project } = this.props;
    this.props.dispatch(routerRedux.push(`/writer/task/create?project_id=${project._id}&channel_name=${project.channel_name}`));
  }
  render() {
    const { project, loading } = this.props;
    return (
      <div>
        <ProjectDetail project={project} type={2} createTaskInto={this.createTaskInto} />
      </div>
    );
  }
}