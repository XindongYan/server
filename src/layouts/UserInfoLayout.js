import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route, Switch, Redirect } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import styles from './UserInfoLayout.less';
import UserInfo from '../routes/User/UserInfo';

class UserInfoLayout extends React.PureComponent {
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
  render() {
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.top}>
            <p className={styles.desc}>个人信息</p>
          </div>
          <Switch>
            <Route key="setting" path="/setting/userInfo" component={UserInfo} />
            <Redirect to="/setting/userInfo" />
          </Switch>
        </div>
      </DocumentTitle>
    );
  }
}

export default UserInfoLayout;
