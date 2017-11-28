import BasicLayout from '../layouts/BasicLayout';
import BlankLayout from '../layouts/BlankLayout';

import Approve from '../routes/Approve/TableList';
import Project from '../routes/Project/ProjectList';
import TeamUser from '../routes/Team/TeamUserList';
import Writer from '../routes/Writer/TableList';
import TaskSquare from '../routes/TaskSquare/ProjectList';
import Invitation from '../routes/Invitation/InvitationList';
import Album from '../routes/Album';

import Success from '../routes/Result/Success';
import Error from '../routes/Result/Error';

const taskSquare = {
  name: '任务广场',
  path: 'task-square',
  component: TaskSquare,
};

const writer = {
  name: '我的任务',
  path: 'writer-list',
  component: Writer,
};

const approve = {
  name: '审核列表',
  path: 'approve-list',
  component: Approve,
};

const team = {
  name: '团队成员',
  path: 'teamUser-list',
  component: TeamUser,
};

const project = {
  name: '活动列表',
  path: 'project-list',
  component: Project,
};

const invitation = {
  name: '邀请码',
  path: 'invitation-list',
  component: Invitation,
};

const album = {
  name: '素材',
  path: 'album-list',
  component: Album,
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
    children: [taskSquare, writer, approve, team, project, invitation, album],
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
