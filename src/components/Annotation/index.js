import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Modal, message, Button } from 'antd';
import $ from 'jquery';
import styles from './index.less';
import SignBox from './signBox.js';
import Comment from './comment.js';
export default class Annotation extends PureComponent {
  state = {
    action: [],
    boxPosition: {
      left: 0,
      top: 0
    },
    direction: {
      x: 0,
      y: 0,
      visible: 'none',
    },
    signVisible: false,
    commentContent: [],
    editIndex: -1,
    signContent: '',
    status: '',
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {

  }
  fnPrevent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }
  fnClickDefult = (e) => {
    this.setState({
      direction: {
        ...this.state.direction,
        visible: 'none',
      },
      signVisible: false,
    });
  }
  fnContextMenu = (e) => {
    e.preventDefault();
    this.setState({
      action: [
        {'name': '添加','value': 'add'},
      ],
      boxPosition: {
        left: $(e.target).offset().left,
        top: $(e.target).offset().top,
      },
      direction: {
        x: (e.pageX - $(e.target).offset().left),
        y: (e.pageY - $(e.target).offset().top),
        visible: 'block',
      },
      signVisible: false,
    }, (state) => {
      const {action, boxPosition, direction } = this.state;
    });
  }
  operation = (value) => {
    this.setState({
      status: value,
    })
    if(value==='add'){
      this.setState({
        direction: {...this.state.direction, visible: 'none'},
        signContent: {},
      },() => {
        this.setState({signVisible: true})
      })
    }
    if (value==='edit') {
      const { commentContent, editIndex } = this.state;
      this.setState({
        direction: {...this.state.direction, visible: 'none'},
        signVisible: true,
        signContent: commentContent[editIndex]
      })
    }
    if (value==='delete') {
      const { commentContent, editIndex } = this.state;
      commentContent.splice(editIndex,1);
      this.setState({
        direction: {...this.state.direction, visible: 'none'},
      })
    }
  }
  creatBox = (key) => {
    return (
      <Button
        key={key.value}
        size="small"
        style={{width: '100%', zIndex: '2333'}}
        onClick={() => this.operation(key.value)}
        onContextMenu={this.fnPrevent}
      >
        {key.name}
      </Button>
    );
  }
  hideSignBox = () => {
    this.setState({
      signVisible: false
    })
  }
  sureChange = (commentMsg) => {
    const { status, editIndex, commentContent } = this.state;
    if(status === 'add'){
      this.setState({
        signVisible: false,
        commentContent: [...this.state.commentContent, commentMsg],
      })
    } else if(status === 'edit') {
      const newComment = { ...commentContent[editIndex], message: commentMsg.message };
      commentContent.splice(editIndex,1,newComment);
      this.setState({
        signVisible: false,
      })
    }
  }
  editComment = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      action: [
        {'name': '编辑','value': 'edit'},
        {'name': '删除','value': 'delete'},
      ],
      direction: {
        x: (e.pageX - $(this.refs.AnnotationBox).offset().left),
        y: (e.pageY - $(this.refs.AnnotationBox).offset().top),
        visible: 'block',
      },
      editIndex: index,
    })
  }
  render() {
    const { action, direction, signVisible, commentContent, signContent } = this.state;
    return (
      <div style={{ 'width': '500px', 'height': '600px', 'position': 'relative' }} ref="myTextInput">
        <div
          ref="AnnotationBox"
          className={styles.AnnotationBox}
          onContextMenu={this.fnContextMenu}
          onClick={this.fnClickDefult}
        >
          <div className={styles.selectBox} style={{ left: direction.x, top: direction.y, display: direction.visible}}>
            {action.map(this.creatBox)}
          </div>
          <SignBox
            direction={direction}
            sureChange={this.sureChange}
            close={this.hideSignBox}
            signVisible={signVisible}
            parentWidth={$(this.refs.AnnotationBox).outerWidth()}
            signContent={signContent}
          />
          {commentContent.map((item,index) => 
            <Comment editComment={(e) => this.editComment(e, index)} msg={item} key={index} />)
          }
        </div>
      </div> 
    );
  }
}
