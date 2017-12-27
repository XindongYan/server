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
  operation = (e, value) => {
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
    } else if (value==='edit') {
      const { editIndex } = this.state;
      this.setState({
        direction: {...this.state.direction, visible: 'none'},
        signVisible: true,
        signContent: this.props.value[editIndex]
      })
    } else if (value==='delete') {
      const { editIndex } = this.state;
      const newCommentList = [...this.props.value];
      newCommentList.splice(editIndex,1);
      if (this.props.onChange) this.props.onChange([...newCommentList]);
      this.setState({
        direction: {...this.state.direction, visible: 'none'},
      })
    }
  }
  handleChange = () => {

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
    const { status, editIndex } = this.state;
    if(commentMsg.message){
      if(status === 'add'){
        if (this.props.onChange) this.props.onChange([...this.props.value, commentMsg]);
      } else if(status === 'edit') {
        const newCommentList = [...this.props.value];
        const newComment = { ...this.props.value[editIndex], message: commentMsg.message };
        newCommentList.splice(editIndex,1,newComment);
        if (this.props.onChange) this.props.onChange([...newCommentList]);
      }
    }
    this.setState({
      signVisible: false,
    });
  }
  handleClear = () => {
    if (this.props.onChange) this.props.onChange([]);
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
    const { viewStatus, value, approve_step, approve_status } = this.props;
    const { action, direction, signVisible, commentContent, signContent } = this.state;
    const boxSize = {width: $(this.refs.AnnotationBox).outerWidth(), height: $(this.refs.AnnotationBox).outerHeight()};
    return (
      <div style={{height: '100%', position: 'relative'}}>
        <div className={styles.commentTitle}>
          批注
          { viewStatus !== 'view' && <a onClick={this.handleClear} style={{ float: 'right', marginRight: 10 }}>清空</a>}
        </div>
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
            approve_step={approve_step}
            approve_status={approve_status}
          />
          {value.map((item,index) => 
            <Comment boxSize={boxSize} editComment={(e) => this.editComment(e, index)} msg={item} key={index} />)
          }
          { viewStatus==='view' &&
            <div
              className={styles.viewBox}
              onContextMenu={this.fnPrevent}
            >
            </div>
          }
        </div>
      </div>
    );
  }
}
