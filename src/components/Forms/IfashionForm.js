import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Icon, message, Form, Select, Tag } from 'antd';
import styles from './IfashionForm.less';
import $ from 'jquery';
import request from '../../utils/request';
import Editor from '../Editor';
import AlbumModal from '../AlbumModal';
import { CascaderSelect, TagPicker, CoverImage, AnchorImageList } from './FormParts';

const FormItem = Form.Item;
const { TextArea } = Input;
@connect(state => ({

}))

export default class IfashionForm extends PureComponent {
  state = {
    dataParent: ['品类','人群','地域/品牌','效果','风格','热门话题','场景'],
    dataSource: {},
    minSize: {
      width: 750,
      height: 422
    },
    tagsValue: '',
  }
  componentDidMount() {
    const { formData } = this.props;
    const fieldsValue = {
      title: formData.title, // '任务标题',
      summary: formData.summary, // 推荐理由
    };
    this.props.form.setFieldsValue(fieldsValue);
    this.handleGet();
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.formData.title && nextProps.formData.title) {
      const { formData } = nextProps;
      const fieldsValue = {
        title: formData.title, // '任务标题',
        summary: formData.summary, // 推荐理由
      };
      this.props.form.setFieldsValue(fieldsValue);
    }
  }
  componentWillUnmount() {

  }

  handleGet = async () => {
    const result = await request(`${location.origin}/jsons/classification.json`, {
      method: 'GET',
    });
    this.setState({
      dataSource: result.dataSource,
    })
  }
  handleClassChange = (value) => {
    if (this.props.onChange) this.props.onChange({ classification: value });
  }
  handleCrowdChange = (value) => {
    if (this.props.onChange) this.props.onChange({ crowd: value });
  }
  handleBodyChange = (value) => {
    if (this.props.onChange) this.props.onChange({ body: value });
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
  handleChange = (value, key) => {
    const data = {};
    data[key] = value;
    if (this.props.onChange) this.props.onChange(data);
  }
  handleChangeTags = (e) => {
    this.setState({
      tagsValue: e.target.value
    });
  }
  handleConfirmTags = () => {
    const { formData } = this.props;
    const { tagsValue } = this.state;
    if (tagsValue && tagsValue.trim().length > 0) {
      const index = formData.tags.findIndex(item => item === tagsValue);
      if (index === -1) {
        if (this.props.onChange) this.props.onChange({ tags: [ ...formData.tags, tagsValue] });  
      }
      this.setState({
        tagsValue: '',
      }); 
    }
  }
  handleCloseTags = (e, removedTag) => {
    e.preventDefault();
    const advantage = this.props.formData.tags.filter(tag => tag !== removedTag);
    if (this.props.onChange) this.props.onChange({ tags: advantage });
  }
  render() {
    const { style, operation, formData } = this.props;
    const { tagsValue } = this.state;
    let getFieldDecorator = null;
    if (this.props.form) {
      getFieldDecorator = this.props.form.getFieldDecorator;
    }
    const disabled = this.props.operation === 'view' ? true : false;
    const tagStyle = {
      height: 32,
      lineHeight: '32px',
      paddingLeft: 12,
      background: '#fff',
      margin: '3px',
    }
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
                  max: 11, message: '文字长度太长, 要求长度最大为11',
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
            <span style={{ color: formData.title && formData.title.length > 11 ? '#f00' : '#444' }}>{ formData.title ? formData.title.length : 0}/11</span>
          </div>
          <div className={styles.taskList}>
            <div className={styles.textareaBox} style={{ paddingTop: 10 }}>
              <FormItem>
                {getFieldDecorator('summary', {
                  rules: [{
                    required: true, message: '推荐理由不能为空',
                  }, {
                    min: 50, message: '文字长度太短, 要求长度最小为50',
                  }, {
                    max: 80, message: '文字长度太长, 要求长度最大为80',
                  }, {
                    whitespace: true, message: '标题不能为空格'
                  }],
                })(
                  <TextArea
                    disabled={disabled}
                    className={styles.autosize}
                    style={{ height: 80 }}
                    onChange={(e) => this.handleChange(e.target.value, 'summary')}
                    placeholder="请输入50-80字的推荐理由"
                  />
                )}
              </FormItem>
              <span style={{ color: formData.summary && formData.summary.length > 80 ? '#f00' : '#444' }} className={styles.textareaNum}>{ formData.summary ? formData.summary.length : 0}/80</span>
            </div>
          </div>
          <div className={styles.taskList}>
            <AnchorImageList disabled={disabled} form={this.props.form} formData={formData} onChange={this.handleBodyChange} />
          </div>
          <div style={{ background: '#fff', padding: '20px 10px' }}>
            <CascaderSelect disabled={disabled} form={this.props.form} formData={formData} onChange={this.handleCrowdChange} rules={false} />
          </div>
          <div className={styles.taskTitBox} style={{lineHeight: '40px',background: '#f5f5f5', textIndent: '2em', fontSize: 14, color: '#333'}}>
            <span style={{ color: '#999', marginRight: 10 }}>投稿至</span>
            智能搭配 - ifashion
          </div>

          <div className={styles.taskList}>
            <TagPicker disabled={disabled} dataParent={this.state.dataParent} dataSource={this.state.dataSource} form={this.props.form} formData={formData.classification} onChange={this.handleClassChange} />
          </div>
          <div className={styles.taskList}>
            <div style={{ padding: 20 }}>
              <p style={{ marginBottom: 10 }}>
                标签
              </p>
              <label className={styles.pointBox}>
                <span>
                  { formData.tags.map((tag, index) => {
                    return (
                      <Tag style={tagStyle} key={index} closable={!disabled} onClose={(e) => this.handleCloseTags(e, tag)}>
                        {tag}
                      </Tag>
                    );
                  })}
                </span>
                {!disabled && <span>
                    <Input
                      ref={this.saveInputRef}
                      type="text"
                      style={{ fontSize: 14, width: 150, border: 'none', marginTop: 3 }}
                      value={tagsValue}
                      maxLength="64"
                      onChange={this.handleChangeTags}
                      onPressEnter={this.handleConfirmTags}
                      placeholder="选择标签或输入标签"
                    />
                  </span>}
              </label>
            </div>
            <p className={styles.promptGray}>输入 [回车] 键 完成单个标签添加</p>
          </div>
        </div>
      </div>
    );
  }
}
