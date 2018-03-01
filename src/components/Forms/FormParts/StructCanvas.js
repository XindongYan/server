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
export default class StructCanvas extends PureComponent {
  state = {
    title: '',
    desc: '',
    images: [],
  }
  componentDidMount() {
    if (this.props.formData && this.props.formData.title) {
      const { formData } = this.props;
      this.setState({
        title: formData.title,
        desc: formData.desc,
        images: formData.images,
      }, () => {
        const fieldsValue = {
          title: this.state.title,
          desc: this.state.desc,
        };
        this.props.form.setFieldsValue(fieldsValue);
      })
    } else {
      const fieldsValue = {
        title: this.state.title,
        desc: this.state.desc,
      };
      this.props.form.setFieldsValue(fieldsValue);
    }
  }
  componentWillReceiveProps(nextProps) {
    
  }
  componentWillUnmount() {

  }


  uploadCoverImg = (key) => {
    this.props.dispatch({
      type: 'album/show',
      payload: { currentKey: this.props.index },
    });
  }
  handleAddImg = (imgs) => {
    if (imgs[0]) {
      this.setState({
        images: [{
          materialId: imgs[0].materialId,
          picWidth: imgs[0].picWidth,
          picHeight: imgs[0].picHeight,
          picUrl: imgs[0].url,
        }],
      })
    }
  }
  handleRemoveImg = () => {
    this.setState({
      images: [],
    })
  }
  handlePushContent = () => {
    this.props.form.validateFieldsAndScroll(['title', 'desc'], (err, val) => {
      if (!err) {
        if (this.state.images.length < 1) {
          message.warn('请选择一张配图');
        } else {
          if (this.props.onChange) this.props.onChange(this.props.index, {
            title: val.title,
            desc: val.desc,
            images: this.state.images,
          })
        }
      }
    })
  }

  render() {
    const { formData, operation, form: { getFieldDecorator } } = this.props;
    const { images } = this.state;
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
                  min: 4, message: '输入内容长度不能小于 4',
                }, {
                  whitespace: true, message: '内容不能为空格'
                }],
              })(
                <Input
                  maxLength="6"
                  suffix={<span>{ this.props.form.getFieldValue('title') ? this.props.form.getFieldValue('title').length : 0 }/6</span>}
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
                  maxLength="200"
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
          { (!images || images.length === 0) &&
            <label onClick={() => this.uploadCoverImg('images',0,0)}>
              <div className={styles.upCover} style={{ width: 130, height: 130, paddingTop: 30 }}>
                <Icon type="plus" className={styles.uploadIcon} />
                <p>添加上传图片</p>
              </div>
            </label>
          }
          { images && images.length > 0 &&
            <div className={styles.imgShowBox} style={{ width: 130, height: 130, lineHeight: '126px' }}>
              <img src={images[0].picUrl} style={{ maxWidth: '100%', maxHeight: '100%', height: 'auto', width: 'auto' }} />
              <div className={styles.clearImg} onClick={this.handleRemoveImg}>
                <Icon type="delete" />
              </div>
            </div>
          } 
          <p className={styles.promptTextRed}></p>
          <p className={styles.promptText}>请在这里上传一张段落配图，推荐 702px 以上的高清图片</p>
        </div>
        <div style={{ height: 40, marginTop: 20 }}>
          <Button onClick={this.handlePushContent} type="primary" style={{ float: 'right' }}>确定</Button>
        </div>
        <AlbumModal mode="single" k={this.props.index} onOk={this.handleAddImg}/>
      </div>
    );
  }
}
