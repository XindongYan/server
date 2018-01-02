import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route, Switch, Redirect } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon, Modal } from 'antd';
import styles from './UserInfoLayout.less';
import UserInfo from '../routes/User/UserInfo';
import UserPassWord from '../routes/User/UserPassWord';
import ToBind from '../routes/User/ToBind';
import BindSuccess from '../routes/User/BindSuccess';

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

  componentDidMount() {
    if (navigator.userAgent.indexOf('Chrome') === -1) {
        Modal.warning({
          title: '当前的浏览器版本可能存在兼容性问题，需要使用Chrome',
      });
    } else {
      var userAgent = navigator.userAgent.substring(navigator.userAgent.indexOf('Chrome')+7,navigator.userAgent.indexOf('Chrome')+9);
      if (Number(userAgent) < 59) {
        Modal.warning({
          title: '当前的浏览器版本过低，需要升级',
        });
      }
    }
  }
  render() {
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <Switch>
            <Route key="setting" path="/setting/userInfo" component={UserInfo} />
            <Route key="password" path="/setting/password" component={UserPassWord} />
            <Route key="to-bind" path="/setting/to-bind" component={ToBind} />
            <Route key="bind-success" path="/setting/bind-success" component={BindSuccess} />
            <Redirect to="/setting/userInfo" />
          </Switch>
        </div>
      </DocumentTitle>
    );
  }
}

export default UserInfoLayout;
