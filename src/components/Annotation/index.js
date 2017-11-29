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
    });
  }
  fnContextMenu = (e) => {
    e.preventDefault();
    let oX = e.pageX - $(e.target).offset().left;
    let oY = e.pageY - $(e.target).offset().top;
    this.setState({
      action: [
        {'name': '添加','value': 'add'},
      ],
      boxPosition: {
        left: $(e.target).offset().left,
        top: $(e.target).offset().top,
      },
      direction: {
        x: oX,
        y: oY,
        visible: 'block',
      },
      signVisible: false,
    }, (state) => {
      const {action, boxPosition, direction } = this.state;
    });
  }
  operation = (e,value) => {
    e.stopPropagation();
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
        onClick={(e) => this.operation(e,key.value)}
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
    if(commentMsg.message){
      if(status === 'add'){
        this.setState({
          commentContent: [...this.state.commentContent, commentMsg],
        })
      } else if(status === 'edit') {
        const newComment = { ...commentContent[editIndex], message: commentMsg.message };
        commentContent.splice(editIndex,1,newComment);
      }
    }
    this.setState({
      signVisible: false,
    })
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
    const { viewStatus, style } = this.props;
    const { action, direction, signVisible, commentContent, signContent } = this.state;
    return (
      <div style={style} className={styles.myTextInput} ref="myTextInput">
        <div
          ref="AnnotationBox"
          className={styles.AnnotationBox}
          onContextMenu={this.fnContextMenu}
          onClick={this.fnClickDefult}
        >
          <div
            className={styles.selectBox}
            style={{ 
              left: direction.x + 100 > $(this.refs.AnnotationBox).outerWidth() ? ($(this.refs.AnnotationBox).outerWidth()-100 || 0) : direction.x, 
              top: direction.y,
              display: direction.visible
            }}
          >
            {action.map(this.creatBox)}
          </div>
          <SignBox
            direction={direction}
            sureChange={this.sureChange}
            close={this.hideSignBox}
            signVisible={signVisible}
            parentWidth={$(this.refs.AnnotationBox).outerWidth()}
            signContent={signContent}
            boxSize={$(this.refs.AnnotationBox).outerHeight()}
          />
          {commentContent.map((item,index) => 
            <Comment editComment={(e) => this.editComment(e, index)} msg={item} key={index} />)
          }
        </div>
        <div
          className={styles.viewBox}
          style={{display: viewStatus==='view' ? 'block' : 'none'}}
        >
        </div>
      </div> 
    );
  }
}
