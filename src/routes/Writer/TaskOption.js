import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Card, Button, Popconfirm, message, Row, Col } from 'antd';
import { CHANNEL_NAMES } from '../../constants';
import WeitaoForm from '../../components/Forms/WeitaoForm';
import TaskChat from '../../components/TaskChat';
import styles from './TaskOption.less';

@connect(state => ({

}))

export default class TaskOption extends PureComponent {
  state = {

  }
  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {

  }
  handleDeliver = (value) => {
    const task_type = value === '直播脚本' ? 3 : 1;
    window.scrollTo(0, 0);
    if (value === '直播脚本') {
      this.props.dispatch(routerRedux.push(`/writer/task/create?channel_name=${value}&task_type=${task_type}`));
    } else {
      this.props.dispatch(routerRedux.push(`/writer/task/channel?channel_name=${value}&task_type=${task_type}`));
    }
  }
  render() {
    const cardList = [{
      name: '淘宝头条',
      box_text: '日常活动',
      img: 'https://img.alicdn.com/tfs/TB15kxjaWagSKJjy0FgXXcRqFXa-200-200.png',
      detail: '打造中国最大的生活消费资讯平台，建立一个用户、媒体/自媒体、品牌，触达彼此、互相信任的消费信息生态。如果你热爱生活，对个人消费拥有独到品味和见解，乐于分享专业知识，那不论你是个人，是媒体或是品牌组织，我们都欢迎你来加入。『用内容引领消费！』所需内容类型：不局限于文字、画面、声音、视频等等任何一种载体，只要“优秀”！'
    }, {
      name: '微淘',
      box_text: '日常活动',
      img: 'https://img.alicdn.com/tfs/TB1D3lPSFXXXXX0XXXXXXXXXXXX-180-180.png',
      detail: '微淘话题是淘宝内容化升级的新产品。该产品以构建内容场景为主，利用全域流量对消费者做精准分发：系统根据消费者的在线行为，一旦触发条件，相关微淘话题立即曝光；同时微淘话题也是达人从创作内容到运营内容参与模式的全新体验。'
    }, {
      name: '有好货',
      box_text: '新单品-测试',
      img: 'https://img.alicdn.com/tfs/TB16mgvRVXXXXXPXpXXXXXXXXXX-200-200.png',
      detail: '网罗天下高逼格好物的商品推荐平台，品质生活指南。'
    }, {
      name: '生活研究所',
      box_text: '内容频道',
      img: 'https://img.alicdn.com/tfs/TB1ahIzRVXXXXb4XXXXXXXXXXXX-200-200.png',
      detail: '淘宝第一个垂直细分的导购产品，不局限于专业货品的挖掘，引导用户在细分垂直人群领域里获得专业知识进阶。 若你在某个细分领域十分专业，欢迎加入我们这个精准的粉丝运营阵地~ 所需内容类型：单品、图文帖子、优选。'
    }, {
      name: '全球时尚',
      box_text: '首页card-全球时尚',
      img: 'https://img.alicdn.com/tfs/TB1Cg5QdwoQMeJjy0FnXXb8gFXa-100-100.png',
      detail: '汇集优质的时尚领域内容，以时尚指南、潮流资讯等栏目打造用户所喜爱的女性内容导购频道。',
    }, {
    //   name: 'iFashion',
    //   box_text: '首页card ifashion',
    //   img: 'https://img.alicdn.com/tfs/TB10zj.SFXXXXadXXXXXXXXXXXX-100-100.png',
    //   detail: '汇集优质的时尚领域内容，以时尚指南、潮流资讯等栏目打造用户所喜爱的女性内容导购频道。',
    // }, {
      name: '直播脚本',
      box_text: '直播脚本',
      img: '//img.alicdn.com/imgextra/i1/2597324045/TB2SYu2m3vD8KJjSsplXXaIEFXa_!!2597324045-2-daren.png_294x430q90.jpg',
      detail: ''
    }];
    return (
      <div>
        {
          cardList.map( (item, index) => 
            <Card key={index} bodyStyle={{ background: '#fff', padding: 20 }} style={{ marginBottom: 20 }}>
              <div className={styles.option_box_top}>
                <div className={styles.option_box_img}>
                  <img src={item.img} alt={item.name} />
                </div>
                <div className={styles.option_box_detail}>
                  <h3>{item.name}</h3>
                  <div className={styles.option_desc}>{item.detail}</div>
                </div>
              </div>
              <div className={styles.option_children_title}>
                投稿到子频道
              </div>
              <div style={{ display: 'flex' }} onClick={() => this.handleDeliver(item.name)}>
                <div className={styles.option_choose_box}>
                  <p style={{ height: 40, lineHeight: '40px' }}>{item.box_text}</p>
                </div>
              </div>
            </Card>
          )
        }
      </div>
    );
  }
}
