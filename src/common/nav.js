import BasicLayout from '../layouts/BasicLayout';
import BlankLayout from '../layouts/BlankLayout';

import Approver from '../routes/Approver/TableList';
import Activity from '../routes/Project/ActivityList';
import Deliver from '../routes/Project/DeliverList';
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

const approver = {
  name: '审核列表',
  path: 'approver-list',
  component: Approver,
};

const team = {
  name: '团队成员',
  path: 'teamUser-list',
  component: TeamUser,
};

const activity = {
  name: '活动列表',
  path: 'activity-list',
  component: Activity,
};

const deliver = {
  name: '投稿列表',
  path: 'deliver-list',
  component: Deliver,
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
    children: [taskSquare, writer, album],
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

const RIGHTS = {
  writer: 1,
  teamAdmin: 2,
  projectAdmin: 3,
  approver: 6,
};

export function getNavData(user) {
  const menuItems = [];
  if (user.rights) {
    if (user.rights.indexOf(RIGHTS.writer) >= 0) {
      menuItems.push(taskSquare, writer);
    }
    if (user.rights.indexOf(RIGHTS.approver) >= 0) {
      menuItems.push(approver);
    }
    if (user.rights.indexOf(RIGHTS.teamAdmin) >= 0) {
      menuItems.push(team, invitation);
    }
    if (user.rights.indexOf(RIGHTS.projectAdmin) >= 0) {
      menuItems.push(activity, deliver);
    }
    if (user.rights.indexOf(RIGHTS.writer) >= 0) {
      menuItems.push(album);
    }
  } else {
    menuItems.push(taskSquare, writer, album);
  }
  data[0].children[0].children = menuItems;
  return data;
}

export default data;
