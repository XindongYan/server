import BasicLayout from '../layouts/BasicLayout';
import BlankLayout from '../layouts/BlankLayout';

import Approver from '../routes/Approver/TableList';
import Activity from '../routes/Project/ActivityList';
import ActivityCreate from '../routes/Project/ActivityCreate';
import Deliver from '../routes/Project/DeliverList';
import TeamUser from '../routes/Team/TeamUserList';
import Writer from '../routes/Writer/TableList';
import TaskOption from '../routes/Writer/TaskOption';
import TaskSquare from '../routes/TaskSquare/ProjectList';
import Invitation from '../routes/Invitation/InvitationList';
import Album from '../routes/Album';
import * as Tool from '../routes/Tool/index';

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
  }, {
    name: '选品池',
    path: 'https://kxuan.taobao.com/index.htm',
    target: '_blank',
  }, {
    name: '淘宝热点',
    path: 'https://aidea.taobao.com/',
    target: '_blank',
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
  }, {
    name: '新建活动',
    path: 'activity-create',
    component: ActivityCreate,
  }],
};

const approve = {
  name: '审批',
  path: 'approve',
  icon: 'solution',
  children: [{
    name: '审批任务',
    path: 'approve-list',
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

const tool = {
  name: '工具',
  path: 'tool',
  icon: 'tool',
  children: [{
    name: '在线抠图',
    path: 'http://xiuxiu.web.meitu.com/decorate/',
    target: '_blank',
  }, {
    name: '查询店铺池子',
    path: 'pools',
    component: Tool.ShopPool,
  }, {
    name: '查询新七条',
    path: '/new7',
    component: Tool.WeTaobao,
  }, {
    name: '天猫品牌库',
    path: `/clothes`,
    component: Tool.Clothes,
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
    menuItems.push(square, creation, approve, team, project, album);
  }
  menuItems.push(tool);
  data[0].children = menuItems;
  return data;
}

export default data;
