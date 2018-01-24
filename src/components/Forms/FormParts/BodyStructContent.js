import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Icon, message, Row, Col, Tag, Button, Form } from 'antd';
import styles from './index.less';
import AlbumModal from '../../AlbumModal';

const FormItem = Form.Item;
const { TextArea } = Input;
@connect(state => ({

}))
@Form.create()
export default class BodyStructContent extends PureComponent {
  state = {
    title: '',
    desc: '',
    images: '',
  }
  componentDidMount() {
    const fieldsValue = {
      title: this.state.title,
      desc: this.state.desc,
    };
    this.props.form.setFieldsValue(fieldsValue);
  }
  componentWillReceiveProps(nextProps) {
    
  }
  componentWillUnmount() {

  }


  uploadCoverImg = (key) => {
    this.props.dispatch({
      type: 'album/show',
      payload: { currentKey: "StructContent" },
    });
  }
  render() {
    const { formData, operation, form: { getFieldDecorator } } = this.props;
    return (
      <div style={{ padding: '0 0 20px'}}>
        <div>
          <p className={styles.lineTitleDefult}>
            自定义段落标题:
          </p>
          <div className={styles.InputBox}>
            <FormItem>
              {getFieldDecorator('title', {
                rules: [{
                  required: true, message: '不能为空',
                }, {
                  min: 4, message: '文字长度太长, 要求长度最小为4',
                }, {
                  max: 6, message: '文字长度太长, 要求长度最大为6',
                }, {
                  whitespace: true, message: '内容不能为空格'
                }],
              })(
                <Input
                  suffix={<span>{ this.props.form.getFieldValue(['title']) ? this.props.form.getFieldValue(['title']).length : 0 }/6</span>}
                  placeholder="请在这里输入4-6个字以内的段落标题"
                />
              )}
            </FormItem>
          </div>
          <p className={styles.promptText}>请在这里输入4-6个字以内的段落标题</p>
        </div>
        <div>
          <p className={styles.lineTitleDefult}>
            段落描述:
          </p>
          <div className={styles.textareaBox}>
            <FormItem>
              {getFieldDecorator('desc', {
                rules: [{
                  required: true, message: '不能为空',
                }, {
                  min: 60, message: '文字长度太短, 要求长度最少为60',
                }, {
                  max: 200, message: '文字长度太长, 要求长度最多为200',
                }, {
                  whitespace: true, message: '内容不能为空格'
                }],
              })(
                <TextArea
                  placeholder="请在这里输入60-200字文本段落描述">
                </TextArea>
              )}
            </FormItem>
          </div>
          <p className={styles.promptText}>请在这里输入60-200字文本段落描述</p>
        </div>
        <div>
          <p className={styles.lineTitleDefult}>
            配图
          </p>
          { !formData.images &&
            <label onClick={() => this.uploadCoverImg('images',0,0)}>
              <div className={styles.upCover} style={{ width: 130, height: 130, paddingTop: 30 }}>
                <Icon type="plus" className={styles.uploadIcon} />
                <p>添加上传图片</p>
              </div>
            </label>
          }
          { formData.images &&
            <div className={styles.imgShowBox} style={{ width: 130, height: 130, lineHeight: '126px', textAlign: 'center' }}>
              <img src={formData.images} style={{ maxWidth: '100%', maxHeight: '100%', height: 'auto', width: 'auto' }} />
              <div className={styles.clearImg} onClick={() => this.handleRemoveImg('images')}>
                <Icon type="delete" />
              </div>
            </div>
          } 
          <p className={styles.promptTextRed}></p>
          <p className={styles.promptText}>请在这里上传一张段落配图，推荐 702px 以上的高清图片</p>
        </div>
        <div style={{ height: 40, marginTop: 20 }}>
          <Button type="primary" style={{ float: 'right' }}>确定</Button>
        </div>
        <AlbumModal mode="single" k="StructContent" minSize={this.state.minSize} onOk={this.handleCropCoverImg}/>
      </div>
    );
  }
}
