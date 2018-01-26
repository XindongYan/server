export const ORIGIN = 'http://test.nicai360.com';
// export const ORIGIN = 'http://www.nicai360.com';
// export const ORIGIN = `http://${location.hostname}:3000`;

export const RIGHTS = [
  { label: '写手', value: 1 },
  { label: '团队管理', value: 2 },
  { label: '活动管理', value: 3 },
  { label: '活动主管', value: 4 },
  { label: '审核', value: 6 },
  { label: '财务', value: 7 },
  { label: '管理员', value: 8 },
];

export const APPROVE_ROLES = [
  { label: '一审', value: 1 },
  { label: '二审', value: 2 },
  { label: '合作伙伴', value: 3 },
  { label: '商家', value: 4 },
];

export const ROLES = [
  { label: '商家', value: 1 },
];

export const QINIU_DOMAIN = 'http://oyufgm5i2.bkt.clouddn.com';
export const QINIU_UPLOAD_DOMAIN = 'http://up.qiniu.com';

export const APPROVE_FLOWS = [
  { value: 1, texts: [1] },
  { value: 2, texts: [1, 2] },
  { value: 3, texts: [1, 3, 4] },
  { value: 4, texts: [1, 2, 3, 4] },
  { value: 5, texts: [1, 4] },
  { value: 6, texts: [1, 2, 4] },
];

export const TASK_TYPES = [
  { value: 1, text: '图文' },
  { value: 2, text: '视频' },
  // { value: 3, text: '直播脚本' },
];

export const PROJECT_LEVELS = [
  { value: 0, text: 'P0' },
  { value: 1, text: 'P1' },
  { value: 2, text: 'P2' },
  { value: 3, text: 'P3' },
  { value: 4, text: 'P4' },
  { value: 5, text: 'P5' },
  { value: 6, text: 'P6' },
  { value: 7, text: 'P7' },
  { value: 8, text: 'P8' },
  { value: 9, text: 'P9' },
];

export const TASK_APPROVE_STATUS = {
  all: -4,
  created: -3,
  published: -2,
  taken: -1,
  waitingForApprove: 0,
  passed: 1,
  rejected: 2,
  waitingToTaobao: 3,
  publishedToTaobao: 4,
  taobaoAccepted: 5,
  taobaoRejected: 6,
};

export const PROJECT_STATUS = {
  created: 1,
  published: 2,
  offshelf: 3,
};

export const PROJECT_STATUS_TEXT = {
  '1': '已创建',
  '2': '已发布',
  '3': '已下架',
};

export const CHANNEL_NAMES = ['淘宝头条', '微淘', '有好货', '生活研究所'];

export const RIGHT = {
  writer: 1,
  teamAdmin: 2,
  projectCreator: 3,
  projectAdmin: 4,
  approver: 6,
  finance: 7,
};

export const INVITATION_ROLE = {
  writer: 1,
  cooperative: 2,
  business: 3,
  daren: 4,
};

export const SOURCE = {
  task: 1, // 赏金任务
  deliver: 2, // 投稿
  create: 3, // 我的
  pass: 4, // 转交
};
