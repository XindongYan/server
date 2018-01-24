import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Icon, message, Tag, Tooltip, Form, Select } from 'antd';
import styles from './GoodProductionForm.less';
import AlbumModal from '../AlbumModal';
import AuctionModal from '../AuctionModal';
import CropperModal from '../AlbumModal/CropperModal';

import { CascaderSelect } from './FormParts/index';

const FormItem = Form.Item;
const { TextArea } = Input;
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
  }
  componentDidMount() {
    if (this.props.operation !== 'view') {
      const { formData } = this.props;
      const fieldsValue = {
        title: formData.title,
        task_desc: formData.task_desc,
        industry_title: formData.industry_title,
        industry_introduction: formData.industry_introduction,
        brand_name: formData.brand_name,
        brand_introduction: formData.brand_introduction,
      };
      this.props.form.setFieldsValue(fieldsValue);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.operation !== 'view') {
      const { formData } = nextProps;
      if (!this.props.formData.title && nextProps.formData.title) {
        const fieldsValue = {
          title: formData.title,
          task_desc: formData.task_desc,
          industry_title: formData.industry_title,
          industry_introduction: formData.industry_introduction,
          brand_name: formData.brand_name,
          brand_introduction: formData.brand_introduction,
        };
        this.props.form.setFieldsValue(fieldsValue);
      }
    }
  }
  componentWillUnmount() {
    
  }
  handleAuctionShow = () => {
    this.props.dispatch({
      type: 'auction/show',
      payload: { currentKey: 'havegoods' }
    });
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
    data[key] = e.target.value.trim();
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
  handleAddProduct = (auction, img) => {
    if (this.props.onChange) this.props.onChange({
      auction: {
        checked: false,
        coverUrl: img,
        finalPricePc:0,
        finalPriceWap:0,
        images: auction.images,
        itemId: auction.item.itemId,
        materialId: auction.materialId,
        price: auction.item.finalPrice,
        rawTitle: auction.title,
        resourceUrl: auction.item.itemUrl,
        title: auction.title,
      }
    });
  }
  handleClearProduct = () => {
    if (this.props.onChange) this.props.onChange({
      auction: {},
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
      <div style={{ width: 375 }}>
        <div className={styles.taskTitBox} style={{lineHeight: '40px',background: '#f5f5f5', textIndent: '1em', fontSize: 14, color: '#333'}}>
          内容创作
        </div>
        { (operation==='edit' || operation === 'create') &&
          <section className={styles.taskContentBox}>
            <article className={styles.goodsArticle}>
              <div>
                <div className={styles.task_img_list}>
                  { !(formData.auction && formData.auction.itemId) &&
                    <label className={styles.uploadImgBox} style={{ width: 120, height: 120 }} onClick={this.handleAuctionShow}>
                      <div>
                        <Icon type="plus" className={styles.uploadIcon} />
                        <p>添加一个宝贝</p>
                      </div>
                    </label>
                  }
                  { formData.auction && formData.auction.itemId &&
                    <div className={styles.imgShowBox} style={{ width: 120, height: 120 }}>
                      <img src={formData.auction.coverUrl} />
                      <div className={styles.clearImg} onClick={this.handleClearProduct}>
                        <Icon type="delete" />
                      </div>
                    </div>
                  }
                </div>
              </div>
              <div>
                <div className={styles.InputBox} style={{ border: 'none' }}>
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
                        style={{ fontSize: '18px' }}
                        suffix={<span style={{ color: formData.title.length>19 ? 'red' : '#666' }} className={styles.inputNum}>
                          {formData.title.length}/19
                        </span>}
                        onChange={(e) => this.handleTaskChange(e.target.value, 'title')}
                        placeholder="请在这里输入标题"
                      />
                    )}
                  </FormItem>
                  
                </div>
              </div>

              <CascaderSelect form={this.props.form} formData={formData} onChange={this.handleTaskChange} rules={false} />
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
            
            <article>
              <div className={styles.taskList}>
                <FormItem>
                  {getFieldDecorator('duanliangdian', {

                  })(
                    <Select
                      mode="tags"
                      disabled={false}
                      style={{ width: '100%' }}
                      placeholder="选择标签或输入标签"
                      onChange={(e) => this.handleChange(e, 'duanliangdian')}
                    >
                    
                    </Select>
                  )}
                </FormItem>
                <p className={styles.promptGray}>输入 [回车] 键 完成单个标签添加</p>
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
                  { formData.auction && formData.auction.itemId &&
                    <div className={styles.imgShowBox} style={{ width: 120, height: 120 }}>
                      <a href={formData.auction.resourceUrl}>
                        <img src={formData.auction.coverUrl} />
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
        <AuctionModal k="havegoods" onOk={this.handleAddProduct} product={292} />
        <CropperModal onOk={this.handleAddCoverImg}/>
      </div>
    );
  }
}
