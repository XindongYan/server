import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Modal, message } from 'antd';
import styles from './index.less';
import $ from 'jquery';
export default class SignBox extends PureComponent {
  state = {
    signValue: ''
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      signValue: nextProps.signContent.message || '',
    })
  }

  fnPrevent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }
  creatComment = () => {
    const { direction, parentWidth } = this.props;
    const bgColors = ['#1abc9c','#f39c12','#3498db','#e74c3c'];
    let n = this.props.approve_step;
    if ( this.props.approve_status === 1 ) {
      n = 0;
    }
    let nWidth = '';
    if( direction.x > parentWidth/2 ){
      nWidth = `${parentWidth - direction.x}px`;
    }
    let commentMsg = {};
    if (this.state.signValue){
      commentMsg = {
        'message': this.refs.signInput.value,
        'left': direction.x,
        'top': direction.y,
        'background': bgColors[n],
        'width': nWidth,
      };
    }
    this.setState({
      signValue: ''
    })
    $(this.refs.signInput).val('');
    this.props.sureChange(commentMsg);
  }
  closeBox = () => {
    this.setState({
      signValue: ''
    });
    this.props.close();
  }
  render() {
    const { signVisible, close, sureChange, direction, signContent, boxSize } = this.props;
    const { action, signValue } = this.state;
    return (
      <div
        className={styles.signBox}
        style={{
          display: signVisible ? 'block' : 'none',
          top: direction.y + $(this.refs.signBox).outerHeight() > boxSize ? boxSize - $(this.refs.signBox).outerHeight() : direction.y
        }}
        onContextMenu={this.fnPrevent}
        onClick={this.fnPrevent}
        ref="signBox"
      >
        <div className={styles.SignTit}>批注
          <div className={styles.outSignbox} onClick={this.closeBox}>X</div>
        </div>
        <textarea
          placeholder="在这里输入批注"
          onChange={(e) => {this.setState({signValue: e.target.value})}}
          className={styles.signInput}
          value={signValue}
          ref="signInput"
        >
        </textarea>
        <div className={styles.sureSign} onClick={this.creatComment}>确定</div>
      </div> 
    );
  }
}
