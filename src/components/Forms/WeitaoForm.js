import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Icon, message } from 'antd';
import styles from './WeitaoForm.less';
import Editor from '../Editor';
import AlbumModal from '../AlbumModal';
import CascaderSelect from './FormParts/CascaderSelect';
import CoverImage from './FormParts/CoverImage';

import { EndLink } from './FormParts';

@connect(state => ({

}))

export default class WeitaoForm extends PureComponent {
  state = {
    minSize: {
      width: 750,
      height: 422
    },
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
  handleSummaryChange = (e) => {
    if (this.props.onChange) this.props.onChange({ summary: e.target.value });
  }
  handleEndlinkChange = (url, name) => {
    if (this.props.onChange) this.props.onChange({ end_link: url, end_text: name });
  }
  handleTaskChange = (value, key) => {
    const data = {};
    data[key] = value;
    if (this.props.onChange) this.props.onChange(data);
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
          cropperKey: 'cover',
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
      <div className={styles.taskBox} style={style}>
        <div className={styles.taskTitBox} style={{lineHeight: '40px',background: '#f5f5f5', textIndent: '1em', fontSize: 14, color: '#333'}}>
          内容创作
        </div>
        { (operation==='edit' || operation === 'create') &&
          <div className={styles.taskContentBox}>
            <div className={styles.taskList}>
              <div className={styles.taskListInp}>
                <Input type="text" id="task-title" value={formData.title} onChange={this.handleTitleChange} placeholder="请在这里输入4-19字标题"/>
                <span style={{ color: formData.title && formData.title.length > 19 ? '#f00' : '#444' }}>{ formData.title ? formData.title.length : 0}/19</span>
              </div>
              { formData.title && formData.title.length > 19 &&
                <span className={styles.promptRed}>标题字数不能超过19个字</span>
              }
            </div>
            <div className={styles.taskList}>
              <div className={styles.taskListInp}>
                <Input.TextArea type="text" id="task-title" value={formData.summary} onChange={this.handleSummaryChange} placeholder="请在这里输入10-100个字的引文"/>
                <span style={{ color: formData.summary && (formData.summary.length > 100 || formData.summary.length < 10) ? '#f00' : '#444' }}>{ formData.summary ? formData.summary.length : 0}/100</span>
              </div>
              { formData.summary && formData.summary.length > 100 &&
                <span className={styles.promptRed}>引文字数不能超过100个字</span>
              }
            </div>
            <div className={styles.taskList}>
              <p style={{ color: '#f00' }}>*注意：请不要从word中复制内容到正文</p>
              <Editor role={this.props.role} style={{ width: '100%' }} value={formData.task_desc} onChange={this.handleDescChange}/>
            </div>
            { this.props.channel_name === '微淘' &&
              <div>
                <EndLink formData={formData} operation={this.props.operation} onChange={this.handleEndlinkChange} />
              </div>
            }
            <div style={{ background: '#fff', padding: '20px 10px' }}>
              <CascaderSelect form={this.props.form} formData={formData} onChange={this.handleTaskChange} rules={false} />
            </div>
            <div className={styles.taskList} style={{ marginTop: 10, paddingBottom: 40 }}>
              <CoverImage operation={this.props.operation} onChange={this.handleAddCoverImg} formData={{value: formData.cover_img}} />
            </div>
          </div>
        }
        { operation==='view' &&
          <div className={styles.taskContentBox}>
            <div className={styles.taskList} style={{padding: '30px 0'}}>
              <p style={{ fontSize: 18 }}>{formData.title}</p>
            </div>
            <div className={styles.taskList} style={{padding: '30px 0'}}>
              <p style={{ fontSize: 18 }}>{formData.summary}</p>
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
      </div>
    );
  }
}
