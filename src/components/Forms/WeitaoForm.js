import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Icon } from 'antd';
import styles from './WeitaoForm.less';
import Editor from '../Editor';
import AlbumModal from '../AlbumModal';

@connect(state => ({

}))

export default class WeitaoForm extends PureComponent {
  state = {
    coverPic: {},
    minSize: {
      width: 750,
      height: 422
    }
  }
  componentDidMount() {

  }
  componentWillUnmount() {

  }
  handleAddImg = (imgs) => {
    this.setState({
      coverPic: imgs[0],
    })
  }
  uploadCoverImg = () => {
    this.props.dispatch({
      type: 'album/show',
      payload: { currentKey: 'cover' }
    });
  }
  deleteCover = () => {
    this.setState({
      coverPic: {},
    })
  }
  render() {
    const { style, operation } = this.props;
    const { coverPic } = this.state;
    return (
      <div className={styles.taskBox} style={style}>
        <div className={styles.taskTitBox}>
          内容创作
        </div>
        <div className={styles.taskContentBox} style={{ display: operation==='edit' ? 'block' : 'none' }}>
          <div className={styles.taskList}>
            <div className={styles.taskListInp}>
              <Input type="text" id="task-title" placeholder="请在这里输入标题"/>
              <span>0/19</span>
            </div>
            <span className={styles.promptRed}></span>
          </div>
          <div className={styles.taskList}>
            <p style={{ color: '#f00' }}>*注意：请不要从word中复制内容到正文</p>
            <Editor style={{ width: '100%' }} />
          </div>
          <div className={styles.taskList} style={{ marginTop: 20 }}>
            <p>封面图</p>
            <div className={styles.coverPicBox}>
              <div className={styles.upCover} onClick={this.uploadCoverImg} style={{display: coverPic.href ? 'none' : 'block'}}>
                <Icon type="plus" />
                <p>上传封面图</p>
              </div>
              <div className={styles.coverPic} style={{display: coverPic.href ? 'block' : 'none'}}>
                <img src={coverPic.href} />
                <div className={styles.coverModal} onClick={this.deleteCover}>
                  <Icon type="delete" />
                </div>
              </div>
            </div>
            <p className={styles.promptGray}>请上传尺寸不小于750x422px的图片</p>
          </div>
        </div>
        <div className={styles.taskContentBox} style={{ display: operation==='view' ? 'block' : 'none' }}>
          <div className={styles.taskList}>
            <div style={{ width: 375, height:211, textAlign: 'center', lineHeight: 211 }}>
              <img src={coverPic.href} />
            </div>
          </div>
          <div className={styles.taskList}>
            <p style={{ fontSize: 18 }}>标题</p>
          </div>
          <div className={styles.taskList}>
            <div>
              正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文
            </div>
          </div>
        </div>
        <AlbumModal mode="single" k="cover" minSize={this.state.minSize} onOk={this.handleAddImg}/>
      </div>
    );
  }
}
