import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route, Switch, Redirect, routerRedux } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import styles from './DarenLayout.less';
import DarenList from '../routes/Daren/DarenList';

class DarenLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
  }
  getChildContext() {
    const { location } = this.props;
    return { location };
  }
  getPageTitle() {
    const title = '尼采创作平台';
    return title;
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'user/fetchCurrent',
      callback: (result) => {
        if (result.error) {
          this.props.dispatch(routerRedux.push('/user/login'));
        }
      },
    });
  }
  render() {
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <Switch>
            <Route key="daren" path="/daren/list" component={DarenList} />
            <Redirect to="/daren/list" />
          </Switch>
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(state => ({
  currentUser: state.user.currentUser,
  collapsed: state.global.collapsed,
  fetchingNotices: state.global.fetchingNotices,
  notices: state.global.notices,
  team: state.user.team,
  teamUser: state.user.teamUser,
}))(DarenLayout);
