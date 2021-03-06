import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route, Switch, Redirect } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon, Modal } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';

import Login from '../routes/User/Login';
import Register from '../routes/User/Register';
import RegisterResult from '../routes/User/RegisterResult';

import UserAgent from './UserAgent';
import Logo from './nicai_logo.png';
import Nicai from './nicai_text.png';

const links = [{
  title: '帮助',
  href: '',
}, {
  title: '隐私',
  href: '',
}, {
  title: '条款',
  href: '',
}];

const copyright = <div>Copyright <Icon type="copyright" /> 2017 尼采出品</div>;

class UserLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
  }
  getChildContext() {
    const { location } = this.props;
    return { location };
  }
  getPageTitle() {
    // const { location } = this.props;
    // const { pathname } = location;
    const title = '尼采创作平台';
    return title;
  }
  componentDidMount() {

  }
  render() {
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="" className={styles.logo} src={Logo} />
                <img alt="" className={styles.nicaiText} src={Nicai} />
              </Link>
              <UserAgent />
            </div>
          </div>
          <Switch>
            <Route key="login" path="/user/login" component={Login} />
            <Route key="register" path="/user/register" component={Register} />
            <Route key="register-result" path="/user/register-result" component={RegisterResult} />
            <Redirect to="/user/login" />
          </Switch>
          <GlobalFooter className={styles.footer} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
