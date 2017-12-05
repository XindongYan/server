import BasicLayout from '../layouts/BasicLayout';
import BlankLayout from '../layouts/BlankLayout';

import Approver from '../routes/Approver/TableList';
import Activity from '../routes/Project/ActivityList';
import Deliver from '../routes/Project/DeliverList';
import TeamUser from '../routes/Team/TeamUserList';
import Writer from '../routes/Writer/TableList';
import TaskOption from '../routes/Writer/TaskOption';
import TaskSquare from '../routes/TaskSquare/ProjectList';
import Invitation from '../routes/Invitation/InvitationList';
import Album from '../routes/Album';

import Success from '../routes/Result/Success';
import Error from '../routes/Result/Error';

import { RIGHT } from '../constants';
// const deliver = {
//   name: '投稿列表',
//   path: 'deliver-list',
//   component: Deliver,
// };

const square = {
  name: '广场',
  path: 'square',
  icon: 'home',
  children: [{
    name: '赏金任务',
    path: 'task',
    component: TaskSquare,
  }],
};

const creation = {
  name: '创作',
  path: 'creation',
  icon: 'edit',
  children: [{
    name: '全部作品',
    path: 'writer-list',
    component: Writer,
  }, {
    name: '新建作品',
    path: 'writer-create',
    component: TaskOption,
  }],
};

const project = {
  name: '活动创建',
  path: 'project',
  icon: 'file',
  children: [{
    name: '活动列表',
    path: 'activity-list',
    component: Activity,
  }],
};

const approve = {
  name: '审批',
  path: 'approve',
  icon: 'solution',
  children: [{
    name: '审批任务',
    path: 'activity-list',
    component: Approver,
  }],
};

const team = {
  name: '管理',
  path: 'team',
  icon: 'team',
  children: [{
    name: '团队管理',
    path: 'teamUser-list',
    component: TeamUser,
  }, {
    name: '邀请码',
    path: 'invitation-list',
    component: Invitation,
  }],
};

const album = {
  name: '素材中心',
  path: 'album',
  icon: 'picture',
  children: [{
    name: '图片',
    path: 'picture',
    component: Album,
  }],
};

const tools = {
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
};


const data = [{
  component: BasicLayout,
  layout: 'BasicLayout',
  name: '首页', // for breadcrumb
  path: '',
  children: [],
}];

export function getNavData(user) {
  const menuItems = [];
  if (user.rights) {
    if (user.rights.indexOf(RIGHT.writer) >= 0) {
      menuItems.push(square, creation);
    }
    if (user.rights.indexOf(RIGHT.approver) >= 0) {
      menuItems.push(approve);
    }
    if (user.rights.indexOf(RIGHT.teamAdmin) >= 0) {
      menuItems.push(team);
    }
    if (user.rights.indexOf(RIGHT.projectAdmin) >= 0) {
      menuItems.push(project);
    }
    if (user.rights.indexOf(RIGHT.writer) >= 0) {
      menuItems.push(album);
    }
  } else {
    menuItems.push(square, creation, album);
  }
  data[0].children = menuItems;
  return data;
}

export default data;
