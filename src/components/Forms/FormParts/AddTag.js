import React, { PureComponent } from 'react';
import { Input, Form, Tag } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;

export default class AddTag extends PureComponent {
  state = {
    tagsValue: '',
    errMsg: '',
  }

  handleChangeTags = (e) => {
    const { props } = this.props;
    this.setState({
      tagsValue: e.target.value,
    });
    if (props.value.find(item => item === e.target.value)) {
      this.setState({
        errMsg: '不能添加重复的tag!'
      });
    } else if (e.target.value.length < props.minLength || e.target.value.length > props.maxLength) {
      this.setState({
        errMsg: '标签的字数范围必须6~12',
      });
    } else {
      this.setState({
        errMsg: ''
      });
    }
  }
  handleConfirmTags = () => {
    const { props } = this.props;
    const { tagsValue, errMsg } = this.state;
    if (tagsValue && tagsValue.trim().length > 0) {
      if (!errMsg) {
        if (this.props.onChange) this.props.onChange([ ...props.value, tagsValue ]);  
        this.setState({
          tagsValue: '',
        });
      }
    }
  }
  handleCloseTags = (e, removedTag) => {
    e.preventDefault();
    const { props } = this.props;
    const advantage = props.value.filter(tag => tag !== removedTag);
    if (this.props.onChange) this.props.onChange(advantage);
  }
  render() {
    const { name, props, rules, label, operation } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const value = getFieldValue(name);
    const lengthRules = {};
    let disabled = false;
    const tagStyle = {
      height: 32,
      lineHeight: '32px',
      paddingLeft: 12,
      background: '#fff',
      margin: '3px',
    }
    if (operation === 'view') {
      disabled = true;
    }
    if (rules.length > 0) {
      lengthRules.min = rules.find(item => item.min).min;
      lengthRules.max = rules.find(item => item.max).max;
    }
    return (
      <div style={{ padding: 20 }}>
        <p style={{ marginBottom: 10 }}>
          {label}
        </p>
        <label className={styles.pointBox}>
          <span>
            { props.value.map((tag, index) => {
              return (
                <Tag style={tagStyle} key={index} closable={!disabled} onClose={(e) => this.handleCloseTags(e, tag)}>
                  {tag}
                </Tag>
              );
            })}
          </span>
          {!disabled && (!lengthRules.max || props.value.length < lengthRules.max) && <span>
              <Input
                ref={this.saveInputRef}
                type="text"
                value={this.state.tagsValue}
                style={{ fontSize: 14, width: 150, border: 'none', marginTop: 3 }}
                onChange={this.handleChangeTags}
                onPressEnter={this.handleConfirmTags}
                placeholder="选择标签或输入标签"
              />
            </span>}
        </label>
        <span className={styles.errMsg}>{this.state.errMsg}</span>
      </div>
    );
  }
}
