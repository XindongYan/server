import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import querystring from 'querystring';
import { Card, Button, Popconfirm, message, Row, Col } from 'antd';
import { CHANNEL_NAMES } from '../../constants';
import TaskChat from '../../components/TaskChat';
import styles from './TableList.less';

@connect(state => ({

}))

export default class TaskChannel extends PureComponent {
  state = {

  }
  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {

  }
  handleContent = () => {
    const query = querystring.parse(this.props.location.search.substr(1));
    if (query.channel_name === '淘宝头条') {
      return (
        <span>打造中国最大的生活消费资讯平台，建立一个用户、媒体/自媒体、品牌，触达彼此、互相信任的消费信息生态。如果你热爱生活，对个人消费拥有独到品味和见解，乐于分享专业知识，那不论你是个人，是媒体或是品牌组织，我们都欢迎你来加入。『用内容引领消费！』所需内容类型：不局限于文字、画面、声音、视频等等任何一种载体，只要“优秀”！</span>
      )
    } else if (query.channel_name === '微淘') {
      return (
        <span>有消费引导性的生活资讯文章</span>
      )
    } else if (query.channel_name === '有好货') {
      return (
        <span>有好货是手淘重要的精品导购平台，我们面向高消费力人群，为用户挖掘高格调、高品质、小众、有设计美感的商品。</span>
      )
    } else if (query.channel_name === '生活研究所') {
      return (
        <span>生活研究所是手淘一个垂直细分领域的导购产品！~主要围绕户生命成长周期，基于身份、风格、兴趣、类目偏好、消费偏好等维度构成。产品宗旨：希望能够利用细分垂直领域少数人的智慧，给用户可信赖高品质的货品&知识。</span>
      )
    } else if (query.channel_name === '全球时尚') {
      return (
        <div>
          <p>全球时尚定位：</p>
          <p>人群定位：高端女性人群</p>
          <p>功能定位：分享最权威、高端、时尚潮流的内容</p>
          <p>产品定位：淘内高端时尚内容聚集地的标杆</p>
        </div>
      )
    } else if (query.channel_name === 'ifashion') {
      return (
        <span>iFashion定位女性中高端人群的时尚搭配与潮流基地。覆盖类目：女装/女士精品，女鞋，眼镜，女士内衣/家居服，美容护肤/美体/精油，服饰配件/皮带/帽子/围巾，彩妆/香水/美妆工具，珠宝/钻石/翡翠/黄金，饰品/流行首饰/时尚饰品新。</span>
      )
    } else if (query.channel_name === '买遍全球') {
      return (
        <div>
          <p>买遍全球频道为种草拔草一体化的进口好货发现频道，每一位达人都是海淘好货推荐官。如果你对海淘领域非常熟悉，并擅长向用户种草好货，买遍全球是最适合你的选择！</p>
          <p>所需内容类型：单品、帖子、搭配、短视频。</p>
        </div>
      )
    }
  }

