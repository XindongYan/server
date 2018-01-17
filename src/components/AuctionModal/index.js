import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Modal, message, Icon, Button, Input, Tabs, Spin, Pagination } from 'antd';
import styles from './index.less';

const TabPane = Tabs.TabPane;
const Search = Input.Search;

@connect(state => ({
  visible: state.auction.visible,
  currentKey: state.auction.currentKey,
}))
  
export default class AuctionModal extends PureComponent {
  state = {
    innerText: null,
    nicaiCrx: null,
    version: '',
    choose: '',
    loading: true,
    itemList: [],
    visible: false,
    pagination: {
      pageSize: 18,
      current: 1,
      total: 0,
    },
    auctionChoose: null,
  }
  componentDidMount() {
    
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.k === nextProps.currentKey) {
      if (!this.props.visible && nextProps.visible) {
        const nicaiCrx = document.getElementById('nicaiCrx');
        if (nextProps.k !== 'Material') {
          nicaiCrx.addEventListener('setVersion', this.setVersion);
          nicaiCrx.addEventListener('setAuction', this.setAuction);
          nicaiCrx.addEventListener('resultAuction', this.resultAuction);
          if (!this.state.nicaiCrx) {
            this.setState({ nicaiCrx }, () => {
              setTimeout(() => {
                this.handleGetVersion();
              }, 400);
            });
          }
          setTimeout(() => {
            if(!this.state.version && !this.state.innerText){
              message.destroy();
              message.warn('请安装尼采创作平台插件！');
              this.setState({ loading: false });
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
    } else {
      this.setState({
        innerText: data,
      })
    }
    if (data.error) {
      message.warn(data.msg);
      this.setState({
        loading: false,
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
        loading: false,
      });
    } else {
      message.destroy();
      message.warn(data.msg);
      this.setState({
        loading: false,
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

  handleAddAuction = (value) => {
    this.setState({
      choose: '',
      auctionChoose: null,
    })
    if (value) {
      this.state.nicaiCrx.innerText = JSON.stringify(value);
      const customEvent = document.createEvent('Event');
      customEvent.initEvent('uploadAuction', true, true);
      this.state.nicaiCrx.dispatchEvent(customEvent);
    } else {
      message.warn('请输入商品链接');
    }
  }
  renderPhoto = (auction) => {
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
      this.setState({ loading: true });
      this.handleGetAuction({
        pageSize,
        current,
      });
    }
  }
  resultAuction = (e) => {
    const result = JSON.parse(e.target.innerText);
    if (this.props.k === this.props.currentKey) {
      if (result.error) {
        message.error(result.msg)
      } else {
        this.setState({
          choose: result.data.images && result.data.images.length > 0 ? result.data.images[0] : '',
          auctionChoose: result.data,
        })
      }
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
    }
    this.props.dispatch({
      type: 'auction/hide',
    });
  }

  handleChooseAuction = (auction) => {
    // auctionChoose
    this.setState({
      auctionChoose: auction,
      choose: auction.images && auction.images.length > 0 ? auction.images[0] : auction.coverUrl,
    })
  }
  addAuction = () => {
    const { visible, k } = this.props;
    const { itemList, pagination, loading, auctionChoose } = this.state;
    return (<div style={{ padding: 10, height: 300 }}>
      <div>
        <Search
          placeholder="输入商品链接"
          onSearch={this.handleAddAuction}
          enterButton
        />
      </div>
      { auctionChoose &&
        <div>
          <div style={{ margin: '10px 0' }}>
            <p>{auctionChoose.title}</p>
            <p>价格：¥ {auctionChoose.item.finalPrice}</p>
            <p>{auctionChoose.item.taoKeDisplayPrice}</p>
            { k !== 'Material' &&
              <p>选择商品主图：</p>
            }
          </div>
          <div className={styles.showBox}>
            { k !== 'Material' ?
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
    </div>)
  }
  render() {
    const { visible, k, currentKey } = this.props;
    const { itemList, pagination, loading } = this.state;
    const activeKey = k === 'Material' ? 'add' : 'commodities';
    return (
      <Modal
        title="添加宝贝"
        width="850px"
        visible={k === currentKey && visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        bodyStyle={{ padding: '5px 20px' }}
      >
        { k !== 'Material' ?
          <Tabs defaultActiveKey={activeKey} onChange={this.handleChangeTab}>
            <TabPane tab={<span>素材库</span>} key="commodities">
              <div>
                <div>
                  <Spin spinning={loading}>
                    {itemList.map(this.renderPhoto)}
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
            <TabPane tab={<span>添加宝贝</span>} key="add">
              {this.addAuction()}
            </TabPane>
          </Tabs>
          : this.addAuction()
        }
      </Modal>
    );
  }
}
