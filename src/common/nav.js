import BasicLayout from '../layouts/BasicLayout';
import BlankLayout from '../layouts/BlankLayout';

import TableList from '../routes/List/TableList';
import FlowList from '../routes/Flow/FlowList';
import ApproveRoleList from '../routes/Flow/ApproveRoleList';
import TeamUserList from '../routes/Team/TeamUserList';

import Success from '../routes/Result/Success';
import Error from '../routes/Result/Error';

const approve = {
  name: '审核',
  path: 'approve-list',
  component: TableList,
};

const create = {
  name: '全部作品',
  path: 'create-list',
  component: TableList,
};

const team = {
  name: '团队成员',
  path: 'teamUser-list',
  component: TeamUserList,
};

const flow = {
  name: '审核模板',
  path: 'flow-list',
  component: FlowList,
};

const approveRole = {
  name: '审核角色',
  path: 'approveRole-list',
  component: ApproveRoleList,
};

const invitationCode = {
  name: '邀请码',
  path: 'invitationCode-list',
  component: ApproveRoleList,
};


const data = [{
  component: BasicLayout,
  layout: 'BasicLayout',
  name: '首页', // for breadcrumb
  path: '',
  children: [{
    name: '创作',
    path: 'list',
    icon: 'table',
    children: [approve, create, team, flow, approveRole],
  }, {
    name: '工具',
    path: 'tool',
    icon: 'tool',
    children: [{
      name: '查询店铺池子',
      path: `${location.origin}/task/list?ruu`,
    }, {
      name: '查询新七条',
      path: `${location.origin}/task/list`,
    }],
  }],
}];

export function getNavData() {
  return data;
}

export default data;
