import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Modal, message } from 'antd';
import styles from './index.less';
import $ from 'jquery';
export default class SignBox extends PureComponent {
  state = {
    signValue: ''
  }
  componentDidMount() {
    this.setState({
      signValue: this.props.signContent.message
    })
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      signValue: nextProps.signContent.message
    })
  }
  creatComment = () => {
    const { direction, parentWidth } = this.props;
    const bgColors = ['#1abc9c','#3498db','#8e44ad','#34495e','#16a085','#f1c40f','#e74c3c','#f39c12','#2980b9','#d35400'];
    const n = parseInt(Math.random()*(bgColors.length - 1));
    let nWidth = '';
    if( direction.x > parentWidth/2 ){
      nWidth = `${parentWidth - direction.x}px`;
    }
    const commentMsg = {
      'message': this.refs.signInput.value,
      'left': direction.x,
      'top': direction.y,
      'background': bgColors[n],
      'width': nWidth,
    };
    this.setState({
      signValue: ''
    })
    $(this.refs.signInput).val('');
    this.props.sureChange(commentMsg);
  }
  closeBox = () => {
    $(this.refs.signInput).val('');
    this.props.close();
  }
  render() {
    const { signVisible, close, sureChange, direction, signContent } = this.props;
    const { action, signValue } = this.state;
    console.log(signValue);
    return (
      <div className={styles.signBox} style={{ display: signVisible ? 'block' : 'none', top: direction.y}}>
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
