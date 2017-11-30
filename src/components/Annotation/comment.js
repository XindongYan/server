import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Modal, message } from 'antd';
import styles from './index.less';
export default class Comment extends PureComponent {
  state = {
    signContent:''
  }
  componentDidMount() {
    
  }
  componentWillReceiveProps(nextProps) {

  }
  render() {
    const { msg, editComment } = this.props;
    console.log(msg)
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
        {msg.message}
      </div>
    );
  }
}
