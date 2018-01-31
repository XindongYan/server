import React, { PureComponent } from 'react';
import { connect } from 'dva';
import $ from 'jquery';
import { Row, Col, Card, Modal, message, Icon, Button, Input, Tabs, Spin, Pagination, Tag } from 'antd';
import styles from './index.less';
import { searchNew7, queryQumai } from '../../services/tool';
import { queryYhhBody } from '../../services/task';

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
    choose: '',
    addLoading: false,
    actsLoading: true,
    itemList: [],
    visible: false,
    pagination: {
      pageSize: 18,
      current: 1,
      total: 0,
    },
    auctionChoose: null,
    q_score: '',
    new7: '',
    search: '',
    qumai: '',
    activeKey: 'add',
  }
  componentDidMount() {
    // queryYhhBody({resourceUrl: '//item.taobao.com/item.htm?id=546883095427'}).then(result => {
    //   console.log(result);
    // });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.k === nextProps.currentKey) {
      if (!this.props.visible && nextProps.visible) {
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
        nicaiCrx.removeEventListener('setVersion', this.setVersion);
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
      })
    }
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
    })
    if (!e.target.value) {
      this.setState({
        choose: '',
        auctionChoose: null,
      })
    }
  }
  handleClear = () => {
    this.setState({
      search: '',
      choose: '',
      auctionChoose: null,
      new7: '',
      q_score: '',
      qumai: '',
    })
  }
  handleAddAuction = (value) => {
    this.setState({
      choose: '',
      auctionChoose: null,
    })
    if (value) {
      this.setState({
        addLoading: true,
      });
      this.handleSetTags(value);
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
      <Card style={{ width: 120, display: 'inline-block', margin: '2px 4px', cursor: 'pointer' }} onClick={() => this.handleChooseAuction(auction)} bodyStyle={{ padding: 0 }} key={auction.id} >
        <div className={styles.customImageBox}>
          <img className={styles.customImage} src={auction.url} />
          { this.state.auctionChoose && auction.id === this.state.auctionChoose.id &&
            <div className={styles.customImgZz}><Icon type="check" /></div>
          }
        </div>
        <div className={styles.auctionCard}>
          <p className={styles.auctionNodes}>{auction.title}</p>
          <p className={styles.auctionNodes} style={{ margin: '3px 0', color: '#555' }}>¥{auction.item.finalPrice}</p>
          <p className={styles.auctionNodes}>{auction.item.taoKeDisplayPrice}</p>
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
    })
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
        // const sevenResult = await searchNew7({text: `https:${result.data.item.itemUrl}`});
        // const qumaiResult = await queryQumai({text: result.data.item.itemUrl});
        // const index1 = qumaiResult.data.htmls.indexOf('有好货已入库');
        // const index2 = qumaiResult.data.htmls.indexOf('条');
        // if(sevenResult.data && sevenResult.data.length > 0 ){
        //   const new7 = sevenResult.data[0].icon.find(item => /新7条/.test(item.innerText)) ? '符合新七条' : '不符合新七条';
        //   this.setState({
        //     addLoading: false,
        //     qumai: qumaiResult.data.htmls.substring(index1, index2+1),
        //     q_score: sevenResult.data[0].q_score,
        //     new7: new7,
        //     choose: result.data.images && result.data.images.length > 0 ? result.data.images[0] : '',
        //     auctionChoose: result.data,
        //   });
        // } else {
          this.setState({
            choose: result.data.images && result.data.images.length > 0 ? result.data.images[0] : '',
            auctionChoose: result.data,
          });
        // }
      }
    }
  }
  handleSetTags = async (url) => {
    const sevenResult = await searchNew7({text: `https:${url}`});
    const qumaiResult = await queryQumai({text: url});
    const index1 = qumaiResult.data.htmls.indexOf('有好货已入库');
    const index2 = qumaiResult.data.htmls.indexOf('条');
    if(sevenResult.data && sevenResult.data.length > 0 ){
      const new7 = sevenResult.data[0].icon.find(item => /新7条/.test(item.innerText)) ? '符合新七条' : '不符合新七条';
      this.setState({
        addLoading: false,
        actsLoading: false,
        qumai: qumaiResult.data.htmls.substring(index1, index2+1),
        q_score: sevenResult.data[0].q_score,
        new7: new7
      });
    }
  }
  handleChooseImg = (photo) => {
    this.setState({
      choose: photo,
    })
  }
  handleOk = () => {
    if (this.state.auctionChoose) {
      const img = this.state.choose || this.state.auctionChoose.coverUrl;
      if (this.props.onOk) this.props.onOk(this.state.auctionChoose, img);
      this.setState({
        choose: '',
        auctionChoose: null,
        search: '',
      })
    }
    this.props.dispatch({
      type: 'auction/hide',
    });
  }

  handleChooseAuction = (auction) => {
    // auctionChoose
    this.setState({
      new7: '',
      q_score: '',
      qumai: '',
      actsLoading: true,
      auctionChoose: auction,
      choose: auction.images && auction.images.length > 0 ? auction.images[0] : auction.coverUrl,
      search: auction.item ? auction.item.itemUrl : '',
    });
    this.handleSetTags(auction.item.itemUrl);
  }

  handleChangeTab = (e) =>{
    if (e === 'commodities') {
      this.handleGetAuction({ pageSize: this.state.pagination.pageSize, current: 1 });
    }
    this.setState({
      activeKey: e
    })
  }
  handleChangeTabpane = () =>{
    
    this.setState({
      activeKey: 'add'
    }, () => {
      console.log(this.state.activeKey)
    })
  }
  addAuction = () => {
    const { visible, k } = this.props;
    const { search, itemList, pagination, addLoading, auctionChoose, q_score, new7, qumai } = this.state;
    const Tags = auctionChoose ? <div style={{ margin: '5px 0' }}>
      <Tag style={{ cursor: 'default' }} color="red">价格 ¥{auctionChoose.item.finalPrice}</Tag>
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
    </div> : '';
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
        { auctionChoose &&
          <div>
            <div style={{ margin: '10px 0' }}>
              <p>{auctionChoose.title}</p>
              {Tags}
              { k !== 'material' &&
                <p>选择商品主图：</p>
              }
            </div>
            <div className={styles.showBox}>
              { k !== 'material' ?
                 auctionChoose.images.map((item, index) => <div className={styles.imgBox} key={index} onClick={() => this.handleChooseImg(item)}>
                    <img src={item} />
                    { item === this.state.choose &&
                      <div className={styles.imgChoose}>
                        <Icon type="check" />
                      </div>
                    }
                  </div>)
                
              : <a href={auctionChoose.item.itemUrl} target="_blank">
                <img src={auctionChoose.coverUrl} style={{ width: 120, height: 120, }} />
              </a>
              }
            </div>
          </div>
        }
      </Spin>
        
    </div>)
  }
  render() {
    const { visible, k, currentKey } = this.props;
    const { itemList, pagination, actsLoading, activeKey } = this.state;
    const tabBarExtraContent = this.props.product ? this.props.product : 0;
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
            tabBarExtraContent={<div style={{ width: 570, lineHeight: '44px' }}><a onClick={this.handleChangeTabpane} target="_blank" href={`https://we.taobao.com/material/square/detail?kxuanParam={"nested":"we","id":"${tabBarExtraContent}"}`}>选品池</a></div>}
            activeKey={activeKey}
            onChange={this.handleChangeTab}
          >
            <TabPane tab={<span>添加商品</span>} key="add">
              {this.addAuction()}
            </TabPane>
            <TabPane tab={<span>商品库</span>} key="commodities">
              <div>
                <div>
                  
                </div>
                <div style={{ height: 300, overflow: 'auto'}}>
                  <Spin spinning={actsLoading}>
                    {itemList.map(this.renderAuctions)}
                  </Spin>
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
              </div>
            </TabPane>
          </Tabs>
          : this.addAuction()
        }
      </Modal>
    );
  }
}
