import BasicLayout from '../layouts/BasicLayout';
import UserLayout from '../layouts/UserLayout';
import BlankLayout from '../layouts/BlankLayout';

import TableList from '../routes/List/TableList';


import Success from '../routes/Result/Success';
import Error from '../routes/Result/Error';

import Login from '../routes/User/Login';
import Register from '../routes/User/Register';
import RegisterResult from '../routes/User/RegisterResult';

const data = [{
  component: BasicLayout,
  layout: 'BasicLayout',
  name: '首页', // for breadcrumb
  path: '',
  children: [{
    name: '用户管理',
    path: 'list',
    icon: 'table',
    children: [{
      name: '用户',
      path: 'table-list',
      component: TableList,
    }],
  }, {
    name: '流程管理',
    path: 'flow',
    icon: 'table',
    children: [{
      name: '流程',
      path: 'table-list',
      component: TableList,
    }],
  }],
}, {
  component: UserLayout,
  layout: 'UserLayout',
  children: [{
    name: '帐户',
    icon: 'user',
    path: 'user',
    children: [{
      name: '登录',
      path: 'login',
      component: Login,
    }, {
      name: '注册',
      path: 'register',
      component: Register,
    }, {
      name: '注册结果',
      path: 'register-result',
      component: RegisterResult,
    }],
  }],
}, {
  component: BlankLayout,
  layout: 'BlankLayout',
  children: {
    name: '使用文档',
    path: 'http://pro.ant.design/docs/getting-started',
    target: '_blank',
    icon: 'book',
  },
}];

export function getNavData() {
  return data;
}

export default data;
