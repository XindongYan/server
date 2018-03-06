const CHANNELS = [{
  "activityList": [{
    "id": 68,
    "name": "横版视频招稿"
  }, {
    "id": 992,
    "name": "横版视频(无商品)"
  }, {
    "id": 933,
    "name": "竖版视频招稿"
  }, {
    "id": 1307,
    "name": "竖版视频(无商品)"
  }],
  "desc": "通过淘宝短视频审核后，烦请务必搜索钉钉群：11700216 申请加入淘宝短视频官方群，入群信息达人昵称-视频领域，如果不备注无法通过审核，入群请备注达人名称；",
  "id": 33,
  "logo": "https://img.alicdn.com/tfs/TB1ZcTlSFXXXXXHapXXXXXXXXXX-100-100.png",
  "name": "淘宝短视频"
}, {
  "activityList": [{
    "id": 1437,
    "name": "智能搭配- ifashion",
    "remainCount": 5
  }, {
    "id": 97,
    "name": "首页card ifashion",
    "remainCount": 5
  }],
  "desc": "iFashion是基于中高端年轻化女性时尚社区平台，面对泛90后人群提供潮流新品、流行资讯，搭配，扮美，运动时尚好物。覆盖女装，女鞋，女士内衣，服饰配件，眼镜，珠宝，流行首饰，手表，美容护肤，个人护理，美妆，运动，户外，运动休闲服装，运动鞋等关于女性时尚的一级类目。",
  "id": 34,
  "logo": "https://img.alicdn.com/tfs/TB10zj.SFXXXXadXXXXXXXXXXXX-100-100.png",
  "name": "iFashion"
}, {
  "activityList": [{
    "id": 1413,
    "name": "搭配专用入口"
  }, {
    "id": 413,
    "name": "首页card潮男养成",
    "remainCount": 8
  }],
  "desc": "潮男养成定位高端有品男装，杂志风男装穿搭＋消费升级引导。",
  "id": 50,
  "logo": "https://img.alicdn.com/tfs/TB1tjZaSFXXXXXFXXXXXXXXXXXX-100-100.png",
  "name": "潮男养成"
}, {
  "activityList": [{
    "id": 414,
    "name": "新单品-测试",
    "remainCount": 50
  }],
  "desc": "网罗天下高逼格好物的商品推荐平台，品质生活指南。",
  "id": 2,
  "logo": "https://img.alicdn.com/tfs/TB16mgvRVXXXXXPXpXXXXXXXXXX-200-200.png",
  "name": "有好货"
}, {
  "activityList": [{
    "id": 1104,
    "name": "天猫营业厅",
    "remainCount": 100
  }],
  "desc": "天猫营业厅是运营商业务的互联网运营主阵地，集合了合约机购买、宽带号卡办理、话费流量充值、账单余额查询、套餐变更等业务，通过各类内容为用户提供清晰便捷的服务；所需内容类型：图文、清单、视频、单品。",
  "id": 68,
  "logo": "https://img.alicdn.com/tfs/TB1zTXESFXXXXbjXVXXXXXXXXXX-100-100.png",
  "name": "天猫营业厅"
}, {
  "activityList": [{
    "id": 1439,
    "name": "首页card-全球时尚",
    "remainCount": 30
  }],
  "desc": "汇集优质的时尚领域内容，以时尚指南、潮流资讯等栏目打造用户所喜爱的女性内容导购频道。",
  "id": 73,
  "logo": "https://img.alicdn.com/tfs/TB1Cg5QdwoQMeJjy0FnXXb8gFXa-100-100.png",
  "name": "全球时尚"
}, {
  "activityList": [{
    "id": 6747,
    "name": "专业推荐——专用投稿通道",
    "remainCount": 100
  }, {
    "id": 60,
    "name": "买遍全球频道",
    "remainCount": 100
  }],
  "desc": "用户只需要发一行字，一条语音、一张图片，立刻会有最匹配最有经验的一批人，告诉你最符合你需求的好东西，且所有推荐出的商品都有专门买手帮你购买的C2B社会化电商平台。",
  "id": 26,
  "logo": "https://img.alicdn.com/tfs/TB1YUUFXwvGK1Jjy0FbXXb4vVXa-100-100.png",
  "name": "买遍全球"
}];

const CHANNELS_FOR_CASCADER = CHANNELS.map(item => {
  return {
    value: item.id,
    label: item.name,
    children: item.activityList.map(item1 => ({ value: item1.id, label: item1.name })),
  };
})
export { CHANNELS, CHANNELS_FOR_CASCADER };
