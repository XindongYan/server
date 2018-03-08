import React, { PureComponent } from 'react';
import { Card } from 'antd';
import CreatorAddImage from './CreatorAddImage';
import TagPicker from './TagPicker';
import CascaderSelect from './CascaderSelect';
import AnchorImageList from './AnchorImageList';
import AddLink from './AddLink';
import StructCanvas from './StructCanvas/StructCanvas';
import Input from './Input';
import Editor from './Editor/index.js';
import RadioGroup from './RadioGroup';
import CreatorAddItem from './CreatorAddItem';
import CreatorAddSpu from './CreatorAddSpu';
import AddTag from './AddTag';
import Rating from './Rating';
import Title from './Title';
import styles from './index.less';

export default class TaskForm extends PureComponent {
  state = {}
  handleChange = (name, value) => {
    const index = this.props.children.findIndex(item => item.name === name);
    if (index >= 0) {
      const children = Object.assign([], this.props.children);
      children[index].props.value = value;


      const coverCount = children.find(item => item.name === 'coverCount');
      const itemSpuOption = children.find(item => item.name === 'itemSpuOption');
      const shopStoryContentType = children.find(item => item.name === 'shopStoryContentType');
      const shopStoryKeeperDescription = children.find(item => item.name === 'shopStoryKeeperDescription');
      const shopStoryKeeperId = children.find(item => item.name === 'shopStoryKeeperId');
      const tempChildren = [...children];
      if (itemSpuOption && itemSpuOption.props.value === 'spu') {
        const bodySpuIndex = tempChildren.findIndex(item => item.name === 'bodySpu');
        tempChildren[bodySpuIndex] = {
          "className": "creator-single-item-center creator-no-label",
          "component": "CreatorAddSpu",
          "label": "商品SPU",
          "name": "bodySpu",
          "props": {
            "enableExtraBanner": true,
            "activityId": activityId,
            "min": 1,
            "max": 1,
            "addImageProps": {
              "pixFilter": "500x500"
            },
            "triggerTips": "添加一个产品",
            "className": "creator-single-item-center creator-no-label",
            "label": "商品SPU",
            "value": []
          },
          "rules": [{
            "min": 1,
            "type": "array",
            "message": "或上传1个产品"
          }, {
            "max": 1,
            "type": "array",
            "message": "最多允许1个"
          }],
          "updateOnChange": "true"
        };
      }
      if (shopStoryContentType && (shopStoryContentType.props.value === 'people' || shopStoryContentType.props.value === 'designer')) {
        if (!shopStoryKeeperDescription) {
          tempChildren.push({
            "component": "Input",
            "label": "店主一句话介绍",
            "name": "shopStoryKeeperDescription",
            "props": {
              "label": "店主一句话介绍",
              "placeholder": "请输入9-15字的店主一句话介绍",
              "value": "",
              "tips": "请输入9-15字的店主一句话介绍",
              "cutString": false,
              "maxLength": 15,
              "hasLimitHint": true
            },
            "rules": [{
              "min": 9,
              "type": "string",
              "message": "文字长度太短, 要求长度最少为9"
            }, {
              "max": 15,
              "type": "string",
              "message": "文字长度太长, 要求长度最多为15"
            }],
            "tips": "请输入9-15字的店主一句话介绍"
          });
        }
        if (!shopStoryKeeperId) {
          tempChildren.push({
            "component": "Input",
            "label": "店主身份",
            "name": "shopStoryKeeperId",
            "props": {
              "label": "店主身份",
              "placeholder": "请输入3-12字的店主身份",
              "value": "",
              "tips": "请输入3-12字的店主身份",
              "cutString": false,
              "maxLength": 12,
              "hasLimitHint": true
            },
            "rules": [{
              "min": 3,
              "type": "string",
              "message": "文字长度太短, 要求长度最少为3"
            }, {
              "max": 12,
              "type": "string",
              "message": "文字长度太长, 要求长度最多为12"
            }],
            "tips": "请输入3-12字的店主身份"
          });
        }
      } else if (shopStoryContentType && shopStoryContentType.props.value === 'shop') {
        if (shopStoryKeeperDescription) {
          const shopStoryKeeperDescriptionIndex = tempChildren.findIndex(item => item.name === shopStoryKeeperDescription.name);
          tempChildren.splice(shopStoryKeeperDescriptionIndex, 1);
        }
        if (shopStoryKeeperId) {
          const shopStoryKeeperIdIndex = tempChildren.findIndex(item => item.name === shopStoryKeeperId.name);
          tempChildren.splice(shopStoryKeeperIdIndex, 1);
        } 
      }
      tempChildren.forEach((item, index) => {
        if (item.component === 'CreatorAddImage') {
          let tempProps = {...item.props};
          let tempRules = item.rules;
          if (item.name === 'standardCoverUrl') {
            if (coverCount) {
              tempProps.min = Number(coverCount.props.value);
              tempProps.max = Number(coverCount.props.value);
            }
            if (coverCount && Number(coverCount.props.value) === 3) {
              tempRules = [{
                "min": 3,
                "type": "array",
                "message": "至少要有3个"
              }, {
                "max": 3,
                "type": "array",
                "message": "最多允许3个"
              }];
            }
            tempChildren[index].props = tempProps;
            tempChildren[index].rules = tempRules;
          }
        }
      });
      if (this.props.onChange) this.props.onChange(tempChildren);
    }
  }
  render() {
    const { form, children, operation, activityId } = this.props;
    const coverCount = children.find(item => item.name === 'coverCount');
    const itemSpuOption = children.find(item => item.name === 'itemSpuOption');
    const formComponents = [];
    children.forEach((item, index) => {
      if (item.component === 'Input') {
        formComponents.push(<Input key={index} form={form} name={item.name} props={item.props} rules={item.rules} onChange={value => this.handleChange(item.name, value)} operation={operation} />);
      } else if (item.component === 'Editor') {
        formComponents.push(<Editor key={index} form={form} name={item.name} props={item.props} rules={item.rules} onChange={value => this.handleChange(item.name, value)} operation={operation} activityId={activityId || 0} />);
      } else if (item.component === 'CascaderSelect') {
        formComponents.push(<CascaderSelect key={index} form={form} name={item.name} props={item.props} rules={item.rules} onChange={value => this.handleChange(item.name, value)} operation={operation} />);
      } else if (item.component === 'CreatorAddImage') {
        formComponents.push(<CreatorAddImage key={index} form={form} name={item.name} props={item.props} rules={item.rules} onChange={value => this.handleChange(item.name, value)} operation={operation} />);
      } else if (item.component === 'RadioGroup') {
        formComponents.push(<RadioGroup key={index} form={form} name={item.name} props={item.props} rules={item.rules} onChange={value => this.handleChange(item.name, value)} operation={operation} />);
      } else if (item.component === 'AddLink') {
        formComponents.push(<AddLink key={index} form={form} name={item.name} props={item.props} rules={item.rules} onChange={value => this.handleChange(item.name, value)} operation={operation} />);
      } else if (item.component === 'CreatorAddItem') {
        formComponents.push(<CreatorAddItem key={index} form={form} name={item.name} props={item.props} rules={item.rules} onChange={value => this.handleChange(item.name, value)} operation={operation} />);
      } else if (item.component === 'CreatorAddSpu') {
        formComponents.push(<CreatorAddSpu key={index} form={form} name={item.name} props={item.props} rules={item.rules} onChange={value => this.handleChange(item.name, value)} operation={operation} />);
      } else if (item.component === 'AddTag') {
        formComponents.push(<AddTag key={index} form={form} name={item.name} props={item.props} rules={item.rules} onChange={value => this.handleChange(item.name, value)} operation={operation} />);
      } else if (item.component === 'TagPicker') {
        formComponents.push(<TagPicker key={index} form={form} name={item.name} props={item.props} rules={item.rules} onChange={value => this.handleChange(item.name, value)} operation={operation} />);
      } else if (item.component === 'AnchorImageList') {
        formComponents.push(<AnchorImageList key={index} form={form} name={item.name} props={item.props} rules={item.rules} onChange={value => this.handleChange(item.name, value)} operation={operation} />);
      } else if (item.component === 'StructCanvas') {
        formComponents.push(<StructCanvas key={index} form={form} name={item.name} props={item.props} rules={item.rules} onChange={value => this.handleChange(item.name, value)} operation={operation} />);
      } else if (item.component === 'Rating') {
        formComponents.push(<Rating key={index} form={form} name={item.name} props={item.props} rules={item.rules} onChange={value => this.handleChange(item.name, value)} operation={operation} />);
      } else if (item.component === 'Title') {
        formComponents.push(<Title key={index} form={form} name={item.name} props={item.props} rules={item.rules} onChange={value => this.handleChange(item.name, value)} operation={operation} />);
      }
    });
    return (
      <div>
        <p className={styles.titleDefult}>内容创作</p>
        <Card bordered={false} bodyStyle={{ padding: '20px 0 40px' }}>
          {formComponents}
        </Card>
      </div>
    )
  }
}