import React, { PureComponent } from 'react';
import { connect } from 'dva';
import $ from 'jquery';
import { Input, Icon, message } from 'antd';
import styles from './WeitaoForm.less';
import Editor from '../Editor';
import AlbumModal from '../AlbumModal';
import CropperModal from '../AlbumModal/CropperModal';
import CascaderSelect from './FormParts/CascaderSelect';
import Classification from './FormParts/Classification';
import CoverImage from './FormParts/CoverImage';
import { ORIGIN } from '../../constants';

@connect(state => ({

}))

export default class GlobalFashionForm extends PureComponent {
  state = {
    dataParent: ['潮流热点'],
    dataSource: [],
    minSize: {
      width: 750,
      height: 422
    },
  }
  componentDidMount() {
    $.get(`${ORIGIN}/jsons/classification.json`,(result) => {
      this.setState({
        dataSource: result.dataSource,
      })
    })
  }
  componentWillUnmount() {

  }
  handleDescChange = (content) => {
    if (this.props.onChange) this.props.onChange({ task_desc: content });
  }
  handleTitleChange = (e) => {
    if (this.props.onChange) this.props.onChange({ title: e.target.value });
  }
  handleClassChange = (value) => {
    if (this.props.onChange) this.props.onChange({ classification: value });
  }
  handleCrowdChange = (value) => {
    if (this.props.onChange) this.props.onChange({ crowd: value });
  }

  handleAddCoverImg = (url) => {
    if (this.props.onChange) this.props.onChange({ cover_img: url });
  }

  render() {
    const { style, operation, formData } = this.props;
    const disabled = this.props.operation === 'view' ? true : false;
    return (
      <div className={styles.taskBox} style={style}>
        <div className={styles.taskTitBox} style={{lineHeight: '40px',background: '#f5f5f5', textIndent: '1em', fontSize: 14, color: '#333'}}>
          内容创作
        </div>
        { 
          <div className={styles.taskContentBox}>
            <div className={styles.taskList}>
              <div className={styles.taskListInp}>
                <Input disabled={disabled} type="text" id="task-title" value={formData.title} onChange={this.handleTitleChange} placeholder="请在这里输入标题"/>
                <span style={{ color: formData.title && formData.title.length > 19 ? '#f00' : '#444' }}>{ formData.title ? formData.title.length : 0}/19</span>
              </div>
              { formData.title && formData.title.length > 19 &&
                <span className={styles.promptRed}>标题字数不能超过19个字</span>
              }
            </div>
            <div className={styles.taskList}>
              <p style={{ color: '#f00' }}>*注意：请不要从word中复制内容到正文</p>
              { disabled ? 
                <div className={styles.descBox} dangerouslySetInnerHTML={{__html: formData.task_desc}}>
                </div>
              : <Editor role={this.props.role} style={{ width: '100%' }} value={formData.task_desc} onChange={this.handleDescChange}/>
              }
            </div>
            <div className={styles.taskList} style={{ marginTop: 10, paddingBottom: 40 }}>
              <CoverImage onChange={this.handleAddCoverImg} formData={{value: formData.cover_img}} />
            </div>
            <div style={{ background: '#fff', padding: '20px 10px' }}>
              <CascaderSelect disabled={disabled} form={this.props.form} formData={formData} onChange={this.handleCrowdChange} rules={false} />
            </div>
            <div className={styles.taskTitBox} style={{lineHeight: '40px',background: '#f5f5f5', textIndent: '2em', fontSize: 14, color: '#333'}}>
              <span style={{ color: '#999', marginRight: 10 }}>投稿至</span>
				      首页card-全球时尚
            </div>

            <div className={styles.taskList}>
            	<Classification disabled={disabled} dataParent={this.state.dataParent} dataSource={this.state.dataSource} form={this.props.form} formData={formData.classification} onChange={this.handleClassChange} />
            </div>
          </div>
        }
      </div>
    );
  }
}
