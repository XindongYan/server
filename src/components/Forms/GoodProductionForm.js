import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Icon, message, Tag, Tooltip, Form } from 'antd';
import styles from './GoodProductionForm.less';
import AlbumModal from '../AlbumModal';
import CropperModal from '../AlbumModal/CropperModal';

const FormItem = Form.Item;
@Form.create()

@connect(state => ({

}))

export default class GoodProductionForm extends PureComponent {
  state = {
    longPoint: '',
    shortPoint: '',
    minSize: {
      width: 750,
      height: 422,
    },
    k: '',
  }
  componentDidMount() {
    const fieldsValue = {
      title: this.props.formData.title,
      task_desc: this.props.formData.task_desc,
      // merchant_tag: this.props.formData.merchant_tag,
      // product_url: this.props.formData.product_url,
      // product_img: this.props.formData.product_img,
      // target_population: this.props.formData.target_population,
      // cover_imgs: this.props.formData.cover_imgs,
      // white_bg_img: this.props.formData.white_bg_img,
      // long_advantage: this.props.formData.long_advantage,
      // short_advantage: this.props.formData.short_advantage,
      industry_title: this.props.formData.industry_title,
      industry_introduction: this.props.formData.industry_introduction,
      // industry_img: this.props.formData.industry_img,
      brand_name: this.props.formData.brand_name,
      brand_introduction: this.props.formData.brand_introduction,
      // brand_logo: this.props.formData.brand_logo,
    };
    this.props.form.setFieldsValue(fieldsValue);
  }
  componentWillReceiveProps(nextProps) {
    
  }
  componentWillUnmount() {
    
  }
  handleCloseLong = (e, removedTag) => {
    e.preventDefault();
    const long_advantage = this.props.formData.long_advantage.filter(tag => tag !== removedTag);
    if (this.props.onChange) this.props.onChange({ long_advantage: long_advantage })
  }
  handleCloseShort = (e, removedTag) => {
    e.preventDefault();
    const short_advantage = this.props.formData.short_advantage.filter(tag => tag !== removedTag);
    if (this.props.onChange) this.props.onChange({ short_advantage: short_advantage })
  }
  handleInputChangeLong = (e) => {
    this.setState({ longPoint: e.target.value });
  }
  handleInputChangeShort = (e) => {
    this.setState({ shortPoint: e.target.value });
  }
  handleInputConfirmLong = (min, max) => {
    const { formData } = this.props;
    const { longPoint } = this.state;
    if (longPoint && longPoint.length >= min && longPoint.length <= max ) {
      if (formData.long_advantage.indexOf(longPoint) === -1) {
        if (this.props.onChange) this.props.onChange({ long_advantage: [ ...formData.long_advantage, longPoint ] });
      }
      this.setState({
        longPoint: '',
      });
    }
  }
  handleInputConfirmShort = (min, max) => {
    const { formData } = this.props;
    const { shortPoint } = this.state;
    if (shortPoint && shortPoint.length >= min && shortPoint.length <= max ) {
      if (formData.short_advantage.indexOf(shortPoint) === -1) {
        if (this.props.onChange) this.props.onChange({ short_advantage: [ ...formData.short_advantage, shortPoint ] });
      }
      this.setState({
        shortPoint: '',
      });
    }
  }
  uploadCoverImg = (key) => {
    this.setState({
      k: key,
    },() => {
      this.props.dispatch({
        type: 'album/show',
        payload: { currentKey: key }
      });
    })
  }
  handleTaskChange = (e, key) => {
    const data = {};
    data[key] = e.target.value;
    if (this.props.onChange) this.props.onChange(data);
  }

