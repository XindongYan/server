import BasicLayout from '../layouts/BasicLayout';
import BlankLayout from '../layouts/BlankLayout';

import Home from '../routes/Home';
import Approver from '../routes/Approver/TableList';
import Project from '../routes/Project/ProjectList';
import ProjectCreate from '../routes/Project/ProjectCreate';
import TeamUser from '../routes/Team/TeamUserList';
import TeamTasks from '../routes/Team/TeamTasks';

import Writer from '../routes/Writer/TableList';
import TaskOption from '../routes/Writer/TaskOption';

import TaskSquare from '../routes/TaskSquare/ProjectList';
import SubmissionList from '../routes/TaskSquare/SubmissionList';
import Invitation from '../routes/Invitation/InvitationList';
import Album from '../routes/Album';
import * as Tool from '../routes/Tool/index';

import Success from '../routes/Result/Success';
import Error from '../routes/Result/Error';

import { RIGHT } from '../constants';

const home = {
  name: '首页',
  path: 'home',
  icon: 'home',
  children: [],
  component: Home,
};
const square = {
  name: '广场',
  path: 'square',
  icon: 'appstore-o',
  children: [{
    name: '赏金任务',
    path: 'task',
    component: TaskSquare,
  }, {
    name: '投稿',
    path: 'submission',
    component: SubmissionList,
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
  name: '活动',
  path: 'project',
  icon: 'file',
  children: [{
    name: '活动列表',
    path: 'list',
    component: Project,
  }, {
    name: '新建活动',
    path: 'create',
    component: ProjectCreate,
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
    name: '全部任务',
    path: 'teamTasks-list',
    component: TeamTasks,
  }, {
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
  }, {
    name: '查询每日好店',
    path: 'https://we.taobao.com/shop/shopList.htm',
    target: '_blank',
  }, {
    name: '淘客订单明细',
    path: '/alimamaOrders',
    component: Tool.AlimamaOrder,
  }, {
    name: '有好货查重',
    path: '/qumai',
    component: Tool.Qumai,
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
  const menuItems = [home];
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
