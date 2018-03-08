import React, { PureComponent } from 'react';
import { connect } from 'dva';
import $ from 'jquery';
import { Icon, message, Tag, Button, Modal, Input, Tooltip, Badge } from 'antd';
import Anchor from './Anchor.js';
import styles from './index.less';

@connect(state => ({
  visible: state.album.anchorModal.visible,
  anchorKey: state.album.anchorModal.anchorKey,
  image: state.album.anchorModal.image,
  value: state.album.anchorModal.value,
  index: state.album.anchorModal.index,
}))
export default class AnchorModal extends PureComponent {
  state = {
    outerBoxWh: 300,
    wh: 22,
    x: -1,
    y: -1,
    move: false,
    addVisible: false,
    anchors: [],
    anchorData: {},
  }

  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.k === nextProps.anchorKey) {
      if (!this.props.visible && nextProps.visible) {
        if (nextProps.value && nextProps.value.anchors) {
          this.setState({
            anchors: nextProps.value.anchors,
          });
        }
      } else if (this.props.visible && !nextProps.visible) {
        this.setState({
          anchors: [],
          addVisible: false,
          x: -1,
          y: -1,
        });
      }
    }
  }
  
  handleOk = () => {
    const anchorChild = {
      anchors: this.state.anchors,
      hotSpaces: [],
      url: this.props.image,
    };
    if (this.props.onChange) this.props.onChange(anchorChild, this.props.index);
    this.props.dispatch({
      type: 'album/hideAnchor',
      payload: {
        anchorKey: '',
        image: '',
        value: {},
      }
    });
  }
  handleCancel = () => {
    this.props.dispatch({
      type: 'album/hideAnchor',
      payload: {
        anchorKey: '',
        image: '',
        value: {},
      }
    });
  }
  fnPrevent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }
  handleSetOffset = (oX, oY, key) => {
    const { wh, outerBoxWh, anchorData, anchors } = this.state;
    let x = oX, y = oY;
    if (x <= 0) x = 0;
    if (y <= 0) y = 0;
    if ((x + wh) > outerBoxWh) x = outerBoxWh - wh;
    if ((y + wh) > outerBoxWh) y = outerBoxWh - wh;
    let newAnchorData = {
      data: { ...this.state.anchorData.data },
      type: 'item',
      x: parseInt((x + wh/2) / outerBoxWh * 100),
      y: parseInt((y + wh/2) / outerBoxWh * 100),
    }
    if (key === 'add' || anchors.find(item => item.data.title === anchorData.data.title)) {
      newAnchorData.data = {};
    }
    this.setState({
      x, y,
      addVisible: true,
      anchorData: {...newAnchorData},
    });
  }
  handleAddNewOffset = (e) => {
    if (this.state.anchors.length < this.props.props.maxAnchors) {
      const { wh, outerBoxWh } = this.state;
      let x = e.pageX - $(e.target).offset().left - wh/2;
      let y = e.pageY - $(e.target).offset().top - wh/2;
      this.handleSetOffset(x, y, 'add');
    }
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
      this.handleSetOffset(x, y, 'move');
    }
  }
  handleAddAnchor = (data, key) => {
    const { anchorData } = this.state;
    if (key === 'add') {
      let newAnchors = Object.assign([], this.state.anchors);
      const newAnchorData = { ...this.state.anchorData, data };
      const index = newAnchors.findIndex(item => item.x === newAnchorData.x && item.y === newAnchorData.y);
      if (index === -1) {
        newAnchors.push(newAnchorData);
      } else {
        newAnchors.splice(index, 1, newAnchorData);
      }
      this.setState({
        addVisible: false,
        anchors: newAnchors,
        anchorData: {},
        x: -1,
        y: -1,
      });
    } else if (key === 'delete') {
      let newAnchors = Object.assign([], this.state.anchors);
      const index = newAnchors.findIndex(item => item.x === anchorData.x && item.y === anchorData.y);
      if (index >= 0) {
        newAnchors.splice(index, 1);
      }
      this.setState({
        addVisible: false,
        anchors: newAnchors,
        anchorData: {},
        x: -1,
        y: -1,
      });
    }
  }
  handleChangeAuction = (e, anchor) => {
    this.fnPrevent(e);
    this.setState({
      addVisible: true,
      anchorData: { ...anchor },
    });
  }
  render() {
    const { props, image, visible } = this.props;
    const { wh, x, y, addVisible, anchors, outerBoxWh } = this.state;
    return (
      <div>
        <Modal
          title="添加搭配图"
          width="800px"
          visible={visible}
          onCancel={this.handleCancel}
          bodyStyle={{ padding: 20 }}
          maskClosable={false}
          footer={[
            <Button key="cancel" onClick={this.handleCancel}>取消</Button>,
            <Button disabled={anchors && anchors.length >= props.minAnchors ? false : true} key="ok" type="primary" onClick={this.handleOk}>
              确定
            </Button>,
          ]}
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
                +
                </div>
              }
              <div style={{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}}>
                {anchors && anchors.map((item, index) => {
                  const thisY = (item.y / 100 * outerBoxWh) - wh/2;
                  const thisX = (item.x / 100 * outerBoxWh) - wh/2;
                  return (
                    <div
                      key={index}
                      className={styles.anchorTagsBox}
                      onClick={(e) => this.handleChangeAuction(e, item)}
                      style={{top: thisY, left: item.x < 50 ? thisX : 'auto', right: item.x > 50 ? (outerBoxWh - thisX - wh) : 'auto'}}>
                    <Badge status="warning" className={styles.anchorTagsDian} style={{float: item.x < 50 ? 'left' : 'right'}} />
                    <span className={styles.anchorTags}>
                      {item.data && item.data.title ? item.data.title : ''}
                    </span>
                  </div>)
                })}
              </div>
            </div>
            <div className={styles.anchorInnerBox}>
              { addVisible ?
                <div>
                  <Anchor onChange={this.handleAddAnchor} data={this.state.anchorData.data || {}} />
                </div> :
                <div style={{padding: '120px 0 0 60px', fontSize: 18, color: '#888'}}>
                  <p>请在左侧选择合适的位置点击添加宝贝标签</p>
                  <p>{`请添加${props.minAnchors}~${props.maxAnchors}个标签`}</p>
                </div>
              }
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
