import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import querystring from 'querystring';
import url from 'url';
import { Card, Button, Menu } from 'antd';
import styles from './TaskChannel.less';
import { CHANNELS } from '../../constants/taobao';
import { TASK_TYPES } from '../../constants';

function BlockCommon(props) {
  const { btnText, btnUrl, img, infoList, title } = props;
  return (
    <div className={styles['creator-creation-block-common']} style={{ width: 488, marginBottom: 20 }}>
      <div className={styles['block-common-img']}><img src={img}/></div>
      <div className={styles['block-common-detail']}>
      <h3>{title}</h3>
      {infoList.map((item, index) =>
        <div className={styles['block-common-item']} key={index}>
          <label>{item.label}</label>
          {item.textList.map((item1, index1) =>
            item1.url ?
            <div className={styles['block-common-item-desc']} key={index1}>
              <a href={item1.url} target="_blank" style={{ fontSize: 12, display: 'block' }}>{item1.text}</a>
            </div>:
            <div className={styles['block-common-item-desc']} key={index1}>
              {item1.text}
            </div>
          )}
        </div>
      )}
      <Button type="primary" onClick={() => props.onDeliver(btnUrl)} className={styles['block-common-btn']}>
        {btnText}
      </Button>
      </div>
    </div>
  );
}


@connect(state => ({
  taskChannel: state.auction.taskChannel,
}))

export default class TaskChannel extends PureComponent {
  state = {
    currentKey: 'post',
  }

