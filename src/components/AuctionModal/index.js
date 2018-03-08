import React, { PureComponent } from 'react';
import { connect } from 'dva';
import url from 'url';
import querystring from 'querystring';
import { Row, Col, Card, Modal, message, Icon, Button, Input, Tabs, Spin, Pagination, Tag, Switch } from 'antd';
import styles from './index.less';
import { searchNew7, queryQumai } from '../../services/tool';
import { queryYhhBody } from '../../services/task';
import CoverModal from './CoverModal.js'

const TabPane = Tabs.TabPane;
const Search = Input.Search;

@connect(state => ({
  visible: state.auction.visible,
  currentKey: state.auction.currentKey,
}))
  
export default class AuctionModal extends PureComponent {
  state = {
    nicaiCrx: null,
    version: '',
    addLoading: false,
    actsLoading: true,
    itemList: [],
    visible: false,
    pagination: {
      pageSize: 18,
      current: 1,
      total: 0,
    },
    auctionChoose: {},
    q_score: '',
    new7: '',
    search: '',
    qumai: '',
    activeKey: 'add',
  }
  componentDidMount() {
    
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.k === nextProps.currentKey) {
      if (!this.props.visible && nextProps.visible) {

        this.setState({
          auctionChoose: {},
          search: '',
        });
        const nicaiCrx = document.getElementById('nicaiCrx');
        if (nextProps.k !== 'material') {
          nicaiCrx.addEventListener('setVersion', this.setVersion);
          nicaiCrx.addEventListener('setAuction', this.setAuction);
          nicaiCrx.addEventListener('resultAuction', this.resultAuction);
          if (!this.state.nicaiCrx) {
            this.setState({ nicaiCrx }, () => {
              setTimeout(() => {
                this.handleGetVersion();
              }, 600);
            });
          }
          setTimeout(() => {
            if(!this.state.version){
              message.destroy();
              message.warn('请安装尼采创作平台插件！');
              this.setState({ actsLoading: false });
            }
          }, 5000);
        } else {
          nicaiCrx.addEventListener('resultAuction', this.resultAuction);
          if (!this.state.nicaiCrx) {
            this.setState({ nicaiCrx });
          }
        }
      } else if (this.props.visible && !nextProps.visible) {
        const nicaiCrx = document.getElementById('nicaiCrx');
        nicaiCrx.removeEventListener('setAuction', this.setAuction);
        nicaiCrx.removeEventListener('resultAuction', this.resultAuction);
        this.setState({
          nicaiCrx: null,
        });
      }
    }
  }

  handleGetVersion = () => {
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getVersion', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  setVersion = (e) => {
    const { pagination } = this.state;
    const data = JSON.parse(this.state.nicaiCrx.innerText);
    if (data.version) {
      this.setState({
        version: data.version,
      });
    }
    nicaiCrx.removeEventListener('setVersion', this.setVersion);
    if (data.error) {
      message.destroy();
      message.warn(data.msg, 60 * 60);
      this.setState({
        actsLoading: false,
      });
    } else {
      this.handleGetAuction({ pageSize: pagination.pageSize, current: 1 });
    }
  }
  setAuction = (e) => {
    const data = JSON.parse(e.target.innerText);
    if (!data.error) {
      this.setState({
        itemList: data.itemList || [],
        pagination: {
          pageSize: data.pageSize,
          current: data.current,
          total: data.total,
        },
        actsLoading: false,
        addLoading: false,
      });
    } else {
      message.destroy();
      message.warn(data.msg, 60 * 60);
      this.setState({
        actsLoading: false,
      });
    }
  }
  handleGetAuction = (params) => {
    this.state.nicaiCrx.innerText = JSON.stringify(params);
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getAuction', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  handleCancel = () => {
    this.props.dispatch({
      type: 'auction/hide',
    });
  }
  handleSearchChange = (e) => {
    this.setState({
      search: e.target.value,
    });
    if (!e.target.value) {
      this.setState({
        auctionChoose: {},
      });
    }
  }
  handleClear = () => {
    this.setState({
      search: '',
      auctionChoose: {},
      new7: '',
      q_score: '',
      qumai: '',
    });
  }
  handleAddAuction = (value) => {
    this.setState({
      auctionChoose: {},
    });
    if (value) {
      const urlobject = url.parse(value);
      const urlQuery = querystring.parse(urlobject.query);
      this.handleSetTags(value, urlQuery.id);
      this.state.nicaiCrx.innerText = JSON.stringify(value);
      const customEvent = document.createEvent('Event');
      customEvent.initEvent('uploadAuction', true, true);
      this.state.nicaiCrx.dispatchEvent(customEvent);
    } else {
      message.warn('请输入商品链接');
    }
  }
  renderAuctions = (auction) => {
    return (
      <Card style={{ width: 120, display: 'inline-block', margin: '2px 4px', cursor: 'pointer', position: 'relative' }} bodyStyle={{ padding: 0 }} key={auction.id} >
        { auction.item.displayStatus && auction.item.displayStatus !== '正常' &&
          <div className={styles.displayStatus}>选品不符</div>
        }
        <div onClick={() => this.handleChooseAuction(auction)}>
          <div className={styles.customImageBox}>
            <img className={styles.customImage} src={auction.url} />
            { this.state.auctionChoose && auction.id === this.state.auctionChoose.id &&
              <div className={styles.customImgZz}><Icon type="check" /></div>
            }
          </div>
          <div className={styles.auctionCard}>
            <p className={styles.auctionNodes}>{auction.title}</p>
            <p className={styles.auctionNodes} style={{ margin: '3px 0', color: '#555' }}>¥{auction.item.finalPrice || auction.item.reservedPrice}</p>
            <p className={styles.auctionNodes}>{auction.item.taoKeDisplayPrice}</p>
          </div>
        </div>
      </Card>
    );
  }
  changeAuctionPage = (current, pageSize) => {
    this.setState({
      pagination: {
        ...this.state.pagination,
        current,
        pageSize,
      }
    });
    if (this.state.nicaiCrx) {
      this.setState({ actsLoading: true });
      this.handleGetAuction({
        pageSize,
        current,
      });
    }
  }
  resultAuction = async (e) => {
    const result = JSON.parse(e.target.innerText);
    if (this.props.k === this.props.currentKey) {
      if (result.error) {
        message.error(result.msg)
      } else {
        this.setState({
          auctionChoose: result.data,
        });
      }
    }
  }
  handleSetTags = async (url, id) => {
    let newUrl = url;
    if (!/^((http:)|(https:))/.test(newUrl)) {
      newUrl = `https:${newUrl}`;
    }
    const sevenResult = await searchNew7({text: newUrl});
    const qumaiResult = await queryQumai({text: newUrl});
    if ( this.props.k === 'havegoods') {
      const yhhResult = await queryYhhBody({itemId: id});
      const yhhList = yhhResult.list && yhhResult.list.length > 0 ? true : false;
      if (yhhList) {
        Modal.warning({
          title: '该商品在平台内已经被其它人写过，建议选择其它商品。',
        });
      }
    }
    const index1 = qumaiResult.data.htmls.indexOf('有好货已入库');
    const index2 = qumaiResult.data.htmls.indexOf('条');
    if(sevenResult.data && sevenResult.data.length > 0 ){
      const new7 = sevenResult.data[0].icon.find(item => /新7条/.test(item.innerText)) ? '符合新七条' : '不符合新七条';
      this.setState({
        qumai: qumaiResult.data.htmls.substring(index1, index2+1),
        q_score: sevenResult.data[0].q_score,
        new7: new7,
      });
    }
  }
  handleOk = () => {
    if (this.state.auctionChoose && this.state.auctionChoose.url) {
      if (this.props.k === 'material' || this.props.k === 'havegoods' || this.props.k === 'Anchor') {
        if (this.props.onOk) this.props.onOk(this.state.auctionChoose);
        this.props.dispatch({
          type: 'auction/hide',
        });
      } else {
        this.props.dispatch({
          type: 'album/showCover',
          payload: {
            coverKey: `auction_${this.props.currentKey}`,
            auction: this.state.auctionChoose,
          }
        });
      }
    } else {
      this.props.dispatch({
        type: 'auction/hide',
      });
    }
  }

  handleChooseAuction = (auction) => {
    this.setState({
      new7: '',
      q_score: '',
      qumai: '',
      auctionChoose: auction,
      search: auction.item ? auction.item.itemUrl : '',
    });
    this.handleSetTags(auction.item.itemUrl, auction.item.itemId);
  }

  handleChangeTab = (e) =>{
    if (e === 'commodities') {
      this.handleGetAuction({ pageSize: this.state.pagination.pageSize, current: 1 });
    }
    this.setState({
      activeKey: e,
    });
  }
  handleChangeTabpane = () =>{
    this.setState({
      activeKey: 'add'
    });
  }
  handelCutout = () => {
    
  }
  renderAddAuction = () => {
    const { visible, k } = this.props;
    const { search, itemList, pagination, addLoading, auctionChoose, q_score, new7, qumai } = this.state;
    return (<div style={{ padding: 10, height: 300 }}>
      <div style={{ position: 'relative' }}>
        <Search
          placeholder="输入商品链接"
          value={search}
          onSearch={this.handleAddAuction}
          onChange={this.handleSearchChange}
          enterButton
        />
        <Icon
          onClick={this.handleClear}
          type="close-circle"
          style={{ position: 'absolute', right: 55, top: 6, zIndex: 2, fontSize: 18, cursor: 'pointer' }}
        />
      </div>
      <Spin spinning={addLoading} style={{ width: '100%', height: 220, lineHeight: '220px' }}>
        { auctionChoose && auctionChoose.title &&
          <div style={{ margin: '10px 0' }}>
            <p>{auctionChoose.title}</p>
            <div style={{ margin: '5px 0' }}>
              <Tag style={{ cursor: 'default' }} color="red">价格 ¥{auctionChoose.item.finalPrice || auction.item.reservedPrice}</Tag>
              <Tag style={{ cursor: 'default' }} color="orange">佣金 {auctionChoose.item.taoKeDisplayPrice.substring(5)}</Tag>
              { new7 &&
                <Tag style={{ cursor: 'default' }} color="blue">{new7}</Tag>
              }
              { q_score &&
                <Tag style={{ cursor: 'default' }} color="volcano">{q_score}</Tag>
              }
              { qumai &&
                <Tag style={{ cursor: 'default' }} color="purple">{qumai}</Tag>
              }
            </div>
            { auctionChoose && auctionChoose.title &&
              this.renderAuctions(auctionChoose)
            }
          </div>
        }
      </Spin>
    </div>)
  }
  handleChooseCover = (coverUrl, title) => {
    const auction = this.state.auctionChoose;
    auction.coverUrl = coverUrl;
    auction.title = title;
    if (this.props.onOk) this.props.onOk(auction);
    this.props.dispatch({
      type: 'auction/hide',
    });
  }
  handleGetKuaixuanId = async () => {
    const { activityId } = this.props;
    const taskChannel = await fetch(`/jsons/taskChannel.json`).then(response => response.json());
    const kuaixuanUrl = taskChannel.find(item => {return item.selectItemData ? item.selectItemData.url : ''});
    if (kuaixuanUrl) {
      return kuaixuanUrl;
    } else {
      return 'https://we.taobao.com/material/square/detail?kxuanParam=%7B%22nested%22%3A%22we%22%2C%22id%22%3A%220%22%7D';
    }
  }
  render() {
    const { visible, k, currentKey, activityId } = this.props;
    const { itemList, pagination, actsLoading, activeKey, auctionChoose, q_score, new7, qumai } = this.state;
    const kuaixuan = this.handleGetKuaixuanId();
    return (
      <Modal
        title="添加商品"
        width="850px"
        visible={k === currentKey && visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        bodyStyle={{ padding: '5px 20px' }}
        style={{ top: 20 }}
      >
        { k !== 'material' ?
          <Tabs
            tabBarExtraContent={<div style={{ width: 570, lineHeight: '44px' }}><a onClick={this.handleChangeTabpane} target="_blank" href={kuaixuan}>选品池</a></div>}
            activeKey={activeKey}
            onChange={this.handleChangeTab}
          >
            <TabPane tab={<span>添加商品</span>} key="add">
              {this.renderAddAuction()}
            </TabPane>
            <TabPane tab={<span>商品库</span>} key="commodities">
              <div>
                <Spin spinning={actsLoading}>
                  { auctionChoose && auctionChoose.title && <div style={{ marginBottom: 10 }}>
                    <div style={{ margin: '5px 0' }}>
                      <Tag style={{ cursor: 'default' }} color="red">价格 ¥{auctionChoose.item.finalPrice || auction.item.reservedPrice}</Tag>
                      <Tag style={{ cursor: 'default' }} color="orange">佣金 {auctionChoose.item.taoKeDisplayPrice.substring(5)}</Tag>
                      { new7 &&
                        <Tag style={{ cursor: 'default' }} color="blue">{new7}</Tag>
                      }
                      { q_score &&
                        <Tag style={{ cursor: 'default' }} color="volcano">{q_score}</Tag>
                      }
                      { qumai &&
                        <Tag style={{ cursor: 'default' }} color="purple">{qumai}</Tag>
                      }
                    </div>
                  </div>
                  }
                  <div style={{ height: 300, overflow: 'auto'}}>
                    {itemList.map(this.renderAuctions)}
                  </div>
                  <Pagination
                    {...{
                      showSizeChanger: true,
                      showQuickJumper: true,
                      ...pagination,
                    }}
                    onChange={this.changeAuctionPage}
                    onShowSizeChange={this.changeAuctionPage}
                    style={{float: 'right', margin: '10px 20px'}}
                  />
                </Spin>
              </div>
              <CoverModal k={`auction_${this.props.k}`} onOk={this.handleChooseCover} />
            </TabPane>
          </Tabs>
          : this.renderAddAuction()
        }
      </Modal>
    );
  }
}
