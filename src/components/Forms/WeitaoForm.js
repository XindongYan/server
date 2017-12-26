import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Icon, message } from 'antd';
import styles from './WeitaoForm.less';
import Editor from '../Editor';
import AlbumModal from '../AlbumModal';
import CropperModal from '../AlbumModal/CropperModal';

@connect(state => ({

}))

export default class WeitaoForm extends PureComponent {
  state = {
    minSize: {
      width: 750,
      height: 422
    }
  }
  componentDidMount() {

  }
  componentWillUnmount() {

  }
  handleDescChange = (content) => {
    if (this.props.onChange) this.props.onChange({ task_desc: content });
  }
  handleTitleChange = (e) => {
    if (this.props.onChange) this.props.onChange({ title: e.target.value });
  }
  handleCropCoverImg = (imgs) => {
    if (imgs[0]) {
      this.props.dispatch({
        type: 'album/showCropper',
        payload: {
          visible: true,
          src: imgs[0].url,
          width: 750,
          height: 422,
          picHeight: imgs[0].picHeight,
          picWidth: imgs[0].picWidth,
        }
      });
    }
  }
  handleAddCoverImg = (url) => {
    if (this.props.onChange) this.props.onChange({ cover_img: url });
  }
  uploadCoverImg = () => {
    this.props.dispatch({
      type: 'album/show',
      payload: { currentKey: 'cover' }
    });
  }
  deleteCover = () => {
    if (this.props.onChange) this.props.onChange({ cover_img: '' });
  }
  render() {
    const { style, operation, formData } = this.props;
    return (
      <div className={styles.taskBox}>
        { (operation==='edit' || operation === 'create') &&
          <div className={styles.taskContentBox}>
            <div className={styles.taskList}>
              <div className={styles.taskListInp}>
                <Input type="text" id="task-title" value={formData.title} onChange={this.handleTitleChange} placeholder="请在这里输入标题"/>
                <span style={{ color: formData.title && formData.title.length > 19 ? '#f00' : '#444' }}>{ formData.title ? formData.title.length : 0}/19</span>
              </div>
              { formData.title && formData.title.length > 19 &&
                <span className={styles.promptRed}>标题字数不能超过19个字</span>
              }
            </div>
            <div className={styles.taskList}>
              <p style={{ color: '#f00' }}>*注意：请不要从word中复制内容到正文</p>
              <Editor role={this.props.role} style={{ width: '100%' }} value={formData.task_desc} onChange={this.handleDescChange}/>
            </div>
            <div className={styles.taskList} style={{ marginTop: 10, paddingBottom: 40 }}>
              <p>封面图</p>
              <div className={styles.coverPicBox}>
                <div className={styles.upCover} onClick={this.uploadCoverImg} style={{display: formData.cover_img ? 'none' : 'block'}}>
                  <Icon type="plus" />
                  <p>上传封面图</p>
                </div>
                <div className={styles.coverPic} style={{display: formData.cover_img ? 'block' : 'none'}}>
                  <img src={formData.cover_img} />
                  <div className={styles.coverModal} onClick={this.deleteCover}>
                    <Icon type="delete" />
                  </div>
                </div>
              </div>
              <p className={styles.promptGray}>请上传尺寸不小于750x422px的图片</p>
            </div>
          </div>
        }
        { operation==='view' &&
          <div className={styles.taskContentBox}>
            <div className={styles.taskList} style={{padding: '30px 0'}}>
              <p style={{ fontSize: 18 }}>{formData.title}</p>
            </div>
            <div className={styles.taskList} style={{ minHeight: 558 }}>
              <div className={styles.descBox} dangerouslySetInnerHTML={{__html: formData.task_desc}}>
              </div>
            </div>
            <div className={styles.taskList} style={{ marginTop: 10, paddingBottom: 40 }}>
              <div style={{ width: 340, height:'176px', textAlign: 'center', lineHeight: '172px' }}>
                { formData.cover_img &&
                  <img src={formData.cover_img} />
                }
              </div>
            </div>
          </div>
        }
        <AlbumModal mode="single" k="cover" minSize={this.state.minSize} onOk={this.handleCropCoverImg}/>
        <CropperModal onOk={this.handleAddCoverImg}/>
      </div>
    );
  }
}
