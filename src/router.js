import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import BasicLayout from './layouts/BasicLayout';
import UserLayout from './layouts/UserLayout';
import UserInfoLayout from './layouts/UserInfoLayout';
import DarenLayout from './layouts/DarenLayout';

function RouterConfig({ history }) {
  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <Route path="/user" component={UserLayout} />
          <Route path="/setting" component={UserInfoLayout} />
          <Route path="/daren" component={DarenLayout} />
          <Route path="/" component={BasicLayout} />
          <Redirect to="/" />
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
