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

import * as formRender from '../../utils/formRender';

export default class TaskForm extends PureComponent {
  state = {}
  handleChange = (name, value) => {
    const { activityId } = this.props;
    const index = this.props.children.findIndex(item => item.name === name);
    if (index >= 0) {
      const children = Object.assign([], this.props.children);
      children[index].props.value = value;

      const tempChildren = formRender.async(children, activityId);
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