  handleCropCoverImg = (imgs) => {
    const { minSize } = this.state;
    if (imgs[0]) {
      this.props.dispatch({
        type: 'album/showCropper',
        payload: {
          visible: true,
          src: imgs[0].url,
          width: minSize.width,
          height: minSize.height,
          picHeight: imgs[0].picHeight,
          picWidth: imgs[0].picWidth,
          cropperKey: 'cover',
        }
      });
    }
  }
  render() {
    const { form: { getFieldDecorator, getFieldValue }, style, operation, formData } = this.props;
    const { task, longPoint, shortPoint } = this.state;
    const tagStyle = {
      height: 32,
      lineHeight: '32px',
      paddingLeft: 12,
      background: '#fff',
      margin: '3px',
    }
    // console.log(formData)
    return (
      <div>
        <div className={styles.taskTitBox} style={{lineHeight: '40px',background: '#f5f5f5', textIndent: '1em', fontSize: 14, color: '#333'}}>
          内容创作
        </div>
        { (operation==='edit' || operation === 'create') &&
          <section className={styles.taskContentBox}>
            <article className={styles.goodsArticle}>
              <div>
                <p className={styles.lineTitleDefult}>
                  商品宝贝
                </p>
                <div>
                  <div>
                    <a ><img /></a>
                  </div>
                </div>
              </div>
              
              <div>
                <FormItem
                >
                  {getFieldDecorator('title', {
                    rules: [{
                      required: true, message: '标题不能为空',
                    }, {
                      max: 18, message: '文字长度太长, 要求长度最大为18',
                    }],
                  })(
                    <div className={styles.InputBox} style={{ border: 'none' }}>
                      <Input
                        style={{ fontSize: '18px', border: 'none', outline: 'none' }}
                        onChange={(e) => this.handleTaskChange(e, 'title')}
                        placeholder="请在这里输入标题"
                      />
                      <span style={{ color: formData.title.length>18 ? 'red' : '#666' }} className={styles.inputNum}>
                        {formData.title.length}/18
                      </span>
                    </div>
                  )}
                </FormItem>
              </div>
              <div>
                <FormItem
                  // {...formItemLayout}
                >
                  {getFieldDecorator('task_desc', {
                    rules: [{
                      required: true, message: '不能为空',
                    }, {
                      max: 30, message: '文字长度太长, 要求长度最多为30',
                    }],
                  })(
                    <div className={styles.textareaBox}>
                      <textarea
                        className={styles.textarea}
                        onChange={(e) => this.handleTaskChange(e, 'task_desc')}
                        placeholder="用一句话概括商品亮点，最多30个字，用于在有好货列表中显示">
                      </textarea>
                      <span style={{ color: formData.task_desc.length>30 ? 'red' : '#666' }} className={styles.textareaNum}>
                        {formData.task_desc.length}/30
                      </span>
                    </div>
                  )}
                </FormItem>
                <p className={styles.promptText}>提示：用一句话概括商品亮点，最多30个字，用于在有好货列表中显示</p>
              </div>
              <div>
                <p className={styles.lineTitleDefult}>
                  本文目标人群
                </p>
                <div>
            
                </div>
              </div>
              <div>
                <p className={styles.lineTitleDefult}>
                  上传宝贝图
                </p>
                <div>
                  <label className={styles.uploadImgBox} style={{ width: 200, height: 200 }}>
                    <div>
                      <Icon type="plus" className={styles.uploadIcon} />
                      <p>上传封面</p>
                    </div>
                  </label>
                </div>
                <p className={styles.promptTextRed}></p>
                <p className={styles.promptText}>请上传3-5张商品图片，尺寸不小于500*500，默认选取第一张作为频道首页店铺列表页封面图</p>
              </div>

              
              <div>
                <p className={styles.lineTitleDefult}>
                  白底图
                </p>
                <label className={styles.uploadImgBox} style={{ width: 200, height: 200 }} onClick={() => this.uploadCoverImg('white_bg_img')}>
                  <div>
                    <Icon type="plus" className={styles.uploadIcon} />
                    <p>添加上传图片</p>
                  </div>
                </label>
                <p className={styles.promptTextRed}></p>
                <p className={styles.promptText}>请上传1张白底商品图，尺寸不小于500*500，查看
                  <a href="https://daren.bbs.taobao.com/detail.html?postId=7477203" target="_blank">#图片提交规则#</a>
                </p>
              </div>
            </article>
            
            <article className={styles.goodsArticle}> 
              <p className={styles.lineTitleBlue}>好在哪里</p>
            
              <div>
                <p className={styles.lineTitleDefult}>
                  宝贝长亮点
                </p>
                <label className={styles.pointBox}>
                  <span>
                    { formData.long_advantage.map((tag, index) => {
                      return (
                        <Tag style={tagStyle} key={index} closable={true} onClose={(e) => this.handleCloseLong(e, tag)}>
                          {tag}
                        </Tag>
                      );
                    })}
                  </span>
                  <span>
                    <Input
                      ref={this.saveInputRef}
                      type="text"
                      style={{ width: 150, border: 'none', marginTop: 3 }}
                      value={longPoint}
                      onChange={this.handleInputChangeLong}
                      onPressEnter={() => this.handleInputConfirmLong(12, 20)}
                      placeholder="选择标签或输入标签"
                    />
                  </span>
                </label>
                <p className={styles.promptTextRed}>
                  { longPoint.length > 0 && ( longPoint.length < 12 || longPoint.length > 20) &&
                    "标签的字数必须在12～20之间"
                  }
                </p>
                <p className={styles.promptText}>提示：轻敲【回车键】添加【宝贝长亮点】，【宝贝长亮点】数量2-3个，每个【宝贝长亮点】字数12-20个字，每个亮点必须以'。'结尾</p>
              </div>
              <div>
                <p className={styles.lineTitleDefult}>
                  宝贝短亮点
                </p>
                <label className={styles.pointBox}>
                  <span>
                    { formData.short_advantage.map((tag, index) => {
                      return (
                        <Tag style={tagStyle} key={index} closable={true} onClose={(e) => this.handleCloseShort(e, tag)}>
                          {tag}
                        </Tag>
                      );
                    })}
                  </span>
                  <span>
                    <Input
                      ref={this.saveInputRef}
                      type="text"
                      style={{ width: 150, border: 'none', marginTop: 3 }}
                      value={shortPoint}
                      onChange={this.handleInputChangeShort}
                      onPressEnter={() => this.handleInputConfirmShort(6, 12)}
                      placeholder="选择标签或输入标签"
                    />
                  </span>
                </label>
                <p className={styles.promptTextRed}>
                  { shortPoint.length > 0 && ( shortPoint.length < 6 || shortPoint.length > 12) &&
                    "标签的字数必须在6～12之间"
                  }
                </p>
                <p className={styles.promptText}>提示：敲击【回车键】添加【宝贝短亮点】, 【宝贝短亮点】数量2-3个，每个【宝贝短亮点】字数6-12个字</p>
              </div>
            </article>
          
          
            <article className={styles.goodsArticle}>  
              <p className={styles.lineTitleBlue}>行业补充</p>
              <div>
                <p className={styles.lineTitleDefult}>
                  标题
                </p>
                <FormItem
                  // {...formItemLayout}
                >
                  {getFieldDecorator('industry_title', {
                    rules: [{
                      required: true, message: '不能为空',
                    }, {
                      max: 6, message: '文字长度太长, 要求长度最多为6',
                    }],
                  })(
                    <div className={styles.InputBox}>
                      <Input
                        onChange={(e) => this.handleTaskChange(e, 'industry_title')}
                        placeholder="请围绕商品的其中一个行业特征填写标题"
                      />
                      <span style={{ color: formData.industry_title.length>6 ? 'red' : '#666' }} className={styles.inputNum}>
                        {formData.industry_title.length}/6
                      </span>
                    </div>
                  )}
                </FormItem>
                <p className={styles.promptTextRed}></p>
                <p className={styles.promptText}>举例：设计亮点，搭配指南，材质解析，功能/性能优势，功能效果，试用展示，使用技巧，选购技巧等。</p>
              </div>
              <div>
                <p className={styles.lineTitleDefult}>
                  介绍
                </p>
                <FormItem
                >
                  {getFieldDecorator('industry_introduction', {
                    rules: [{
                      required: true, message: '不能为空',
                    }, {
                      min: 60, message: '文字长度太短, 要求长度最少为60',
                    }, {
                      max: 200, message: '文字长度太长, 要求长度最多为200',
                    }],
                  })(
                    <div className={styles.textareaBox}>
                      <textarea
                        onChange={(e) => this.handleTaskChange(e, 'industry_introduction')}
                        placeholder="根据你选择的标题，针对这个商品在该方面的特色和优势进行补充说明，限200字">
                      </textarea>
                      <span style={{ color: formData.industry_introduction.length>200 ? 'red' : '#666' }} className={styles.textareaNum}>
                        {formData.industry_introduction.length}/200
                      </span>
                    </div>
                  )}
                </FormItem>
              </div>
              
              <div>
                <p className={styles.lineTitleDefult}>
                  配图
                </p>
                <label className={styles.uploadImgBox} style={{ width: 130, height: 130 }}>
                  <div>
                    <Icon type="plus" className={styles.uploadIcon} />
                    <p>添加上传图片</p>
                  </div>
                </label>
                <p className={styles.promptTextRed}></p>
                <p className={styles.promptText}>宽度702px以上，无文字、清晰有质感</p>
              </div>
            </article>
            <article className={styles.goodsArticle}> 
              <p className={styles.lineTitleBlue}>品牌故事</p>
              <div>
                <p className={styles.lineTitleDefult}>
                  品牌名称
                </p>
                <FormItem
                >
                  {getFieldDecorator('brand_name', {
                    rules: [{
                      required: true, message: '不能为空',
                    }, {
                      max: 30, message: '文字长度太长, 要求长度最多为30',
                    }],
                  })(
                    <div className={styles.InputBox}>
                      <input
                        onChange={(e) => this.handleTaskChange(e, 'brand_name')}
                        placeholder="限30个字"
                      />
                      <span style={{ color: formData.brand_name.length>30 ? 'red' : '#666' }} className={styles.inputNum}>
                        {formData.brand_name.length}/30
                      </span>
                    </div>
                  )}
                </FormItem>
                <p className={styles.promptTextRed}></p>
              </div>
               <div>
                <p className={styles.lineTitleDefult}>
                  介绍
                </p>
                <FormItem
                  // {...formItemLayout}
                >
                  {getFieldDecorator('brand_introduction', {
                    rules: [{
                      required: true, message: '不能为空',
                    }, {
                      max: 200, message: '文字长度太长, 要求长度最多为200',
                    }],
                  })(
                    <div className={styles.textareaBox}>
                      <textarea
                        onChange={(e) => this.handleTaskChange(e, 'brand_introduction')}
                        placeholder="根据你选择的标题，针对这个商品在该方面的特色和优势进行补充说明，限200字">
                      </textarea>
                      <span style={{ color: formData.brand_name.length>200 ? 'red' : '#666' }} className={styles.textareaNum}>
                        {formData.brand_introduction.length}/200
                      </span>
                    </div>
                  )}
                </FormItem>
                <p className={styles.promptTextRed}></p>
                <p className={styles.promptText}>请填写品牌特色和故事，限200字</p>
              </div>
              <div>
                <p className={styles.lineTitleDefult}>
                  品牌logo
                </p>
                <label className={styles.uploadImgBox} style={{ width: 200, height: 83 }}>
                  <div>
                    <Icon type="plus" className={styles.uploadIcon} />
                    <p>添加上传图片</p>
                  </div>
                </label>
                <p className={styles.promptTextRed}></p>
                <p className={styles.promptText}>固定360*150，无文字、清晰、有质感</p>
              </div>
            </article>
          </section>
        }
        <AlbumModal mode="single" k={this.state.k} minSize={this.state.minSize} onOk={this.handleCropCoverImg}/>
        <CropperModal onOk={this.handleAddCoverImg}/>
      </div>
    );
  }
}
