const CHANNELS = [{
  "activityList": [{
    "id": 1437,
    "name": "智能搭配- ifashion",
  // }, {
  //   "id": 97,
  //   "name": "首页card ifashion",
  }],
  "desc": "iFashion是基于中高端年轻化女性时尚社区平台，面对泛90后人群提供潮流新品、流行资讯，搭配，扮美，运动时尚好物。覆盖女装，女鞋，女士内衣，服饰配件，眼镜，珠宝，流行首饰，手表，美容护肤，个人护理，美妆，运动，户外，运动休闲服装，运动鞋等关于女性时尚的一级类目。",
  "id": 34,
  "logo": "https://img.alicdn.com/tfs/TB10zj.SFXXXXadXXXXXXXXXXXX-100-100.png",
  "name": "iFashion"
}, {
//   "activityList": [{
//     "id": 1413,
//     "name": "搭配专用入口"
//   }],
//   "desc": "潮男养成定位高端有品男装，杂志风男装穿搭＋消费升级引导。",
//   "id": 50,
//   "logo": "https://img.alicdn.com/tfs/TB1tjZaSFXXXXXFXXXXXXXXXXXX-100-100.png",
//   "name": "潮男养成"
// }, {
  "activityList": [{
    "id": 414,
    "name": "新单品-测试",
  }],
  "desc": "网罗天下高逼格好物的商品推荐平台，品质生活指南。",
  "id": 2,
  "logo": "https://img.alicdn.com/tfs/TB16mgvRVXXXXXPXpXXXXXXXXXX-200-200.png",
  "name": "有好货"
}, {
  "activityList": [{
    "id": 1439,
    "name": "首页card-全球时尚",
  }],
  "desc": "汇集优质的时尚领域内容，以时尚指南、潮流资讯等栏目打造用户所喜爱的女性内容导购频道。",
  "id": 73,
  "logo": "https://img.alicdn.com/tfs/TB1Cg5QdwoQMeJjy0FnXXb8gFXa-100-100.png",
  "name": "全球时尚"
}, {
  "activityList": [{
    "id": 60,
    "name": "买遍全球频道",
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
