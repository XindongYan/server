import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Icon, message, Tag, Tooltip, Form, Popover, Anchor, Button } from 'antd';
import styles from './GoodProductionForm.less';
import AlbumModal from '../AlbumModal';
import AuctionModal from '../AuctionModal';
import CropperModal from '../AlbumModal/CropperModal';

import { CascaderSelect, BodyStructContent, AuctionImageModal } from './FormParts/index';

const FormItem = Form.Item;
const { TextArea } = Input;
@connect(state => ({

}))

export default class GoodProductionForm extends PureComponent {
  state = {
    longPoint: '',
    longpointContent: [],
    shortPoint: '',
    minSize: {
      width: 0,
      height: 0,
    },
    k: '',
    visibleLongpoint: false,
    visibleBodyStruct: 5,
  }
  componentDidMount() {
    const { formData } = this.props;
    if (formData.bodyStruct0 && formData.bodyStruct0.length > 0) {
      this.setState({
        longpointContent: formData.bodyStruct0,
      })
    }
    const fieldsValue = {
      title: formData.title,
    };
    this.props.form.setFieldsValue(fieldsValue);
  }
  componentWillReceiveProps(nextProps) {
    const { formData } = nextProps;
    if (!this.props.formData.title && nextProps.formData.title) {
      if (formData.bodyStruct0 && formData.bodyStruct0.length > 0) {
        this.setState({
          longpointContent: formData.bodyStruct0,
        })
      }
      const fieldsValue = {
        title: formData.title,
      };
      this.props.form.setFieldsValue(fieldsValue);
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
    if (key === 'duanliangdian') {
      if (this.props.onChange) this.props.onChange(data)
    } else {
      this.setState({
        longpointContent: [ ...this.state.longpointContent.filter(tag => tag !== removedTag) ],
      })
    }
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
        if (k === 'shortPoint') {
          if (this.props.onChange) this.props.onChange(data);
        } else {
          this.setState({
            longpointContent: [ ...this.state.longpointContent, str ],
          })
        }
      }
      const point = {};
      point[k] = '';
      this.setState({ ...point });
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
  handleAddProduct = (auction, img) => {
    if (this.props.onChange) this.props.onChange({
      body: [{
        checked: false,
        finalPricePc:0,
        finalPriceWap:0,
        images: auction.images,
        itemId: auction.item.itemId,
        materialId: auction.materialId,
        price: auction.item.finalPrice,
        rawTitle: auction.title,
        resourceUrl: auction.item.itemUrl,
        title: auction.title,
        coverUrl: img,
      }]
        // extraBanners: 
    });
    this.props.dispatch({
      type: 'album/showAuctionImage',
    })
  }
  handleClearProduct = () => {
    if (this.props.onChange) this.props.onChange({
      body: [],
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

  handleShowLongpoint = () => {
    if (this.props.operation !== 'view') {
      this.setState({
        visibleLongpoint: true,
        visibleBodyStruct: 5,
      })
    }
  }
  renderLongpointTitle = () => {
    return (<div style={{ position: 'relative', height: 32, lineHeight: '32px' }}>
      <span>宝贝亮点</span>
      <Icon
        onClick={() => {this.setState({ visibleLongpoint: false })}}
        style={{ position: 'absolute', right: 0, top: 0, fontSize: 18, paddingTop: 6, cursor: 'pointer' }} type="close" />
    </div>)
  }
  renderLongpointContent = () => {
    const { longPoint, longpointContent} = this.state;
    const tagStyle = {
      height: 32,
      lineHeight: '32px',
      paddingLeft: 12,
      background: '#fff',
      margin: '3px',
    }
    return (<div style={{ padding: '0 0 20px' }}>
      <p className={styles.lineTitleDefult}>
        亮点描述
      </p>
      <label className={styles.pointBox}>
        <span>
          { longpointContent.map((tag, index) => {
            return (
              <Tag style={tagStyle} key={index} closable={true} onClose={(e) => this.handlePointClose(e, tag, 'bodyStruct0')}>
                {tag}
              </Tag>
            );
          })}
        </span>
        { longpointContent.length < 3 &&
          <span>
            <Input
              ref={this.saveInputRef}
              type="text"
              style={{ width: 150, border: 'none', marginTop: 3 }}
              value={longPoint}
              onChange={(e) => this.handlePointChange(e, 'longPoint')}
              onPressEnter={() => this.handlePointConfirm(12, 20, 'longPoint', 'bodyStruct0')}
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
      <p className={styles.promptText}>
        提示：敲击【回车键】添加【亮点描述】, 【亮点描述】数量2-3个，每个【亮点描述】字数12-20个字
      </p>
      <div style={{ height: 40, marginTop: 20 }}>
        <Button type="primary" onClick={this.handleAddBodyStruct0} style={{ float: 'right' }}>确认</Button>
      </div>
    </div>)
  }
  renderBodyStructTitle = () => {
    return (<div style={{ position: 'relative', height: 32, lineHeight: '32px' }}>
      <span>编辑段落</span>
      <Icon
        onClick={() => {this.setState({ visibleBodyStruct: 5 })}}
        style={{ position: 'absolute', right: 0, top: 0, fontSize: 18, paddingTop: 6, cursor: 'pointer' }} type="close" />
    </div>)
  }

  handleShowBodyStruct = (index) => {
    if (this.props.operation !== 'view') {
      this.setState({
        visibleLongpoint: false,
        visibleBodyStruct: index,
      })
    }
  }
  handleChangeBodyStruct = (index, content) => {
    const arr = this.props.formData.bodyStruct;
    arr[index] = content;
    if (this.props.onChange) this.props.onChange({ bodyStruct: arr });
    this.setState({
      visibleBodyStruct: 5,
    })
  }
  handleAddBodyStruct = () => {
    if (this.props.formData.bodyStruct.length <= 4) {
      if (this.props.onChange) this.props.onChange({ bodyStruct: [...this.props.formData.bodyStruct, {}] });
    }
  }
  handleAddBodyStruct0 = () => {
    if (this.state.longpointContent.length >= 2) {
      if (this.props.onChange) this.props.onChange({ bodyStruct0: [ ...this.state.longpointContent ] });
      this.setState({
        visibleLongpoint: false,
      })
    } else {
      message.warn('至少输入2个标签')
    }
  }
  handleChangeBodyImg = (coverUrl, extraBanners) => {
    const json = this.props.formData.body[0];
    console.log(json)
    if (this.props.onChange) this.props.onChange({ body: [{ ...this.props.formData.body[0], coverUrl, extraBanners }] });
  }
  handleDeleteContent = (index) => {
    const arr = this.props.formData.bodyStruct;
    arr.splice(index,1);
    if (this.props.onChange) this.props.onChange({ bodyStruct: [ ...arr ] });
  }
  render() {
    const { style, operation, formData} = this.props;
    const { task, longPoint, shortPoint,  } = this.state;
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
    const disabled = this.props.operation === 'view' ? true : false;
    return (
      <div style={{ width: 375 }}>
        <div className={styles.taskTitBox} style={{lineHeight: '40px',background: '#f5f5f5', textIndent: '1em', fontSize: 14, color: '#333'}}>
          内容创作
        </div>
        <section className={styles.taskContentBox}>
          <article className={styles.goodsArticle} style={{ padding: 20 }}>
            <div style={{ marginBottom: 20 }}>
              <div className={styles.task_img_list}>
                { !(formData.body && formData.body.length > 0) &&
                  <label className={styles.uploadImgBox} style={{ width: 120, height: 120 }} onClick={this.handleAuctionShow}>
                    <div>
                      <Icon type="plus" className={styles.uploadIcon} />
                      <p>添加一个宝贝</p>
                    </div>
                  </label>
                }
                { formData.body && formData.body.length > 0 &&
                  <div className={styles.imgShowBox} style={{ width: 120, height: 120 }}>
                    <img src={formData.body[0].coverUrl} />
                    { !disabled && <div className={styles.clearImg} onClick={this.handleClearProduct}>
                      <Icon type="delete" />
                    </div>}
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
                      disabled={disabled}
                    />
                  )}
                </FormItem>
              </div>
            </div>
          </article>

          <article className={styles.goodsArticle} style={{ background: '#fff', position: 'relative' }}>
            { !disabled && <Anchor style={{ position: 'absolute', top: 0, left: '-80px' }}>
              <div onClick={this.handleAddBodyStruct} style={{ width: 65, height: 65, padding: '6px 0', cursor: 'pointer', textAlign: 'center' }}>
                <div>
                  <img style={{ width: 30, height: 30 }} src="//img.alicdn.com/tfs/TB1Q4jRa.gQMeJjy0FfXXbddXXa-48-48.png" />
                </div>
                <div style={{ fontSize: 12, color: '#999' }}>
                  自定义段落
                </div>
              </div>
            </Anchor>}
            <Popover
              overlayClassName={styles.popover_box}
              placement="right"
              title={this.renderLongpointTitle()}
              content={this.renderLongpointContent()}
              trigger="click"
              visible={this.state.visibleLongpoint}
              autoAdjustOverflow={false}
            >
              <div style={{ padding: 20, border: this.state.visibleLongpoint ? '2px solid #00b395' : 'none' }} onClick={this.handleShowLongpoint}>
                <div className={styles.section_show_title}>
                  好在哪里
                </div>
                { formData.bodyStruct0 && formData.bodyStruct0.length > 0 ?
                  <ul>
                    {formData.bodyStruct0.map((item, index) => <li key={index} className={styles.longpoint_list_item}>{item}</li>)}
                  </ul> :
                  <ul>
                    {[0,1,2].map(item => <li key={item} className={styles.longpoint_list_item}>长亮点描述</li>)}
                  </ul>
                }
              </div>
            </Popover>
            { formData.bodyStruct.map((item, index) =><Popover style={{ padding: 20 }}
                key={index}
                overlayClassName={styles.popover_box}
                placement="right"
                title={this.renderBodyStructTitle()}
                content={<BodyStructContent onChange={this.handleChangeBodyStruct} formData={item} index={index} />}
                trigger="click"
                visible={this.state.visibleBodyStruct === index ? true : false}
                autoAdjustOverflow={false}
              >
                <div style={{ padding: 20, position: 'relative', border: this.state.visibleBodyStruct === index ? '2px solid #00b395' : 'none' }} onClick={() => this.handleShowBodyStruct(index)}>
                  <div className={styles.section_show_title}>
                    { item && item.title ? item.title : '请输入段落标题' }
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    { item && item.desc ? item.desc : '请输入段落介绍文本' }
                  </div>
                  <div>
                    <img
                      style={{ width: '100%', height: 'auto' }}
                      src={item && item.images ? item.images : 'https://gw.alicdn.com/tfs/TB1A5.geC_I8KJjy0FoXXaFnVXa-702-688.jpg_790x10000Q75.jpg_.webp'}
                    ></img>
                  </div>
                  { this.state.visibleBodyStruct === index &&
                    <div onClick={() => this.handleDeleteContent(index)} className={styles.deleteContentBox}>
                      <Icon type="delete" />
                    </div>
                  }
                </div>
              </Popover>)
            }
          </article>
          <article className={styles.goodsArticle} style={{ background: '#f5f5f5', padding: '0 0 20px' }}> 
            <div style={{ padding: 20 }}>
              <p className={styles.lineTitleDefult}>
                宝贝短亮点
              </p>
              <label className={styles.pointBox}>
                <span>
                  { formData.duanliangdian.map((tag, index) => {
                    return (
                      <Tag style={tagStyle} key={index} closable={!disabled} onClose={(e) => this.handlePointClose(e, tag, 'duanliangdian')}>
                        {tag}
                      </Tag>
                    );
                  })}
                </span>
                { formData.duanliangdian.length < 3 && !disabled &&
                  <span>
                    <Input
                      ref={this.saveInputRef}
                      type="text"
                      style={{ width: 150, border: 'none', marginTop: 3 }}
                      value={shortPoint}
                      onChange={(e) => this.handlePointChange(e, 'shortPoint')}
                      onPressEnter={() => this.handlePointConfirm(6, 12, 'shortPoint', 'duanliangdian')}
                      placeholder="选择标签或输入标签"
                    />
                  </span>
                }
              </label>
              { shortPoint.length > 0 && ( shortPoint.length < 6 || shortPoint.length > 12) &&
                <p className={styles.promptTextRed}>
                  标签的字数必须在6～12之间
                </p>
              }
              { shortPoint.length > 0 && ( shortPoint.length < 6 || shortPoint.length > 12) &&
                <p className={styles.promptTextRed}>
                  至少输入2个标签
                </p>
              }
              <p className={styles.promptText}>提示：敲击【回车键】添加【宝贝短亮点】, 【宝贝短亮点】数量2-3个，每个【宝贝短亮点】字数6-12个字</p>
            </div>

            <CascaderSelect disabled={disabled} operation={this.props.operation} form={this.props.form} formData={formData} onChange={this.handleTaskChange} rules={false} />
          </article>
        </section>
        <AuctionModal k="havegoods" onOk={this.handleAddProduct} product={292} />
        <AlbumModal mode="single" k={this.state.k} minSize={this.state.minSize} onOk={this.handleCropCoverImg}/>
        <CropperModal onOk={this.handleAddCoverImg}/>

        <AuctionImageModal formData={formData.body.length ? formData.body[0] : []} onChange={this.handleChangeBodyImg} />
      </div>
    );
  }
}
