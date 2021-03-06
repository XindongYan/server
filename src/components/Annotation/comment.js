import React, { PureComponent } from 'react';
import { connect } from 'dva';
import $ from 'jquery';
import { Card, Modal, message } from 'antd';
import styles from './index.less';


function fnDragStart(e) {
  console.log(e)
}
export default class Comment extends PureComponent {
  state = {
    signContent:''
  }
  componentDidMount() {
    
  }
  componentWillReceiveProps(nextProps) {

  }
  dragStart = (e) => {
    fnDragStart(e);
  }
  render() {
    const { msg, editComment, boxSize } = this.props;
    return (
      <div 
        className={styles.commentBox}
        style={{ 
          left: Number(msg.left),
          top: Number(msg.top),
          background: msg.background,
          maxWidth: msg.width,
        }}
        alte={msg.message}
        onContextMenu={editComment}
      >
        {/*
          <div className={styles.commentLeft}></div>
        <div
          className={styles.commentMiddle}
          onMouseDown={this.dragStart}
          onMouseMove={this.dragMove}
          onMouseUp={this.dragEnd}
        ></div>
        <div className={styles.commentRight}></div>
        */}
        {msg.message}
      </div>
    );
  }
}
