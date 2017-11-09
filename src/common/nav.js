import BasicLayout from '../layouts/BasicLayout';
import BlankLayout from '../layouts/BlankLayout';

import TableList from '../routes/List/TableList';


import Success from '../routes/Result/Success';
import Error from '../routes/Result/Error';

const data = [{
  component: BasicLayout,
  layout: 'BasicLayout',
  name: '首页', // for breadcrumb
  path: '',
  children: [{
    name: '分配管理',
    path: 'list',
    icon: 'table',
    children: [{
      name: '分配',
      path: 'dispatch-list',
      component: TableList,
    }],
  }],
}];

export function getNavData() {
  return data;
}

export default data;
