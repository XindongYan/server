import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Icon, message, Tag, Tooltip, Form } from 'antd';
import styles from './GoodProductionForm.less';
import AlbumModal from '../AlbumModal';
import TaobaoAuction from '../TaobaoAuction';
import CropperModal from '../AlbumModal/CropperModal';
import CascaderSelect from '../Forms/CascaderSelect';

const FormItem = Form.Item;
@connect(state => ({

}))

export default class GoodProductionForm extends PureComponent {
  state = {
    longPoint: '',
    shortPoint: '',
    minSize: {
      width: 0,
      height: 0,
    },
    k: '',
    auctionVisible: false,
  }
  componentDidMount() {
    
  }
  componentWillReceiveProps(nextProps) {
    
  }
  componentWillUnmount() {
    
  }

  handleAuctionHide = () => {
    this.setState({
      auctionVisible: false,
    })
  }
  handlePointClose = (e, removedTag, key) => {
    e.preventDefault();
    const advantage = this.props.formData[key].filter(tag => tag !== removedTag);
    const data = {};
    data[key] = advantage;
    if (this.props.onChange) this.props.onChange(data)
  }
  handlePointChange = (e, key) => {
    const data = {};
    data[key] = e.target.value;
    this.setState({ ...data });
  }
  handlePointConfirm = (min, max, k, key) => {
    const { formData } = this.props;
    const str = this.state[k];
    if (str && str.length >= min && str.length <= max ) {
      const data = {};
      data[key] = [ ...formData[key], str ]
      if (formData[key].indexOf(str) === -1) {
        if (this.props.onChange) this.props.onChange(data);
      }
      const point = {};
      point[k] = '';
      this.setState({ ...point });
    }
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
  uploadCoverImg = (key,width,height) => {
    this.setState({
      k: key,
      minSize: {
        width: width,
        height: height,
      },
    },() => {
      this.props.dispatch({
        type: 'album/show',
        payload: { currentKey: key }
      });
    })
  }
  handleTaskChange = (value, key) => {
    const data = {};
    data[key] = value;
    if (this.props.onChange) this.props.onChange(data);
  }
  handleAddCoverImg = (url) => {
    const { k } = this.state;
    const data = {};
    if (k === 'cover_imgs') {
      data[k] = [ ...this.props.formData.cover_imgs, url ];
    } else {
      data[k] = url;
    }
    if (this.props.onChange) this.props.onChange(data);
  }
  handleCropCoverImg = (imgs) => {
    const { minSize, k } = this.state;
    if (imgs[0]) {
      if (k === 'industry_img') {
        this.handleAddCoverImg(imgs[0].url);
      } else {
        this.props.dispatch({
          type: 'album/showCropper',
          payload: {
            visible: true,
            src: imgs[0].url,
            width: minSize.width,
            height: minSize.height,
            picHeight: imgs[0].picHeight,
            picWidth: imgs[0].picWidth,
            cropperKey: k,
          }
        });
      }
    }
  }
  handleAddProduct = (url, img) => {
    if (this.props.onChange) this.props.onChange({
      product_url: url,
      product_img: img,
    });
  }
  handleClearProduct = () => {
    if (this.props.onChange) this.props.onChange({
      product_url: '',
      product_img: '',
    });
  }
  handleRemoveImg = (key, index) => {
    const data = {};
    if (key === 'cover_imgs') {
      const arr = this.props.formData.cover_imgs.filter((item, i) => {
        return i !== index;
      })
      data[key] = arr;
    } else {
      data[key] = '';
    }
    if (this.props.onChange) this.props.onChange(data);
  }
  handleSubmit = () => {
    console.log(1)
  }

  render() {
    const { style, operation, formData } = this.props;
    const { task, longPoint, shortPoint } = this.state;
    let getFieldDecorator = null;
    if (this.props.form) {
      getFieldDecorator = this.props.form.getFieldDecorator;
    }
    const tagStyle = {
      height: 32,
      lineHeight: '32px',
      paddingLeft: 12,
      background: '#fff',
      margin: '3px',
    }
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
                  { !formData.product_img &&
                    <label className={styles.uploadImgBox} style={{ width: 120, height: 120 }} onClick={() => {this.setState({ auctionVisible: true })}}>
                      <div>
                        <Icon type="plus" className={styles.uploadIcon} />
                        <p>上传宝贝</p>
                      </div>
                    </label>
                  }
                  { formData.product_img &&
                    <div className={styles.imgShowBox} style={{ width: 120, height: 120 }}>
                      <img src={formData.product_img} />
                      <div className={styles.clearImg} onClick={this.handleClearProduct}>
                        <Icon type="delete" />
                      </div>
                    </div>
                  }
                </div>
              </div>
              <div>
                <FormItem>
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
                        value={formData.title}
                        onChange={(e) => this.handleTaskChange(e.target.value, 'title')}
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
                <FormItem>
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
                        value={formData.task_desc}
                        onChange={(e) => this.handleTaskChange(e.target.value, 'task_desc')}
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
              <CascaderSelect form={this.props.form} formData={formData} onChange={this.handleTaskChange} />


              <div>
                <p className={styles.lineTitleDefult}>
                  上传宝贝图
                </p>
                <div className={styles.clearFix}>
                  { formData.cover_imgs && formData.cover_imgs.length > 0 &&
                    formData.cover_imgs.map((img,index) =>
                    <div className={styles.imgShowBox} style={{ width: 200, height: 200, float: 'left' }} key={index}>
                      <img src={img} />
                      <div className={styles.clearImg} onClick={() => this.handleRemoveImg('cover_imgs',index)}>
                        <Icon type="delete" />
                      </div>
                    </div>)
                  }
                  { formData.cover_imgs.length < 5 &&
                    <label className={styles.uploadImgBox} style={{ width: 200, height: 200, float: 'left' }} onClick={() => this.uploadCoverImg('cover_imgs',500,500)}>
                      <div>
                        <Icon type="plus" className={styles.uploadIcon} />
                        <p>上传封面</p>
                      </div>
                    </label>
                  }
                </div>
                <p className={styles.promptTextRed}></p>
                <p className={styles.promptText}>请上传3-5张商品图片，尺寸不小于500*500，默认选取第一张作为频道首页店铺列表页封面图</p>
              </div>

              
              <div>
                <p className={styles.lineTitleDefult}>
                  白底图
                </p>
                { !formData.white_bg_img &&
                  <label className={styles.uploadImgBox} style={{ width: 200, height: 200 }} onClick={() => this.uploadCoverImg('white_bg_img',500,500)}>
                    <div>
                      <Icon type="plus" className={styles.uploadIcon} />
                      <p>添加上传图片</p>
                    </div>
                  </label>
                }
                { formData.white_bg_img &&
                  <div className={styles.imgShowBox} style={{ width: 200, height: 200 }}>
                    <img src={formData.white_bg_img} />
                    <div className={styles.clearImg} onClick={() => this.handleRemoveImg('white_bg_img')}>
                      <Icon type="delete" />
                    </div>
                  </div>
                }
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
                        <Tag style={tagStyle} key={index} closable={true} onClose={(e) => this.handlePointClose(e, tag, 'long_advantage')}>
                          {tag}
                        </Tag>
                      );
                    })}
                  </span>
                  {  formData.long_advantage.length < 3 &&
                    <span>
                      <Input
                        ref={this.saveInputRef}
                        type="text"
                        style={{ width: 150, border: 'none', marginTop: 3 }}
                        value={longPoint}
                        onChange={(e) => this.handlePointChange(e, 'longPoint')}
                        onPressEnter={() => this.handlePointConfirm(12, 20, 'longPoint', 'long_advantage')}
                        placeholder="选择标签或输入标签"
                      />
                    </span>
                  }
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
                        <Tag style={tagStyle} key={index} closable={true} onClose={(e) => this.handlePointClose(e, tag, 'short_advantage')}>
                          {tag}
                        </Tag>
                      );
                    })}
                  </span>
                  { formData.short_advantage.length < 3 &&
                    <span>
                      <Input
                        ref={this.saveInputRef}
                        type="text"
                        style={{ width: 150, border: 'none', marginTop: 3 }}
                        value={shortPoint}
                        onChange={(e) => this.handlePointChange(e, 'shortPoint')}
                        onPressEnter={() => this.handlePointConfirm(6, 12, 'shortPoint', 'short_advantage')}
                        placeholder="选择标签或输入标签"
                      />
                    </span>
                  }
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
                <FormItem>
                  {getFieldDecorator('industry_title', {
                    rules: [{
                      required: true, message: '不能为空',
                    }, {
                      max: 6, message: '文字长度太长, 要求长度最多为6',
                    }],
                  })(
                    <div className={styles.InputBox}>
                      <Input
                        value={formData.industry_title}
                        onChange={(e) => this.handleTaskChange(e.target.value, 'industry_title')}
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
                <FormItem>
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
                        value={formData.industry_introduction}
                        onChange={(e) => this.handleTaskChange(e.target.value, 'industry_introduction')}
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
                { !formData.industry_img &&
                  <label className={styles.uploadImgBox} style={{ width: 130, height: 130 }} onClick={() => this.uploadCoverImg('industry_img',0,0)}>
                    <div>
                      <Icon type="plus" className={styles.uploadIcon} />
                      <p>添加上传图片</p>
                    </div>
                  </label>
                }
                { formData.industry_img &&
                  <div className={styles.imgShowBox} style={{ width: 130, height: 130, lineHeight: '130px', textAlign: 'center' }}>
                    <img src={formData.industry_img} style={{ maxWidth: '100%', maxHeight: '100%', height: 'auto', width: 'auto' }} />
                    <div className={styles.clearImg} onClick={() => this.handleRemoveImg('industry_img')}>
                      <Icon type="delete" />
                    </div>
                  </div>
                } 
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
                <FormItem>
                  {getFieldDecorator('brand_name', {
                    rules: [{
                      required: true, message: '不能为空',
                    }, {
                      max: 30, message: '文字长度太长, 要求长度最多为30',
                    }],
                  })(
                    <div className={styles.InputBox}>
                      <input
                        value={formData.brand_name}
                        onChange={(e) => this.handleTaskChange(e.target.value, 'brand_name')}
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
                <FormItem>
                  {getFieldDecorator('brand_introduction', {
                    rules: [{
                      required: true, message: '不能为空',
                    }, {
                      max: 200, message: '文字长度太长, 要求长度最多为200',
                    }],
                  })(
                    <div className={styles.textareaBox}>
                      <textarea
                        value={formData.brand_introduction}
                        onChange={(e) => this.handleTaskChange(e.target.value, 'brand_introduction')}
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
                { !formData.brand_logo &&
                  <label className={styles.uploadImgBox} style={{ width: 200, height: 83 }} onClick={() => this.uploadCoverImg('brand_logo',360,150)}>
                    <div>
                      <Icon type="plus" className={styles.uploadIcon} />
                      <p>添加上传图片</p>
                    </div>
                  </label>
                }
                { formData.brand_logo &&
                  <div className={styles.imgShowBox} style={{ width: 200, height: 83 }}>
                    <img src={formData.brand_logo} />
                    <div className={styles.clearImg} onClick={() => this.handleRemoveImg('brand_logo')}>
                      <Icon type="delete" />
                    </div>
                  </div>
                }
                <p className={styles.promptTextRed}></p>
                <p className={styles.promptText}>固定360*150，无文字、清晰、有质感</p>
              </div>
            </article>
          </section>
        }
        { operation === 'view' &&
          <section className={styles.taskContentBox}>
            <article className={styles.articleView}>
              <div>
                <p className={styles.lineTitleDefult}>
                  商品宝贝
                </p>
                <div>
                  { formData.product_img &&
                    <div className={styles.imgShowBox} style={{ width: 120, height: 120 }}>
                      <a href={formData.product_url}>
                        <img src={formData.product_img} />
                      </a>
                    </div>
                  }
                </div>
              </div>
              <div>
                <p style={{ fontSize: 18 }}>{formData.title}</p>
              </div>
              <div>
                <p style={{ marginBottom: 20 }}>{formData.task_desc}</p>
              </div>
              
              <div>
                <p>
                  宝贝图
                </p>
                <div className={styles.clearFix}>
                  { formData.cover_imgs && formData.cover_imgs.length > 0 &&
                    formData.cover_imgs.map((img,index) =>
                    <div className={styles.imgShowBox} style={{ width: 200, height: 200, float: 'left' }} key={index}>
                      <img src={img} />
                    </div>)
                  }
                </div>
              </div>
              <div>
                <p>
                  白底图
                </p>
                { formData.white_bg_img &&
                  <div className={styles.imgShowBox} style={{ width: 200, height: 200 }}>
                    <img src={formData.white_bg_img} />
                  </div>
                }
              </div>
            </article>
            
            <article className={styles.articleView}> 
              <p className={styles.lineTitleBlue}>好在哪里</p>
              <div>
                <p className={styles.lineTitleDefult}>
                  宝贝长亮点
                </p>
                  <span>
                    { formData.long_advantage.map((tag, index) => {
                      return (
                        <Tag style={tagStyle} key={index}>
                          {tag}
                        </Tag>
                      );
                    })}
                  </span>
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
                <span>
                  { formData.short_advantage.map((tag, index) => {
                    return (
                      <Tag style={tagStyle} key={index}>
                        {tag}
                      </Tag>
                    );
                  })}
                </span>
                <p className={styles.promptTextRed}>
                  { shortPoint.length > 0 && ( shortPoint.length < 6 || shortPoint.length > 12) &&
                    "标签的字数必须在6～12之间"
                  }
                </p>
                <p className={styles.promptText}>提示：敲击【回车键】添加【宝贝短亮点】, 【宝贝短亮点】数量2-3个，每个【宝贝短亮点】字数6-12个字</p>
              </div>
            </article>
            <article className={styles.articleView}>  
              <p className={styles.lineTitleBlue}>行业补充</p>
              <div>
                <p className={styles.lineTitleDefult}>
                  标题
                </p>
                <div className={styles.InputBox}>
                  <span style={{ fontSize: 16 }}>
                    {formData.industry_title}
                  </span>
                </div>
              </div>
              <div>
                <p className={styles.lineTitleDefult}>
                  介绍
                </p>
                <div>
                  <span>
                    {formData.industry_introduction}
                  </span>
                </div>
              </div>
              <div>
                <p className={styles.lineTitleDefult}>
                  配图
                </p>
                { formData.industry_img &&
                  <div className={styles.imgShowBox} style={{ width: 130, height: 130, lineHeight: '130px', textAlign: 'center' }}>
                    <img src={formData.industry_img} style={{ maxWidth: '100%', maxHeight: '100%', height: 'auto', width: 'auto' }} />
                  </div>
                }
              </div>
            </article>
            <article className={styles.articleView}> 
              <p className={styles.lineTitleBlue}>品牌故事</p>
              <div>
                <p className={styles.lineTitleDefult}>
                  品牌名称
                </p>
                <div>
                  <span style={{ fontSize: 16 }}>
                    {formData.brand_name}
                  </span>
                </div>
              </div>
               <div>
                <p className={styles.lineTitleDefult}>
                  介绍
                </p>
                <div>
                  <span>
                    {formData.brand_introduction}
                  </span>
                </div>
              </div>
              <div>
                <p className={styles.lineTitleDefult}>
                  品牌logo
                </p>
                { formData.brand_logo &&
                  <div className={styles.imgShowBox} style={{ width: 200, height: 83 }}>
                    <img src={formData.brand_logo} />
                  </div>
                }
              </div>
            </article>
          </section>
        }
        <AlbumModal mode="single" k={this.state.k} minSize={this.state.minSize} onOk={this.handleCropCoverImg}/>
        <TaobaoAuction visible={this.state.auctionVisible} onOk={this.handleAddProduct} onCancel={this.handleAuctionHide} />
        <CropperModal onOk={this.handleAddCoverImg}/>
      </div>
    );
  }
}
