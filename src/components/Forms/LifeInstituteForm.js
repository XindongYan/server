import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Icon, message, Form } from 'antd';
import styles from './LifeInstituteForm.less';
import Editor from '../Editor';
import AlbumModal from '../AlbumModal';
import CropperModal from '../AlbumModal/CropperModal';

import { CascaderSelect, EndLink, CoverImage } from './FormParts';

const TextArea = Input.TextArea;
const FormItem = Form.Item;
@connect(state => ({

}))

export default class LifeInstituteForm extends PureComponent {
  state = {
    minSize: {
      width: 750,
      height: 422
    }
  }
  componentDidMount() {
    const { formData } = this.props;
    const fieldsValue = {
      title: formData.title, // '任务标题',
      sub_title: formData.sub_title, // '副标题',
      summary: formData.summary, // 目标人群
    };
    this.props.form.setFieldsValue(fieldsValue);
  }

  componentWillReceiveProps(nextProps) {
    const { formData } = nextProps;
    if (!this.props.formData.title && nextProps.formData.title) {
      const fieldsValue = {
        title: formData.title, // '任务标题',
        sub_title: formData.sub_title, // '副标题',
        summary: formData.summary, // 目标人群
      };
      this.props.form.setFieldsValue(fieldsValue);
    }
  }

  componentWillUnmount() {

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
  handleEndlinkChange = (url, name) => {
    if (this.props.onChange) this.props.onChange({ end_link: url, end_text: name });
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
  handleChange = (value, key) => {
    const data = {};
    data[key] = value;
    if (this.props.onChange) this.props.onChange(data);
  }
  handleDescChange = (value) => {
    if (this.props.onChange) this.props.onChange({ task_desc : value });
  }
  render() {
    const { style, operation, formData } = this.props;
    let getFieldDecorator = null;
    if (this.props.form) {
      getFieldDecorator = this.props.form.getFieldDecorator;
    }
    const disabled = this.props.operation === 'view' ? true : false;
    return (
      <div className={styles.taskBox} style={style}>
        <div className={styles.taskTitBox} style={{lineHeight: '40px',background: '#f5f5f5', textIndent: '1em', fontSize: 14, color: '#333'}}>
          内容创作
        </div>
        <div className={styles.taskContentBox}>
          <div className={styles.taskListInp} style={{ paddingTop: 10 }}>
            <FormItem>
              {getFieldDecorator('title', {
                rules: [{
                  required: true, message: '标题不能为空',
                }, {
                  min: 6, message: '文字长度太短, 要求长度最少为6',
                }, {
                  max: 18, message: '文字长度太长, 要求长度最大为18',
                }, {
                  whitespace: true, message: '标题不能为空格'
                }],
              })(
                <Input
                  disabled={disabled}
                  style={{ fontSize: '16px', border: 'none' }}
                  onChange={(e) => this.handleChange(e.target.value, 'title')}
                  placeholder="请在这里输入标题"
                />
              )}
            </FormItem>
            <span style={{ color: formData.title && formData.title.length > 18 ? '#f00' : '#444' }}>{ formData.title ? formData.title.length : 0}/18</span>
          </div>
          <div className={styles.taskListInp}>
            <FormItem>
              {getFieldDecorator('sub_title', {
                rules: [{
                  required: true, message: '不能为空',
                }, {
                  min: 6, message: '文字长度太短, 要求长度最少为6',
                }, {
                  max: 18, message: '文字长度太长, 要求长度最大为18',
                }, {
                  whitespace: true, message: '标题不能为空格'
                }],
              })(
                <Input
                  disabled={disabled}
                  style={{ fontSize: '16px', border: 'none' }}
                  onChange={(e) => this.handleChange(e.target.value, 'sub_title')}
                  placeholder="请输入18字内的副标题"
                />
              )}
            </FormItem>
            <span style={{ color: formData.sub_title && formData.sub_title.length > 18 ? '#f00' : '#444' }}>{ formData.sub_title ? formData.sub_title.length : 0}/18</span>
          </div>
          <div className={styles.taskList}>
            { disabled ? 
              <div className={styles.descBox} dangerouslySetInnerHTML={{__html: formData.task_desc}}>
              </div>
            : <div>
              <p style={{ color: '#f00' }}>*注意：请不要从word中复制内容到正文</p>
              <Editor role={this.props.role} style={{ width: '100%' }} value={formData.task_desc} onChange={this.handleDescChange}/>
            </div>
            }
          </div>
          <div>
            <EndLink formData={formData} operation={this.props.operation} onChange={this.handleEndlinkChange} />
          </div>

          <div className={styles.taskList} style={{ marginTop: 10, paddingBottom: 40 }}>
            <CoverImage onChange={this.handleAddCoverImg} formData={{value: formData.cover_img}} operation={this.props.operation} />
          </div>
          <div style={{ background: '#fff', padding: '20px 10px' }}>
            <CascaderSelect disabled={disabled} form={this.props.form} formData={formData} onChange={this.handleChange} rules={true} />
          </div>
          <div className={styles.taskTitBox} style={{lineHeight: '40px',background: '#f5f5f5', textIndent: '2em', fontSize: 14, color: '#333'}}>
            <span style={{ color: '#999', marginRight: 10 }}>投稿至</span>
            内容频道
          </div>
          <div className={styles.taskList}>
            <div className={styles.textareaBox}>
              <FormItem>
                {getFieldDecorator('summary', {
                  rules: [{
                    required: true, message: '不能为空',
                  }, {
                    min: 50, message: '文字长度太短, 要求长度最少为50',
                  }, {
                    max: 100, message: '文字长度太长, 要求长度最多为100',
                  }, {
                    whitespace: true, message: '内容不能为空格'
                  }],
                })(
                  <TextArea
                    disabled={disabled}
                    className={styles.textarea}
                    onChange={(e) => this.handleChange(e.target.value, 'summary')}
                    placeholder="请输入50-100个字以内的摘要">
                  </TextArea>
                )}
              </FormItem>
              <span style={{ color: formData.summary.length>100 ? 'red' : '#666' }} className={styles.textareaNum}>
                {formData.summary.length}/100
              </span>
            </div>
          </div>
        </div>
        <AlbumModal mode="single" k="cover" minSize={this.state.minSize} onOk={this.handleCropCoverImg}/>
        <CropperModal onOk={this.handleAddCoverImg} maxSize={500}/>
      </div>
    );
  }
}
