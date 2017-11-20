import BasicLayout from '../layouts/BasicLayout';
import BlankLayout from '../layouts/BlankLayout';

import TableList from '../routes/List/TableList';
import ProjectList from '../routes/Project/ProjectList';
import TeamUserList from '../routes/Team/TeamUserList';

import Invitation from '../routes/Invitation/InvitationList';

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

const project = {
  name: '项目',
  path: 'project-list',
  component: ProjectList,
};

const invitation = {
  name: '邀请码',
  path: 'invitation-list',
  component: Invitation,
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
    children: [approve, create, team, project, invitation],
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
