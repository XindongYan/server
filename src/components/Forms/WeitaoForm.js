import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input } from 'antd';
import styles from './WeitaoForm.less';
import Editor from '../Editor';
import AlbumModal from '../AlbumModal';

@connect(state => ({

}))

export default class WeitaoForm extends PureComponent {
  state = {
    coverPic: '',
  }
  componentDidMount() {

  }
  componentWillUnmount() {

  }
  handleAddImg = (imgs) => {
    imgs.forEach(item => {
      this.setState({

      })
    });
    console.log(imgs)
  }
  showAlbum = () => {
    this.props.dispatch({
      type: 'album/show',
      payload: { currentKey: 'cover' }
    });
    console.log(this.props)
  }
  render() {
    const { style } = this.props;
    return (
      <div className={styles.taskBox} style={style}>
        <div className={styles.taskTitBox}>
          内容创作
        </div>
        <div className={styles.taskContentBox}>
          <div className={styles.taskList}>
            <div className={styles.taskListInp}>
              <Input type="text" id="task-title" placeholder="请在这里输入标题"/>
              <span>0/19</span>
            </div>
            <span className={styles.prompt}></span>
          </div>
          <div className={styles.taskList}>
            <p style={{ color: '#f00' }}>*注意：请不要从word中复制内容到正文</p>
            <Editor />
          </div>
          <div className={styles.taskList}>

          </div>
        </div>
        <button onClick={this.showAlbum}>封面</button>
        <AlbumModal mode="single" k="cover" onOk={this.handleAddImg}/>
      </div>
    );
  }
}
