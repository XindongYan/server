import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Icon, message, Row, Col, Tag, Button, Form, Anchor, Popover } from 'antd';
import styles from '../index.less';
import AlbumModal from '../../AlbumModal';
import AddTag from '../AddTag';
import BodyStructContent from './BodyStructContent';

const FormItem = Form.Item;
const { TextArea } = Input;
@connect(state => ({

}))
@Form.create()
export default class StructCanvas extends PureComponent {
  state = {
    spotVisible: false,
    paragraphVisible: -1,
    spot: [],
  }
  componentDidMount() {
    if (this.props.props.value[0].data.features) {
      this.setState({
        spot: this.props.props.value[0].data.features,
      });
    }
  }
  componentWillUnmount() {

  }
  handleShowSpot = () => {
    if (this.props.operation !== 'view') {
      this.setState({
        spotVisible: true,
        paragraphVisible: -1,
      });
    }
  }
  handleChangeSpot = (value) => {
    this.setState({
      spot: value,
    });
  }
  handleAddSpot = () => {
    const { props } = this.props;
    if (this.state.spot.length >= 2) {
      const newValue = props.value;
      newValue[0].data.features = this.state.spot;
      if (this.props.onChange) this.props.onChange(newValue);
      this.setState({
        spotVisible: false,
      });
    } else {
      message.warn('至少输入2个标签');
    }
  }
  renderSpotTitle = () => {
    return (<div style={{ position: 'relative', height: 32, lineHeight: '32px' }}>
      <span>宝贝亮点</span>
      <Icon
        onClick={() => {this.setState({ spotVisible: false })}}
        style={{ position: 'absolute', right: 0, top: 0, fontSize: 18, paddingTop: 6, cursor: 'pointer' }} type="close" />
    </div>)
  }
  renderSpotContent = () => {
    const { props } = this.props;
    const data = {
      label: "亮点描述（用于第一段展示）",
      maxLength: 20,
      minLength: 12,
      placeholder: "请在这里输入12-20字的宝贝长亮点",
      tips: "",
      value: this.state.spot || [],
    }
    const rules = [{
      "min": 2,
      "type": "array",
      "message": "至少要有2个"
    }, {
      "max": 3,
      "type": "array",
      "message": "最多允许3个"
    }];
    return (<div style={{ padding: '0 0 20px' }}>
      <AddTag form={this.props.form} name={this.props.name} props={data} rules={rules} onChange={this.handleChangeSpot} operation={this.props.operation} />
      <div style={{ height: 40, marginTop: 20 }}>
        <Button type="primary" onClick={this.handleAddSpot} style={{ float: 'right' }}>确认</Button>
      </div>
    </div>)
  }
  handleShowBodyStruct = (index) => {
    if (this.props.operation !== 'view') {
      this.setState({
        spotVisible: false,
        paragraphVisible: index,
      })
    }
  }
  handleAddBodyStruct = (key) => {
    const { props } = this.props;
    const propsData = props.sidebarBlockList.find(item => item.blockName === key);
    if (props.value.length < 5) {
      if (key === 'CustomParagraph') {
        const data = {
          attrs: propsData.moduleInfo.attrs,
          data: {},
          errorMsg: "",
          guid: "",
          materialId: propsData.moduleInfo.materialId,
          name: propsData.moduleInfo.name,
          resourceId: propsData.moduleInfo.id,
          moduleInfo: {dataSchema: propsData.moduleInfo.dataSchema},
          rule: propsData.moduleInfo.rule,
        }
        if (this.props.onChange) this.props.onChange([ ...props.value, data ]);
      }
    }
  }
  renderBodyStructTitle = () => {
    return (<div style={{ position: 'relative', height: 32, lineHeight: '32px' }}>
      <span>编辑段落</span>
      <Icon
        onClick={() => {this.setState({ paragraphVisible: -1 })}}
        style={{ position: 'absolute', right: 0, top: 0, fontSize: 18, paddingTop: 6, cursor: 'pointer' }} type="close" />
    </div>)
  }
  handleChangeBodyStruct = (index, content) => {
    const { props } = this.props;
    const newValue = props.value;
    newValue[index].data = content;
    if (this.props.onChange) this.props.onChange(newValue);
    this.setState({
      paragraphVisible: -1,
    });
  }
  handleDeleteContent = (index) => {
    const arr = this.props.props.value;
    arr.splice(index,1);
    if (this.props.onChange) this.props.onChange(arr);
  }
  render() {
    const { operation, props } = this.props;
    const { images } = this.state;
    let disabled = false;
    let bodyStructArr = [];
    if (operation === 'view') {
      disabled = true;
    }
    if (props.value.length > 1) {
      bodyStructArr = props.value;
      bodyStructArr = bodyStructArr.slice(1);
    }
    return (
      <div style={{ padding: '0 0 20px', position: 'relative'}}>
        { !disabled && <Anchor style={{ position: 'absolute', top: 0, left: '-80px' }}>
          {props.sidebarBlockList.map((item, index) => <div key={index} className={styles.sidebarBlockBox} onClick={() => this.handleAddBodyStruct(item.blockName)} style={{display: item.display ? '' : 'none'}}>
            <div>
              <img style={{ width: 30, height: 30 }} src={item.icon} />
            </div>
            <div style={{ fontSize: 12, color: '#999' }}>
              {item.title}
            </div>
          </div>)}
        </Anchor>}
        <Popover
          overlayClassName={styles.popover_box}
          placement="right"
          title={this.renderSpotTitle()}
          content={this.renderSpotContent()}
          trigger="click"
          visible={this.state.spotVisible}
          autoAdjustOverflow={false}
        >
          <div style={{ position: 'relative', padding: 20 }} onClick={this.handleShowSpot}>
            <div className={styles.borderBox} style={{display: this.state.spotVisible ? 'block' : 'none'}}></div>
            <div className={styles.section_show_title}>
              好在哪里
            </div>
            { props.value[0].data && props.value[0].data.features ?
              <ul>
                {props.value[0].data.features.map((item, index) => <li key={index} className={styles.longpoint_list_item}>{item}</li>)}
              </ul> :
              <ul>
                {[0,1,2].map(item => <li key={item} className={styles.longpoint_list_item}>长亮点描述</li>)}
              </ul>
            }
          </div>
        </Popover>
        { bodyStructArr && bodyStructArr.map((item, index) => <Popover style={{ padding: 20 }}
            key={index}
            overlayClassName={styles.popover_box}
            placement="right"
            title={this.renderBodyStructTitle()}
            content={<BodyStructContent onChange={this.handleChangeBodyStruct} value={item.data} index={index + 1} />}
            trigger="click"
            visible={this.state.paragraphVisible === index ? true : false}
            autoAdjustOverflow={false}
          >
            <div style={{ padding: 20, position: 'relative' }} onClick={() => this.handleShowBodyStruct(index)}>
              <div className={styles.borderBox} style={{display: this.state.paragraphVisible === index ? 'block' : 'none'}}></div>
              <div className={styles.section_show_title}>
                { item.data && item.data.title ? item.data.title : '请输入段落标题' }
              </div>
              <div style={{ marginBottom: 20 }}>
                { item.data && item.data.desc ? item.data.desc : '请输入段落介绍文本' }
              </div>
              <div>
                <img
                  style={{ width: '100%', height: 'auto' }}
                  src={item.data && item.data.images && item.data.images.length > 0 ? item.data.images[0].picUrl : 'https://gw.alicdn.com/tfs/TB1A5.geC_I8KJjy0FoXXaFnVXa-702-688.jpg_790x10000Q75.jpg_.webp'}
                ></img>
              </div>
              { this.state.paragraphVisible === index &&
                <div onClick={() => this.handleDeleteContent(index+1)} className={styles.deleteContentBox}>
                  <Icon type="delete" />
                </div>
              }
            </div>
          </Popover>)
        }
      </div>
    );
  }
}
