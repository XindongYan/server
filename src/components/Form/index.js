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
import styles from './index.less';

export default class TaskForm extends PureComponent {
  state = {}
  handleChange = (name, value) => {
    const index = this.props.children.findIndex(item => item.name === name);
    if (index >= 0) {
      const children = Object.assign([], this.props.children);
      children[index].props.value = value;
      if (this.props.onChange) this.props.onChange(children);
    }
  }
  render() {
    const { form, children, operation, activityId } = this.props;
    const pushDaren = children.find(item => item.name === 'pushDaren');
    const coverCount = children.find(item => item.name === 'coverCount');
    const itemSpuOption = children.find(item => item.name === 'itemSpuOption');
    const tempChildren = [...children];
    const formComponents = [];
    if (itemSpuOption && itemSpuOption.props.value === 'spu') {
      tempChildren[1] = {
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
    tempChildren.forEach((item, index) => {
      if (item.component === 'Input') {
        formComponents.push(<Input key={index} form={form} name={item.name} props={item.props} rules={item.rules} onChange={value => this.handleChange(item.name, value)} operation={operation} />);
      } else if (item.component === 'Editor') {
        formComponents.push(<Editor key={index} form={form} name={item.name} props={item.props} rules={item.rules} onChange={value => this.handleChange(item.name, value)} operation={operation} activityId={activityId || 0} />);
      } else if (item.component === 'CascaderSelect') {
        formComponents.push(<CascaderSelect key={index} form={form} name={item.name} props={item.props} rules={item.rules} onChange={value => this.handleChange(item.name, value)} operation={operation} />);
      } else if (item.component === 'CreatorAddImage') {
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
        }
        formComponents.push(<CreatorAddImage key={index} form={form} name={item.name} props={tempProps} rules={tempRules} onChange={value => this.handleChange(item.name, value)} operation={operation} />);
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