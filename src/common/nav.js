import BasicLayout from '../layouts/BasicLayout';
import BlankLayout from '../layouts/BlankLayout';

import Approve from '../routes/Approve/TableList';
import Create from '../routes/Create/TableList';
import Project from '../routes/Project/ProjectList';
import TeamUser from '../routes/Team/TeamUserList';
// import Writer from '../routes/Writer/TableList';

import Invitation from '../routes/Invitation/InvitationList';

import Success from '../routes/Result/Success';
import Error from '../routes/Result/Error';

// const writer = {
//   name: '写手列表',
//   path: 'approve-list',
//   component: Writer,
// };

const approve = {
  name: '审核列表',
  path: 'approve-list',
  component: Approve,
};

const create = {
  name: '创建任务',
  path: 'create-list',
  component: Create,
};

const team = {
  name: '团队成员',
  path: 'teamUser-list',
  component: TeamUser,
};

const project = {
  name: '项目列表',
  path: 'project-list',
  component: Project,
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
