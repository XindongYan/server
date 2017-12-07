import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Icon, message } from 'antd';
import styles from './WeitaoForm.less';
import Editor from '../Editor';
import AlbumModal from '../AlbumModal';

@connect(state => ({

}))

export default class ZhiboForm extends PureComponent {
  state = {

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
  handleAddImg = (imgs) => {
    if (this.props.onChange) this.props.onChange({ cover_img: imgs[0] ? imgs[0].href : '' });
  }
  deleteCover = () => {
    if (this.props.onChange) this.props.onChange({ cover_img: '' });
  }
  render() {
    const { style, operation, formData } = this.props;
    return (
      <div className={styles.taskBox}>
        { (operation === 'edit' || operation === 'create') &&
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
          </div>
        }
        { operation === 'view' &&
          <div className={styles.taskContentBox} style={{ display: operation==='view' ? 'block' : 'none' }}>
            <div className={styles.taskList} style={{margin: '20px 0'}}>
              <p style={{ fontSize: 18 }}>{formData.title}</p>
            </div>
            <div className={styles.taskList} style={{ minHeight: 500 }}>
              <div className={styles.descBox} dangerouslySetInnerHTML={{__html: formData.task_desc}}>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}