  handleRequire = () => {
    const query = querystring.parse(this.props.location.search.substr(1));
    if (query.channel_name === '淘宝头条') {
      return (
        <span>有消费引导性的生活资讯文章</span>
      )
    } else if (query.channel_name === '微淘') {
      return (
        <span>有消费引导性的生活资讯文章</span>
      )
    } else if (query.channel_name === '有好货') {
      return (
        <div className={styles.channel_detail_text}>
          <p>一、基础要求：</p>
          <div>围绕单品进行创作，面向高消费力、追求格调、追求品质的人群，对这款商品用有趣，专业，睿智等风格的文案进行描述，测评，介绍，挖掘这个商品的卖点。</div>
          <p>二、参与作者要求：</p>
          <div>
            <p>1.非在线卖家</p>
            <p>2.大V层级≥创作达人（即创作达人或以上）</p>
            <p>3.达人30天发布内容数≥30篇</p>
            <p>4.认证达人申请通过时间≥90天</p>
            <p>5.达人质量分≥500</p>
            <p>6.达人指数分≥680</p>
          </div>
          <p>三、内容类型</p>
          <div>单品</div>
          <p>四、内容要求</p>
          <div>
            <p>1、商品基本调性：</p>
            <p>（1）有腔调：商品本身有调性，如原创设计款、海淘口碑商品，有品质有逼格；</p>
            <p>（2）有创意：本身有创意、较为新奇特，惊喜感较强；</p>
            <p>（3）有口碑：商品在该领域有口碑，或者是当前人群领域部分意见领袖挖掘的小众好货。</p>
            <p>以下类型商品不符合要求：</p>
            <p><i>l</i>商品与当前人群调性明显不符，或联系牵强；</p>
            <p><i>l</i>各大促销平台常见品牌及商品，即爆款；</p>
            <p><i>l</i>线下热门品牌及款式；</p>
            <p><i>l</i>高仿商品，商品外观、名称与大牌类似或雷同，既所谓的明星同款、大牌仿款，山寨货等；</p>
            <p><i>l</i>假货商品；</p>
            <p><i>l</i>普通红人款商品；</p>
            <p><i>l</i>价格低廉，外观粗糙，品质感差的商品。</p>
            <p>2、图片要求：</p>
            <p>尺寸：正方形，尺寸不小于500*500，最佳尺寸1080*1080；</p>
            <p>基本规范：</p>
            <p>（1）图片所示商品必须和标题、推荐理由，及宝贝详情页上的商品完全一致；</p>
            <p>白底图、场景图均可，主体突出、构图完整饱满，清晰度高，背景干净；</p>
            <p>（2）图片上必须无水印、无拼接、无logo、无多余文字；</p>
            <p>（3）一张图片只能展示一个主体（组合套装类商品除外），多种颜色商品，只能选一个颜色展示；</p>
            <p>（4）服饰类商品只能展示1个模特（情侣装和亲子装除外），慎用全身照；</p>
            <p>（5）请选择最能体现商品特点、功能的视角，让用户能一眼看出商品信息。</p>
          </div>
          <p>五、内容样例：</p>
          <div>作品链接：
            <a target="_blank" href="https://daren.bbs.taobao.com/detail.html?&postId=7895484">https://daren.bbs.taobao.com/detail.html?&postId=7895484</a>
          </div>
          <p>六、其他说明：</p>
          <div>
            <p>1、内容审核流程：机器审核</p>
            <p>2、作者旺旺交流群：1561521223</p>
          </div>
        </div>
      )
    } else if (query.channel_name === '生活研究所') {
      return (
        <div className={styles.channel_detail_text}>
          <p>一、基础要求：</p>
          <div>基于单款具体的商品（这款商品必须在淘宝有售），对这款商品用有趣，专业，睿智等风格的文案进行描述，测评，介绍，挖掘这个商品的卖点。</div>
          <p>二、参与作者要求：</p>
          <div>
            <p>淘宝内具有优秀内容撰写能力的大V达人。</p>
            <p>淘宝外具有撰写能力的自媒体人，机构。</p>
          </div>
          <p>三、内容类型</p>
          <div>单品</div>
          <p>四、内容要求</p>
          <div>
            <p>1、商品基本调性：</p>
            <p><i>l</i>有归属： 商品必须符合当前人群选品画像&特征，匹配该人群的喜好；</p>
            <p><i>l</i>有腔调：商品本身有调性，如原创设计款、海淘口碑商品，有品质有逼格；</p>
            <p><i>l</i>有特色：商品有明确的人群特色和代表性，如白富美人群—>大牌、奢侈品/小众高端品牌包包、香氛，限量款等；</p>
            <p><i>l</i>有创意：商品需符合当前人群外，且本身有创意、较为新奇特，惊喜感较强；</p>
            <p><i>l</i>有口碑：商品在该领域有口碑，或者是当前人群领域部分意见领袖挖掘的小众好货。</p>
            <p>以下类型商品不符合要求：</p>
            <p><i>l</i>商品与当前人群调性明显不符，或联系牵强；</p>
            <p><i>l</i>各大促销平台常见品牌及商品，即爆款；</p>
            <p><i>l</i>线下热门品牌及款式；</p>
            <p><i>l</i>高仿商品，商品外观、名称与大牌类似或雷同，既所谓的明星同款、大牌仿款，山寨货等；</p>
            <p><i>l</i>假货商品；</p>
            <p><i>l</i>普通红人款商品；</p>
            <p><i>l</i>价格低廉，外观粗糙，品质感差的商品。</p>
            <p>2、图片要求：</p>
            <p>尺寸：正方形，尺寸不小于500*500，最佳尺寸1080*1080；</p>
            <p>基本规范：</p>
            <p>（1）图片所示商品必须和标题、推荐理由，及宝贝详情页上的商品完全一致；</p>
            <p>白底图、场景图均可，主体突出、构图完整饱满，清晰度高，背景干净；</p>
            <p>（2）图片上必须无水印、无拼接、无logo、无多余文字；</p>
            <p>（3）一张图片只能展示一个主体（组合套装类商品除外），多种颜色商品，只能选一个颜色展示；</p>
            <p>（4）服饰类商品只能展示1个模特（情侣装和亲子装除外），慎用全身照；</p>
            <p>（5）请选择最能体现商品特点、功能的视角，让用户能一眼看出商品信息。</p>
          </div>
          <p>五、内容样例：</p>
          <div>作品链接：
            <a target="_blank" href="http://img02.taobaocdn.com/imgextra/i2/131250283332385306/TB2LuBEXeYC11Bjy1zkXXaZdXXa_!!2-martrix_bbs.png">http://img02.taobaocdn.com/imgextra/i2/131250283332385306/TB2LuBEXeYC11Bjy1zkXXaZdXXa_!!2-martrix_bbs.png</a>
          </div>
          <p>六、其他说明：</p>
          <div>
            <p>1、内容审核流程：机审+小二审核</p>
            <p>2、作者旺旺交流群：人群导购内容渠道大群：1534675403</p>
          </div>
        </div>
      )
    } else if (query.channel_name === '全球时尚') {
      return (
        <div className={styles.channel_detail_text}>
          <p>一、基础要求：</p>
          <div>
            <p>内容要求</p>
            <p>形式：</p>
            <p>目前全球时尚仅接收排版美观的热区图、帖子</p>
            <p>内容：</p>
            <p>1）满足一二线城市高端人群需求，展示高端、潮流等时尚icon的资讯内容；</p>
            <p>2）不支持普通促销类内容；需要用故事性、场景性内容包装货品；</p>
            <p>3）素材组织形式可多元化，如扒新品、扒穿搭、时尚趋势解读、时尚单品推荐、品牌故事、即时时尚资讯分享等</p>
          </div>
          <p>二、参与作者要求：</p>
          <div>
            全球时尚高端Maker（定向邀约）
          </div>
          <p>三、内容类型</p>
          <div>
            <p>目前全球时尚仅接收排版美观的热区图、帖子</p>
          </div>
          <div>
            <p><span style={{ background: '#f00' }}>内容规范psd：必看</span></p>
            <p><span style={{ background: '#f00' }}>内容必须要加30字的导语，</span></p>
            <p>
              <a target="_blank" href="https://space.dingtalk.com/c/ggHaACRjNzc3MDYxNi1jMDc5LTQ0Y2ItYWExZi0zNGVhNzFkMmM2YjECziK-mi8">https://space.dingtalk.com/c/ggHaACRjNzc3MDYxNi1jMDc5LTQ0Y2ItYWExZi0zNGVhNzFkMmM2YjECziK-mi8</a>
            </p>
          </div>
          <p>四、内容要求</p>
          <div>
            <p>内容定位：</p>
            <p>1．满足一二线城市高端人群需求，符合高端、时尚、潮流等调性的资讯内容；</p>
            <p>2．不支持普通促销类内容；需要用故事性、场景性内容包装货品；</p>
            <p>3．内容范围不限，如上新、穿搭教程、时尚趋势解读、时尚趋势推荐、品牌故事、即时时尚资讯分享等</p>
          </div>

          <div>
            <p>商家池：</p>
            <p>1.惊喜品牌池（涵盖大服饰、美妆、国际、直营，共约320个品牌）</p>
            <p>P.S.更新频次可视情况（收录新入驻优质品牌等）</p>
            <p>2.内容页推荐的商品，有且仅有女性商品</p>
            <p>3. 商品池严格按圈定的商家要求，不能出现不在池子里的商品（重点）</p>
          </div>

          <div>
            <p>视觉规范：</p>
            <p>封面图部分：</p>
            <p>https://img.alicdn.com/tfs/TB12OPffwMPMeJjy1XdXXasrXXa-690-688.png</p>
            <p>https://img.alicdn.com/tfs/TB1E_TIfwMPMeJjy1XcXXXpppXa-659-150.png</p>
            <p>https://img.alicdn.com/tfs/TB15yPffwMPMeJjy1XdXXasrXXa-644-503.png</p>
            <p>https://img.alicdn.com/tfs/TB1l5PffwMPMeJjy1XdXXasrXXa-715-541.png</p>
            <p>-保证调性统一：要求是静物摆拍图或扣出的单品图进行再排版设计（重点）</p>
            <p>-封面图中的商品与内容主题契合，且要与内容中的商品对应，商品所见即所得。如果不能完全对应的话，尽量做到相似款</p>
            <p>-封面图分辨率要清晰可见，不能出现商品边缘模糊等现象</p>
            <p>-封面图保持纯净静物图，不压字</p>
            <p>-首屏内容封面图片要左右满屏，不能出现一边图一边字或商品的情况</p>
          </div>
           <div>
            <p>详情页部分：</p>
            <p>-    内容详情页使用的图片不能是模糊的</p>
            <p>-    文字颜色不能大红大绿显得很突兀</p>
            <p>-    文字字体不能奇形怪状显得不庄重</p>
            <p>-    内容文字大小要适合阅读，建议24号字体(针对使用热区图的同学)</p>
            <p>-    注意图片比例适量，保证整体易读性，尽量降低阅读成本</p>
          </div>
          <p>五、内容样例：（样例能更直观、高效的引导达人产出优质内容）</p>
          <div>样例链接：
            <p>作品链接1：<a target="_blank" href="https://content.tmall.com/wow/pegasus/subject/65/2233054360/8153247?gccpm=14540363.600.11.subject-2199&id=8153247&wh_header=10&wh_middleheader=10">https://content.tmall.com/wow/pegasus/subject/65/2233054360/8153247?gccpm=14540363.600.11.subject-2199&id=8153247&wh_header=10&wh_middleheader=10</a></p>
            <p>作品链接2：<a target="_blank" href="https://content.tmall.com/wow/pegasus/subject/65/2980541927/8165473?gccpm=14559266.600.16.subject-2199&id=8165473&wh_header=10&wh_middleheader=10&followUserId=2879994894&followUserType=16&wh_followUserId=2879994894&wh_followUserType=16&rn=">https://content.tmall.com/wow/pegasus/subject/65/2980541927/8165473?gccpm=14559266.600.16.subject-2199&id=8165473&wh_header=10&wh_middleheader=10&followUserId=2879994894&followUserType=16&wh_followUserId=2879994894&wh_followUserType=16&rn=</a></p>
          </div>
          <p>六、其他说明：</p>
          <div>
            <p>1、内容审核时间（人审，两天内审核完毕）；</p>
            <p>2、作者交流群：高端maker钉钉群，定向邀约</p>
          </div>
        </div>
      )
    } else if (query.channel_name === 'ifashion') {
      return (
        <div className={styles.channel_detail_text}>
          <p>一、基础要求：</p>
          <div>
            <p>内容类型</p>
            <p>1．什么是好的内容？</p>
            <p>A、回归商品，用心整理时髦有调性商品帮助用户快速找到需要的东西或种草；</p>
            <p>B、主题针对明确的用户需求场景；</p>
            <p>C、帮助用户扫盲及介绍如何搭配，如何让自己生活更新潮</p>
            <p>D、选购分析的文案写到位，能真正对挑选商品起到帮助作用；</p>
          </div>
          <div>
            <p>2．内容形式 智能搭配</p>
            <p>智能搭配发布教程视频</p>
            <p><a target="_blank" href="https://daren.alicdn.com/vOFiMqAVbMTlAtg0VWP/zRAAWezSKCwGsykAFmJ%40%40sd.mp4">https://daren.alicdn.com/vOFiMqAVbMTlAtg0VWP/zRAAWezSKCwGsykAFmJ%40%40sd.mp4</a></p>
          </div>
          <div>
            <p style={{ color: '#f00' }}>搭配模版智能在以下2个模版中2选1，否则做不审核通过。</p>
            <p>模版1:左边模特场景，右边商品组合；模特场景：商品组合为1:1；如下图。</p>
            <p><img src="https://img.alicdn.com/imgextra/i3/2312644075/TB21Ut_eDJ_SKJjSZPiXXb3LpXa_!!2-martrix_bbs.png" /></p>
            <p>模版2:左边模特场景，右边商品组合；模特场景：商品组合为1:2；如下图。</p>
            <p>左侧模特扣白底图，抠图质量要高，保证人物完整，没有任何毛边杂质。</p>
            <p><img src="https://img.alicdn.com/imgextra/i1/2312644075/TB2P.Rcc6uhSKJjSspjXXci8VXa_!!2-martrix_bbs.png" /></p>
            <p>模特错误案例：</p>
            <p><img src="https://img.alicdn.com/imgextra/i4/2312644075/TB2oe9Eg3oQMeJjy0FnXXb8gFXa_!!2-martrix_bbs.png" /></p>
            <p><img src="https://img.alicdn.com/imgextra/i4/2312644075/TB2uV5Eg3MPMeJjy1XbXXcwxVXa_!!2-martrix_bbs.png" /></p>
            <p>商品错误案例</p>
            <p><img src="https://img.alicdn.com/imgextra/i2/2312644075/TB2Ow8mdE1HTKJjSZFmXXXeYFXa_!!2-martrix_bbs.png" /></p>
          </div>
          <p>三、招稿要求</p>
          <div>
            <p>a、达人要求： 潮女搭配师优先，有独立产生专业的相关内容的能力，所有内容均为原创</p>
            <p>1.商品所在店铺DSR评分不低于4.6；</p>
            <p>2.须符合《营销活动规则》</p>
          </div>
          <div>
            <p><span style={{ background: '#f00' }}>内容规范psd：必看</span></p>
            <p><span style={{ background: '#f00' }}>内容必须要加30字的导语，</span></p>
            <p>
              <a target="_blank" href="https://space.dingtalk.com/c/ggHaACRjNzc3MDYxNi1jMDc5LTQ0Y2ItYWExZi0zNGVhNzFkMmM2YjECziK-mi8">https://space.dingtalk.com/c/ggHaACRjNzc3MDYxNi1jMDc5LTQ0Y2ItYWExZi0zNGVhNzFkMmM2YjECziK-mi8</a>
            </p>
          </div>
          <p>四、机审规则</p>
          <div style={{ color: '#f00' }}>
            <p>商品数≥3</p>
            <p>标题字数≥5</p>
            <p>商品必须来自系统选品池</p>
          </div>
          <div>
            <span style={{ background: '#ff0'}}>3.选对应符合的分类标签，只能在品类，人群，风格里勾选自己合适的标签，只能勾选一个（全部只能1个），必须准确，不是越多越好，而是越准越好，这个牵涉到线上的场景投放，需要注意的是所有分类词即是一个场景，所以大家可以根据场景来投稿，如网红小粗跟，线上会有一个场景，里面会有很多关于粗跟鞋的内容贴，就是大家投放通过的内容，所以大家，可以每个场景都可以写内容同时注意：乱沟，取消1个月投稿资格</span>
            <p>
              <img src="https://img.alicdn.com/imgextra/i1/1130553628/TB2CnMgqrtlpuFjSspfXXXLUpXa_!!2-martrix_bbs.png" />
            </p>
          </div>
          <p>四、清退机制</p>
          <div>
            <p>每月一次排查，有符合以下清退条件的，将取消达人ifashion内容发布权限：</p>
            <p>1、不符合“ifashion达人”要求及投稿条件；</p>
            <p>2、入驻期间不活跃，近30天内发布的图文+搭配的内容数量少于10篇（通过审核的）；</p>
            <p>3、内容质量差，内容审核通过率低于50%；</p>
            <p>4、入驻期间出现恶劣的抄袭行为；</p>
            <p>5、入驻期间发布的内容有违法或者违规等行为。</p>
          </div>
          <div>
            <p>五，审核标准</p>
            <p>审核标准维度参考:</p>
            <p>图片质量：无牛皮藓，必须为白底图；</p>
            <p>文本质量：标题，文案，段落排布等</p>
            <p>商品质量分：参考商品新旧，商品调性，品质，可信度，口碑，卖家服务等</p>
            <p>内容健康度考核哪些维度：<a target="_blank" href="https://daren.bbs.taobao.com/detail.html?spm=0.0.0.0.oiGUiS&postId=7614100">https://daren.bbs.taobao.com/detail.html?spm=0.0.0.0.oiGUiS&postId=7614100</a></p>
            <p>内容质量分考核哪些维度：<a target="_blank" href="https://daren.bbs.taobao.com/detail.html?spm=a1z14.8284331.651450.22.KoYnwm&postId=6846903">https://daren.bbs.taobao.com/detail.html?spm=a1z14.8284331.651450.22.KoYnwm&postId=6846903</a></p>
            <p>提高内容质量分方法：<a target="_blank" href="https://daren.bbs.taobao.com/detail.html?spm=0.0.0.0.C6u1WS&postId=7614845">https://daren.bbs.taobao.com/detail.html?spm=0.0.0.0.C6u1WS&postId=7614845</a></p>
            <p>审核常见问题：<a target="_blank" href="https://daren.bbs.taobao.com/detail.html?postId=7772769">https://daren.bbs.taobao.com/detail.html?postId=7772769</a></p>
          </div>
          <div>
            <p>旺旺交流群：1639715526</p>
          </div>
        </div>
      )
    } else if (query.channel_name === '买遍全球') {
      return (
        <div className={styles.channel_detail_text}>
          <p>一、基础要求：</p>
          <div>
            <p>1.擅长品类：专业领域下有资深选品经验与撰稿经验，熟知中高端用户需求，理解消费升级趋势，对某个品类有深入的了解和鉴赏评定能力者优先。</p>
            <p>2.选品专业：有较强的品牌识别和选品能力，能挖掘并种草一般人不了解的品牌和商品。</p>
            <p>3.内容价值：所有内容必须是原创，文案撰写必须体现较强的商品鉴赏评定，和导购包装能力，有一定的美工基础。</p>
          </div>
            
          <p>二、达人要求及管理规范：</p>
          <div>
            <p>1.粉丝数>=20000，达人指数>=500，内容质量分>=500，账号活跃度>=50，非卖家账号</p>
            <p>2.提供在淘宝其他渠道发布的资讯、评测、搭配案例各2个并审核通过</p>
            <p>3.（选填）达人后台“统计-内容分析”页面，最近30天的数据页面完整截图</p>
            <p>4.（选填）如在淘系外其他平台有账号，请提供该平台个人主页链接及后台主页截图（需包含粉丝数）</p>
            <p>5.（选填）职业认证说明：职业相关的资格证书或工作证明，如有国家颁布的职业资格证书，请提供照片或扫描件</p>
            <p>6.频道达人管理规范：</p>
            <p>请见链接 https://woyao.bbs.taobao.com/detail.html?postId=8303068</p>
          </div>
          <div>
            <p>三、内容类型</p>
            <p>单品、帖子、搭配、短视频</p>
          </div>
          <div>
            <p>四、内容规范、内容样例、内容展示位置</p>
            <p>请见链接：https://woyao.bbs.taobao.com/detail.html?postId=7960106</p>
          </div>
        </div>
      )
    }
  }
  handleDeliver = () => {
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch(routerRedux.push(`/writer/task/create?channel_name=${query.channel_name}`));
  }
  render() {
    const query = querystring.parse(this.props.location.search.substr(1));
    let channelIcon = {
      img: 'http://gw.alicdn.com/tfscom/TB1OyT.RVXXXXcpXXXXXXXXXXXX.png',
      text: '帖子',
    }
    if (query.channel_name === '有好货') {
      channelIcon = {
        img: 'http://gw.alicdn.com/tfscom/TB1vDr2RVXXXXb2XpXXXXXXXXXX.png',
        text: '单品',
      }
    }
    return (
      <div>
        <Card bordered={false} style={{ textAlign: 'center', marginBottom: 20 }} bodyStyle={{ padding: 20 }}>
          <div className={styles.channelBox} onClick={this.handleDeliver}>
            <div className={styles.channelImgBox}>
              <img src={channelIcon.img} />
            </div>
            <div className={styles.channelNameBox}>{channelIcon.text}</div>
          </div>
          
        </Card>
        <Card bordered={false} bodyStyle={{ padding: 20 }}>
          <div className={styles.channel_box_title}>子频道介绍</div>
          <div className={styles.channel_detail}>
            {this.handleContent()}
          </div>
          <div className={styles.channel_box_title}>内容要求</div>
          <div className={styles.channel_detail}>
            {this.handleRequire()}
          </div>
        </Card>
      </div>
    );
  }
}
