import React, { PureComponent } from 'react';
import { connect } from 'dva';
import $ from 'jquery';
import { Input, Icon, message, Form } from 'antd';
import styles from './WeitaoForm.less';
import Editor from '../Editor';
import AlbumModal from '../AlbumModal';
import CropperModal from '../AlbumModal/CropperModal';
import CascaderSelect from './FormParts/CascaderSelect';
import Classification from './FormParts/Classification';
import EndLink from './FormParts/EndLink';
import CoverImage from './FormParts/CoverImage';
import { ORIGIN } from '../../constants';

const FormItem = Form.Item;

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
    const { formData } = this.props;
    if (formData && formData.title) {
      const fieldsValue = {
        title: formData.title,
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
    if (this.props.onChange) this.props.onChange({ endLink_href: url, endLink_name: name });
  }
  render() {
    const { style, operation, formData } = this.props;
    const disabled = this.props.operation === 'view' ? true : false;
    let getFieldDecorator = null;
    if (this.props.form) {
      getFieldDecorator = this.props.form.getFieldDecorator;
    }
    return (
      <div className={styles.taskBox} style={style}>
        <div className={styles.taskTitBox} style={{lineHeight: '40px',background: '#f5f5f5', textIndent: '1em', fontSize: 14, color: '#333'}}>
          内容创作
        </div>
        { 
          <div className={styles.taskContentBox}>
            <div className={styles.taskList}>
              <div className={styles.taskListInp}>
                <FormItem>
                  {getFieldDecorator('title', {
                    rules: [{
                      required: true, message: '标题不能为空',
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
                      placeholder="请在这里输入标题"
                    />
                  )}
                </FormItem>
                <span style={{ color: formData.title && formData.title.length > 19 ? '#f00' : '#444' }}>{ formData.title ? formData.title.length : 0}/19</span>
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
                <Editor role={this.props.role} style={{ width: '100%' }} value={formData.task_desc} onChange={this.handleDescChange}/>
              </div>
              }
            </div>
            <div>
              <EndLink formData={formData} operation={this.props.operation} onChange={this.handleEndlinkChange} />
            </div>
            <div className={styles.taskList} style={{ marginTop: 10, paddingBottom: 40 }}>
              <CoverImage onChange={this.handleAddCoverImg} formData={{value: formData.cover_img}} />
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
            	<Classification disabled={disabled} dataParent={this.state.dataParent} dataSource={this.state.dataSource} form={this.props.form} formData={formData.classification} onChange={this.handleClassChange} />
            </div>
          </div>
        }
      </div>
    );
  }
}
