import React, { PureComponent } from 'react';
import { connect } from 'dva';
import $ from 'jquery';
import { Icon, message, Row, Col, Tag, Button, Modal, Switch, Radio, Input } from 'antd';
import AuctionModal from './index.js';
import styles from './AnchorModal.less';

const RadioGroup = Radio.Group;

@connect(state => ({
  visible: state.album.anchorModal.visible,
  anchorKey: state.album.anchorModal.anchorKey,
  image: state.album.anchorModal.image,
  anchors: state.album.anchorModal.anchors,
}))
export default class AnchorModal extends PureComponent {
  state = {
    x: -1,
    y: -1,
  }

  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.k === nextProps.anchorKey) {
      if (!this.props.visible && nextProps.visible) {

      } else if (this.props.visible && !nextProps.visible) {

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
  handleAddNewAnchor = (e) => {
    const wh = 22;
    const x = e.pageX - $(e.target).offset().left - wh/2;
    const y = e.pageY - $(e.target).offset().top - wh/2;
    this.setState({
      x,
      y,
    });
  }
  handleChangeAnchorOffset = (e) => {
    this.fnPrevent()
  }
  handleAnchorMousedown = (e) => {

  }
  render() {
    const { image, visible, anchors } = this.props;
    const { x, y } = this.state;
    return (
      <div>
        <Modal
          title="添加搭配图"
          width="800px"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          bodyStyle={{ padding: '20px' }}
        >
          <div className={styles.anchorOuterBox}>
            <div className={styles.imageBox} onClick={this.handleAddNewAnchor}>
              { image &&
                <img src={image} />
              }
              { x && y && x >= 0 &&
                <div
                  className={styles.offsetBox}
                  style={{left: x, top: y}}
                  onClick={this.handleChange}
                  onmousedown={this.handleAnchorMousedown}
                >
                </div>
              }
            </div>
            <div className={styles.anchorInnerBox}>
              { anchors && anchors.length > 0 ?
                <div></div> :
                <div style={{padding: '120px 0 0 60px', fontSize: 18, color: '#888'}}>
                  <p>请在左侧选择合适的位置点击添加宝贝标签</p>
                  <p>请添加3~6个标签</p>
                </div>
              }
            </div>
          </div>
        </Modal>
        <AuctionModal />
      </div>
    );
  }
}