  handleDeliverWeitao = (btnUrl) => {
    const query = querystring.parse(this.props.location.search.substr(1));
    const urlObj = url.parse(btnUrl);
    const tempQuery = querystring.parse(urlObj.query);
    const newQuery = { ...query, ...tempQuery };
    this.props.dispatch(routerRedux.push(`/writer/task/create?${querystring.stringify(newQuery)}`));
  }
  handleDeliver = (template) => {
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch(routerRedux.push(`/writer/task/create?channelId=${query.channelId}&activityId=${query.activityId}&template=${template}`));
  }
  handleGetTemplate = () => {
    const query = querystring.parse(this.props.location.search.substr(1));
    let templates = [];
    CHANNELS.forEach(item => {
      item.activityList.forEach(item1 => {
        if (item1.id == query.activityId) {
          templates = item1.templates || [];
        }
      });
    });
    return templates;
  }
  renderTemplateBox = (template) => {
    const taskType = TASK_TYPES.find(item => item.template === template);
    return (
      <div key={template} className={styles.channelBox} onClick={() => this.handleDeliver(template)}>
        <div className={styles.channelImgBox}>
          <img src={taskType.logo} />
        </div>
        <div className={styles.channelNameBox}>{taskType.text}</div>
      </div>
    )
  }
  handleClick = (e) => {
    this.setState({
      currentKey: e.key,
    });
  }
  renderWeitaoChannel = () => {
    const weitao = {
      "description": "内容质量与粉丝效果好的微淘可以得到更多频道曝光",
      "linkText": "",
      "linkUrl": "",
      "tabList": [{
        "blockList": [{
          "component": "BlockCommon",
          "props": {
            "btnText": "立即创作",
            "btnUrl": "//we.taobao.com/creation/post?template=post&from=draft",
            "img": "//img.alicdn.com/tfs/TB1gM9FXeOSBuNjy0FdXXbDnVXa-280-498.png",
            "infoList": [{
              "label": "模板描述：",
              "textList": [{
                "text": "创作自由度高，多元素组件灵活编辑。优质的长文章更容易黏住消费者产生持续回访 "
              }]
            }, {
              "label": "创作指导：",
              "textList": [{
                "text": "",
                "url": ""
              }]
            }],
            "title": "长文章"
          }
        // }, {
        //   "component": "BlockCommon",
        //   "props": {
        //     "btnText": "立即创作",
        //     "btnUrl": "//we.taobao.com/creation2/post?template=itemrank&from=draft",
        //     "img": "//img.alicdn.com/tfs/TB1tHkkXmBYBeNjy0FeXXbnmFXa-280-498.png",
        //     "infoList": [{
        //       "label": "模板描述：",
        //       "textList": [{
        //         "text": "针对某一主题快速生成有明确排行理由的商品榜单内容，有助于粉丝进行同类型的商品对比，快速种草和产生消费行为"
        //       }]
        //     }, {
        //       "label": "创作指导：",
        //       "textList": [{
        //         "text": "商品排行内容怎么写？",
        //         "url": "https://docs.alipay.com/alibaba_we_guide/guide/pmhg3s"
        //       }]
        //     }],
        //     "title": "商品排行"
        //   }
        // }, {
        //   "component": "BlockCommon",
        //   "props": {
        //     "btnText": "立即创作",
        //     "btnUrl": "//we.taobao.com/creation2/post?template=iteminventory&from=draft",
        //     "img": "//img.alicdn.com/tfs/TB1sbkkXmBYBeNjy0FeXXbnmFXa-280-498.png",
        //     "infoList": [{
        //       "label": "模板描述：",
        //       "textList": [{
        //         "text": "针对某一细分场景、主题非常契合的商品进行推荐。好的内容将帮助粉丝对该主题下的商品产生购买行为"
        //       }]
        //     }, {
        //       "label": "创作指导：",
        //       "textList": [{
        //         "text": "商品推荐内容应该怎么写？",
        //         "url": "https://docs.alipay.com/alibaba_we_guide/guide/oqa3o2"
        //       }]
        //     }],
        //     "title": "商品推荐"
        //   }
        // }, {
        //   "component": "BlockCommon",
        //   "props": {
        //     "btnText": "立即创作",
        //     "btnUrl": "//we.taobao.com/creation2/post?template=shopinventory&from=draft",
        //     "img": "//img.alicdn.com/tfs/TB1pI1CXh9YBuNjy0FfXXXIsVXa-280-498.png",
        //     "infoList": [{
        //       "label": "模板描述：",
        //       "textList": [{
        //         "text": "针对某一场景、主题的同类型店铺推荐内容，好的内容将帮助粉丝更好的了解对比同类型的店铺"
        //       }]
        //     }, {
        //       "label": "创作指导：",
        //       "textList": [{
        //         "text": "店铺推荐内容应该怎么写？",
        //         "url": "https://docs.alipay.com/alibaba_we_guide/guide/fdz9hu"
        //       }]
        //     }],
        //     "title": "店铺推荐"
        //   }
        }],
        "icon": "//gw.alicdn.com/tfscom/TB1OyT.RVXXXXcpXXXXXXXXXXXX.png",
        "title": "帖子",
        "key": "post"
      }, {
      //   "blockList": [{
      //     "component": "BlockCommon",
      //     "props": {
      //       "btnText": "立即创作",
      //       "btnUrl": "//we.taobao.com/creation/post?template=video2&from=draft",
      //       "img": "//img.alicdn.com/tfs/TB1hlTbXeuSBuNjy1XcXXcYjFXa-280-498.png",
      //       "infoList": [{
      //         "label": "模板描述：",
      //         "textList": [{
      //           "text": "创作自由度高，优质多样的视频内容将提升粉丝的浏览和受欢迎度"
      //         }]
      //       }, {
      //         "label": "创作指导：",
      //         "textList": [{
      //           "text": "如何发一篇优质短视频内容？",
      //           "url": "https://docs.alipay.com/alibaba_we_guide/guide/qcuk4n"
      //         }]
      //       }],
      //       "title": "短视频"
      //     }
      //   }],
      //   "icon": "//gw.alicdn.com/tfscom/TB1toY.RVXXXXcuXXXXXXXXXXXX.png",
      //   "title": "短视频",
      //   "key": "video"
      // }, {
        "blockList": [{
          "component": "BlockCommon",
          "props": {
            "btnText": "立即创作",
            "btnUrl": "//we.taobao.com/creation/post?template=collection2",
            "img": "//img.alicdn.com/tfs/TB1LczaXgmTBuNjy1XbXXaMrVXa-280-498.png",
            "infoList": [{
              "label": "模板描述：",
              "textList": [{
                "text": "较高自由度的搭配模板，创作者自行上传搭配的完成图，自由在图片上添加标签。可上传多个带有标签的搭配图片"
              }]
            }],
            "title": "场景搭配"
          }
        }, {
          "component": "BlockCommon",
          "props": {
            "btnText": "立即创作",
            "btnUrl": "//we.taobao.com/creation/post?template=magiccollocation&from=draft",
            "img": "//img.alicdn.com/tfs/TB1cFLXXkyWBuNjy0FpXXassXXa-280-498.png",
            "infoList": [{
              "label": "模板描述：",
              "textList": [{
                "text": "系统提供拼图工具，可以更快的生产一张精美的搭配图，在图片的编辑过程中，工具还能提供宝贝选择、抠图、编辑等功能。"
              }]
            }],
            "title": "拼图搭配"
          }
        }],
        "icon": "//img.alicdn.com/tfs/TB1_xpuXf5TBuNjSspcXXbnGFXa-56-56.png",
        "title": "搭配",
        "key": "collection"
      }, {
        "blockList": [{
          "component": "BlockCommon",
          "props": {
            "btnText": "立即创作",
            "btnUrl": "//we.taobao.com/creation/post?template=item2&from=draft",
            "img": "//img.alicdn.com/tfs/TB1hvEuXeuSBuNjy1XcXXcYjFXa-280-498.png",
            "infoList": [{
              "label": "模板描述：",
              "textList": [{
                "text": "围绕单个宝贝的亮点、使用心得展开介绍。好的内容将让粉丝对该商品种草"
              }]
            }],
            "title": "好货心得"
          }
        }, {
          "component": "BlockPublishItemGroup",
          "props": {
            "icon": "http//",
            "text": "好货心得内容成组发布",
            "tips": "设为待推送的内容，可以在『发微淘-好货心得』批量发布至微淘，最多3条内容形成合辑，单个合辑占用1条发布限额。"
          }
        }],
        "icon": "//gw.alicdn.com/tfscom/TB1vDr2RVXXXXb2XpXXXXXXXXXX.png",
        "summary": {
          "text": "今日还可发布单品组数",
          "usableCount": 0
        },
        "title": "单品",
        "key": "item"
      // }, {
      //   "blockList": [{
      //     "component": "BlockCommon",
      //     "props": {
      //       "btnText": "立即创作",
      //       "btnUrl": "//we.taobao.com/creation/post?template=qa&from=draft",
      //       "img": "//img.alicdn.com/tfs/TB1rbbXXkyWBuNjy0FpXXassXXa-280-498.png",
      //       "infoList": [{
      //         "label": "模板描述：",
      //         "textList": [{
      //           "text": "发起一场问题答疑的互动，和粉丝近距离的互动交流，帮助你更好的了解粉丝需要什么。"
      //         }]
      //       }, {
      //         "label": "创作指导：",
      //         "textList": [{
      //           "text": "如何做好一场问答？",
      //           "url": "https://docs.alipay.com/alibaba_we_guide/guide/cl6tv5"
      //         }]
      //       }],
      //       "title": "互动问答"
      //     }
      //   }],
      //   "icon": "//gw.alicdn.com/tfs/TB1pHQHff6H8KJjy0FjXXaXepXa-140-140.png",
      //   "title": "问答",
      //   "key": "answer"
      }],
      "title": "发布新微淘"
    };
    const activity = weitao.tabList.find(item => item.key === this.state.currentKey);
    return (
      <div>
        <Card bodyStyle={{ paddingBottom: 0 }}>
          <span style={{fontSize: 16, marginRight: 20}}>{weitao.title}</span>
          <span style={{fontSize: 12, color: '#999'}}>{weitao.description} <a target="_blank" href={weitao.linkUrl}>{weitao.linkText}</a></span>
          <Menu
            style={{ marginTop: 20, borderBottom: 'none' }}
            onClick={this.handleClick}
            selectedKeys={[this.state.currentKey]}
            mode="horizontal"
          >
            {weitao.tabList.map(item =>
              <Menu.Item key={item.key}>
                <img style={{ width: 30, marginRight: 10 }} src={item.icon}/>{item.title}
              </Menu.Item>)}
          </Menu>
        </Card>
        <Card style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {activity.blockList.map((item, index) => {
              if (item.component === 'BlockCommon') {
                return <BlockCommon key={index} {...item.props} onDeliver={this.handleDeliverWeitao}/>;
              } else if (item.component === 'BlockPublishItemGroup') {
                return null;
              }
              return null;
            })}
          </div>
        </Card>
      </div>
    );
  }
  render() {
    const { taskChannel } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    const details = taskChannel.filter(item => item.id == query.activityId);
    const detail = details && details.length > 0 ? details[0] : {};
    return (
      <div>
        { query.channelId === '-1' ? this.renderWeitaoChannel() :
          <div>
            <Card bordered={false} style={{ marginBottom: 20 }}  bodyStyle={{ padding: 20 }}>
              {this.handleGetTemplate().map(item => this.renderTemplateBox(item))}
            </Card>
            <Card bordered={false} bodyStyle={{ padding: 20 }}>
              {detail.desc && <div>
                <div className={styles.channel_box_title}>子频道介绍</div>
                <div className={styles.channel_detail} dangerouslySetInnerHTML={{__html: detail.desc}}></div>
              </div>}
              {detail.qualifyList && <div>
                <div className={styles.channel_box_title}>作者要求</div>
                <div className={styles.channel_detail}>
                  {detail.qualifyList.map((item, index) => <p key={index}>{item}</p>)}
                </div>
              </div>}
              {detail.rule && <div>
                <div className={styles.channel_box_title}>内容要求</div>
                <div className={styles.channel_detail} dangerouslySetInnerHTML={{__html: detail.rule}}></div>
              </div>}
            </Card>
          </div>
        }
      </div>
    );
  }
}
