import React, { PureComponent } from 'react';
import { connect } from 'dva';
import $ from 'jquery';
import { Icon, message, Tag, Button, Modal, Input, Tooltip, Badge } from 'antd';
import AuctionModal from './index.js';
import styles from './AnchorModal.less';

@connect(state => ({
  visible: state.album.anchorModal.visible,
  anchorKey: state.album.anchorModal.anchorKey,
  image: state.album.anchorModal.image,
  value: state.album.anchorModal.value,
}))
export default class AnchorModal extends PureComponent {
  state = {
    outerBoxWh: 300,
    wh: 22,
    x: -1,
    y: -1,
    move: false,
    addVisible: false,
    anchor: [],
    anchorData: {
      data: {},
    },
  }

  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.k === nextProps.anchorKey) {
      if (!this.props.visible && nextProps.visible) {
        if (nextProps.value) {
          this.setState({
            anchor: nextProps.value,
          });
        }
      } else if (this.props.visible && !nextProps.visible) {
          this.setState({
            anchor: [],
          });
      }
    }
  }
  
  handleOk = () => {
    
  }
  handleCancel = () => {
    this.props.dispatch({
      type: 'album/hideAnchor',
    });
  }
  fnPrevent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }
  handleSetOffset = (oX, oY) => {
    const { wh, outerBoxWh } = this.state;
    let x = oX, y = oY;
    if (x <= 0) x = 0;
    if (y <= 0) y = 0;
    if ((x + wh) > outerBoxWh) x = outerBoxWh - wh;
    if ((y + wh) > outerBoxWh) y = outerBoxWh - wh;
    this.setState({
      x, y,
      addVisible: true,
      anchorData: {
        ...this.state.anchorData,
        type: 'item',
        x: parseInt((x + wh/2) / 3),
        y: parseInt((y + wh/2) / 3),
      },
    });
  }
  handleAddNewOffset = (e) => {
    const { wh, outerBoxWh } = this.state;
    let x = e.pageX - $(e.target).offset().left - wh/2;
    let y = e.pageY - $(e.target).offset().top - wh/2;
    this.handleSetOffset(x, y);
  }
  handleChangeAnchorOffset = (e) => {
    this.fnPrevent(e);
  }
  handleAnchorMouseDown = (e) => {
    this.fnPrevent(e);
    this.setState({
      move: true,
    });
    window.onmouseup = this.handleAnchorMouseUp;
    window.onmousemove = this.handleAnchorMouseMove;
  }
  handleAnchorMouseUp = (e) => {
    this.fnPrevent(e);
    this.setState({
      move: false,
    });
    window.onmouseup = null;
    window.onmousemove = null;
  }
  handleAnchorMouseMove = (e) => {
    const { wh, move, outerBoxWh } = this.state;
    this.fnPrevent(e);
    if (move) {
      let x = e.pageX - $(this.refs.imageBox).offset().left - wh/2;
      let y = e.pageY - $(this.refs.imageBox).offset().top - wh/2;
      if (x <= 0) x = 0;
      if (y <= 0) y = 0;
      if ((x + wh) > outerBoxWh) x = outerBoxWh - wh;
      if ((y + wh) > outerBoxWh) y = outerBoxWh - wh;
      this.handleSetOffset(x, y);
    }
      
  }
  handleChangeAuctionTag = (e) => {
    const anchorData = Object.assign({}, this.state.anchorData);
    anchorData.data.title = e.target.value;
    this.setState({
      anchorData,
    });
  }
  handleAddNewAnchor = () => {
    const { anchor, anchorData, anchorData: { data } } = this.state;
    if (!data.url) {
      message.destroy();
      message.warn('请添加一个商品');
    } else if (!data.title.trim()) {
      message.warn('请输入宝贝标签');
    } else {
      let newAnchor = Object.assign({}, anchor);
      const index = anchor.findIndex(item => item.x === anchorData.x && item.y === anchorData.y);
      if (index === -1) {
        newAnchor.push(this.state.anchorData);
      } else {
        newAnchor[index] = this.state.anchorData;
      }
    }
  }
  handleShowAuctionModal = () => {
    this.props.dispatch({
      type: 'auction/show',
      payload: { currentKey: this.props.anchorKey }
    });
  }
  renderAddBox = () => {
    const { anchorData: { data } } = this.state;
    return (
      <div className={styles.outerAddBox}>
        <p>添加商品</p>
        <div className={styles.addAuctionBox}>
          {data.url ?
            <div>
              <img src={data.coverUrl} />
            </div> :
            <div className={styles.uploadBox} onClick={this.handleShowAuctionModal}>
              <Icon type="plus" className={styles.uploadIcon} />
              <p>添加宝贝</p>
            </div>
          }
        </div>
        <p>宝贝标签</p>
        <div className={styles.addAuctionTag}>
          <Input
            value={data.title || ''}
            onChange={this.handleChangeAuctionTag}
            placeholder="请输入不超过6个汉字"
            maxLength="6"
          />
        </div>
        <div style={{marginTop: 10}}>
          <Button onClick={this.handleAddNewAnchor}>{'添加'}</Button>
        </div>
      </div>
    )
  }
  handleAddProduct = (auction) => {
    const data = {
      ...this.state.anchorData.data,
      coverUrl: auction.coverUrl,
      finalPricePc: 0,
      finalPriceWap: 0,
      images: auction.images,
      itemId: auction.item.itemId,
      materialId: auction.materialId,
      price: auction.item.finalPrice,
      rawTitle: auction.title,
      resourceUrl: auction.item.itemUrl,
      url: auction.item.itemUrl,
    };
    const anchorData = Object.assign({}, this.state.anchorData);
    anchorData.data = data;
    this.setState({
      anchorData,
    });
  }
  render() {
    const { image, visible, anchors } = this.props;
    const { x, y, addVisible } = this.state;
    return (
      <div>
        <Modal
          title="添加搭配图"
          width="800px"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          bodyStyle={{ padding: '20px' }}
          maskClosable={false}
        >
          <div className={styles.anchorOuterBox}>
            <div ref="imageBox" className={styles.imageBox} onClick={this.handleAddNewOffset}>
              { image &&
                <img src={image} />
              }
              { y >= 0 && x >= 0 &&
                <div
                  className={styles.offsetBox}
                  style={{transform: `translate(${x}px, ${y}px)`}}
                  onClick={this.handleChangeAnchorOffset}
                  onMouseDown={this.handleAnchorMouseDown}
                >
                </div>
              }
              <div className={styles.anchorTagsBox}>
                <Badge status="warning" text={<span className={styles.anchorTags}>aaaaaaa</span>} />
              </div>
            </div>
            <div className={styles.anchorInnerBox}>
              { addVisible ?
                <div>
                  {this.renderAddBox()}
                </div> :
                <div style={{padding: '120px 0 0 60px', fontSize: 18, color: '#888'}}>
                  <p>请在左侧选择合适的位置点击添加宝贝标签</p>
                  <p>请添加3~6个标签</p>
                </div>
              }
            </div>
          </div>
        </Modal>
        <AuctionModal k={this.props.k} onOk={this.handleAddProduct} />
      </div>
    );
  }
}
