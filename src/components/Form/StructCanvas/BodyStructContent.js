import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Icon, message, Row, Col, Tag, Button, Form, Select } from 'antd';
import styles from '../index.less';
import AlbumModal from '../../AlbumModal';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
@connect(state => ({

}))
@Form.create()
export default class BodyStructContent extends PureComponent {
  state = {
    title: '',
    desc: '',
    images: [],
  }
  componentDidMount() {
    if (this.props.value && this.props.value.data && this.props.value.data.title) {
      const { value: { data } } = this.props;
      this.setState({
        title: data.title,
        desc: data.desc,
        images: data.images,
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
    const { props, value, operation, form: { getFieldDecorator } } = this.props;
    const { images } = this.state;
    const titleRules = value.moduleInfo.dataSchema.properties.title;
    const descRules = value.moduleInfo.dataSchema.properties.desc;
    return (
      <div style={{ padding: '0 0 20px'}}>
        <div style={{marginBottom: 20}}>
          <p className={styles.lineTitleDefult}>
            {titleRules.title || ''}
          </p>
          <div className={styles.InputBox}>
            { value.name === 'item-paragraph' ? <FormItem>
                {getFieldDecorator('title', {
                  rules: [{
                    required: true, message: '不能为空',
                  }, {
                    min: titleRules.minLength, message: `输入内容长度不能小于${titleRules.minLength}`,
                  }, {
                    max: titleRules.maxLength, message: `输入内容长度不能大于${titleRules.maxLength}`,
                  }, {
                    whitespace: true, message: '内容不能为空格'
                  }],
                })(
                  <Input
                    maxLength={titleRules.maxLength ? titleRules.maxLength.toString() : '6'}
                    suffix={<span>{ this.props.form.getFieldValue('title') ? this.props.form.getFieldValue('title').length : 0 }/{titleRules.maxLength}</span>}
                    placeholder={titleRules['ui:placeholder']}
                  />
                )}
              </FormItem> :
              <FormItem>
                {getFieldDecorator('title', {
                  rules: [{
                    required: true, message: '不能为空',
                  }],
                })(
                  <Select style={{ minWidth: 120 }}>
                    {props.channelTitle && props.channelTitle.dataSource ?
                      props.channelTitle.dataSource.map(item => <Option value={item.value}>{item.label}</Option>): ''
                    }
                  </Select>
                )}
              </FormItem>
            }
          </div>
          <p className={styles.promptText}>{titleRules.description || ''}</p>
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
                  min: descRules.minLength, message: `文字长度太短, 要求长度最少为${descRules.minLength}`,
                }, {
                  max: descRules.maxLength, message: `文字长度太长, 要求长度最多为${descRules.maxLength}`,
                }, {
                  whitespace: true, message: '内容不能为空格'
                }],
              })(
                <TextArea
                  maxLength={descRules.maxLength ? descRules.maxLength.toString() : '200'}
                  placeholder={descRules['ui:placeholder']}>
                </TextArea>
              )}
            </FormItem>
          </div>
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
