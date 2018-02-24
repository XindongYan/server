import React, { PureComponent } from 'react';
import { connect } from 'dva';
import $ from 'jquery';
import { Input, Icon, message, Form } from 'antd';
import styles from './WeitaoForm.less';
import Editor from '../Editor';
import AlbumModal from '../AlbumModal';

import { CascaderSelect, EndLink, TagPicker, CoverImage } from './FormParts';

const FormItem = Form.Item;

@connect(state => ({

}))

export default class GlobalFashionForm extends PureComponent {
  state = {
    dataSource: [],
    minSize: {
      width: 750,
      height: 422
    },
  }
  componentDidMount() {
    $.get(`${location.origin}/jsons/classification.json`,(result) => {
      this.setState({
        dataSource: result.dataSource,
      })
    })
    const { formData } = this.props;
    if (formData && formData.title) {
      const fieldsValue = {
        title: formData.title,
        summary: formData.summary,
      };
      if (this.props.channel_name === '买遍全球') {
        fieldsValue.sub_title = formData.sub_title;
      }
      this.props.form.setFieldsValue(fieldsValue);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.formData.title && nextProps.formData.title) {
      const { formData } = nextProps;
      const fieldsValue = {
        title: formData.title,
        summary: formData.summary,
      };
      if (this.props.channel_name === '买遍全球') {
        fieldsValue.sub_title = formData.sub_title;
      }
      this.props.form.setFieldsValue(fieldsValue);
    }
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
  handleSubTitleChange = (e) => {
    if (this.props.onChange) this.props.onChange({ sub_title: e.target.value });
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
  handleEndlinkChange = (url, name) => {
    if (this.props.onChange) this.props.onChange({ end_link: url, end_text: name });
  }
  render() {
    const { style, operation, formData } = this.props;
    const disabled = this.props.operation === 'view' ? true : false;
    let getFieldDecorator = null;
    if (this.props.form) {
      getFieldDecorator = this.props.form.getFieldDecorator;
    }
    let dataParent = [];
    let product = 0;
    if (this.props.channel_name === '全球时尚') {
      product = 3321;
      dataParent.push('潮流热点');
    } else {
      product = 0;
      dataParent.push('大进口新内容');
    }
    return (
      <div className={styles.taskBox} style={style}>
        <div className={styles.taskTitBox} style={{lineHeight: '40px',background: '#f5f5f5', textIndent: '1em', fontSize: 14, color: '#333'}}>
          内容创作
          <a href={`${location.origin}/global_fashion_pic.psd`} download="全球时尚图片模版.psd" style={{float: 'right', marginRight: 20}}>
            下载图片模版</a>
        </div>
          <div className={styles.taskContentBox}>
            <div className={styles.taskList}>
              <div className={styles.taskListInp}>
                <FormItem>
                  {getFieldDecorator('title', {
                    rules: [{
                      required: true, message: '标题不能为空',
                    }, {
                      min: 4, message: '文字长度太短, 要求长度最小为4',
                    }, {
                      max: 19, message: '文字长度太长, 要求长度最大为19',
                    }, {
                      whitespace: true, message: '标题不能为空格'
                    }],
                  })(
                    <Input
                      disabled={disabled}
                      style={{ fontSize: '16px', border: 'none' }}
                      onChange={this.handleTitleChange}
                      placeholder="请在这里输入4-19字标题"
                    />
                  )}
                </FormItem>
                <span style={{ color: formData.title && formData.title.length > 19 ? '#f00' : '#444' }}>{ formData.title ? formData.title.length : 0}/19</span>
              </div>
            </div>
            <div className={styles.taskList}>
              <div className={styles.taskListInp}>
                <FormItem>
                  {getFieldDecorator('summary', {
                    rules: [{
                      required: true, message: '引文不能为空',
                    }, {
                      max: 100, message: '文字长度太长, 要求长度最大为100',
                    }, {
                      min: 10, message: '文字长度太短, 要求长度最小为10',
                    }, {
                      whitespace: true, message: '标题不能为空格'
                    }],
                  })(
                    <Input.TextArea
                      disabled={disabled}
                      style={{ fontSize: '16px', border: 'none' }}
                      onChange={this.handleSummaryChange}
                      placeholder="请在这里输入10-100个字的引文"
                    />
                  )}
                </FormItem>
                <span style={{ color: formData.summary && formData.summary.length > 100 ? '#f00' : '#444' }}>{ formData.summary ? formData.summary.length : 0}/100</span>
              </div>
            </div>
            { this.props.channel_name === '买遍全球' &&
              <div className={styles.taskList}>
                <div className={styles.taskListInp}>
                  <FormItem>
                    {getFieldDecorator('sub_title', {
                      rules: [{
                        required: true, message: '副标题不能为空',
                      }, {
                        max: 20, message: '文字长度太长, 要求长度最大为20',
                      }, {
                        whitespace: true, message: '副标题不能为空格'
                      }],
                    })(
                      <Input
                        disabled={disabled}
                        onChange={this.handleSubTitleChange}
                        placeholder="请在这里输入副标题"
                      />
                    )}
                  </FormItem>
                  <span style={{ color: formData.sub_title && formData.sub_title.length > 20 ? '#f00' : '#444' }}>{ formData.sub_title ? formData.sub_title.length : 0}/20</span>
                </div>
              </div>
            }
            <div className={styles.taskList}>
              { disabled ? 
                <div className={styles.descBox} dangerouslySetInnerHTML={{__html: formData.task_desc}}>
                </div>
              : <div>
                <p style={{ color: '#f00' }}>*注意：请不要从word中复制内容到正文</p>
                <Editor role={this.props.role} style={{ width: '100%' }} value={formData.task_desc} onChange={this.handleDescChange} product={product} />
              </div>
              }
            </div>
            <div>
              <EndLink formData={formData} operation={this.props.operation} onChange={this.handleEndlinkChange} />
            </div>
            <div className={styles.taskList} style={{ marginTop: 10, paddingBottom: 40 }}>
              <CoverImage onChange={this.handleAddCoverImg} formData={{value: formData.cover_img}} operation={this.props.operation} />
            </div>
            { this.props.channel_name === '全球时尚' &&
              <div style={{ background: '#fff', padding: '20px 10px' }}>
                <CascaderSelect disabled={disabled} form={this.props.form} formData={formData} onChange={this.handleCrowdChange} rules={false} />
              </div>
            }
            <div className={styles.taskTitBox} style={{lineHeight: '40px',background: '#f5f5f5', textIndent: '2em', fontSize: 14, color: '#333'}}>
              <span style={{ color: '#999', marginRight: 10 }}>投稿至</span>
				      { this.props.channel_name === '买遍全球' ? '买遍全球频道' : '首页card-全球时尚' }
            </div>

            <div className={styles.taskList}>
            	<TagPicker disabled={disabled} dataParent={dataParent} dataSource={this.state.dataSource} form={this.props.form} formData={formData.classification} onChange={this.handleClassChange} />
            </div>
          </div>
      </div>
    );
  }
}
