import React, { PureComponent } from 'react';
import { Input, Form } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;

export default class NInput extends PureComponent {
  state = {
  }
  handleChange = (e) => {
    if (this.props.onChange) this.props.onChange(e.target.value)
  }
  render() {
    const { name, props, rules } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const value = getFieldValue(name);
    const newRules = [...rules];
    if (newRules.length > 0 && !newRules.find(item => item.required))
      newRules.push({
        "type": "string",
        "message": "不能为空",
        "required": true
      });
    const type = props.rows && props.rows > 0 ? 'textArea' : 'Input';
    return (
      <div className={styles.taskListInp}>
        { type === 'Input' ?
          <FormItem>
            {getFieldDecorator(name, {
              initialValue: props.value,
              rules: newRules,
            })(
              <Input
                onChange={this.handleChange}
                placeholder={props.placeholder}
              />
            )}
          </FormItem>
          : <FormItem>
            {getFieldDecorator(name, {
              initialValue: props.value,
              rules: newRules,
            })(
              <TextArea
                onChange={this.handleChange}
                autosize={{ minRows: props.rows, maxRows: props.rows }}
                placeholder={props.placeholder}
              />
            )}
          </FormItem>
        }
        <span className={type === 'Input' ? styles.InputCount : styles.textAreaCount} style={{ color: value && value.length > props.maxLength ? '#f00' : '#444' }}>{ value ? value.length : 0}/{props.maxLength}</span>
      </div>
    );
  }
}
