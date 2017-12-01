import React, { PureComponent } from 'react';
import { connect } from 'dva';
import $ from 'jquery';
import { Card, Modal, message } from 'antd';
import styles from './index.less';


function fnDragStart(e) {
  console.log(this)
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
    fnDragStart()
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
        onMouseDown={this.dragStart}
        onMouseMove={this.dragMove}
        onMouseUp={this.dragEnd}
      >
        {msg.message}
      </div>
    );
  }
}
