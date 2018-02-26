import React, { PureComponent } from 'react';
import { Input, Form } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;

export default class NInput extends PureComponent {
  state = {
  }
  componentDidMount() {
    const { name, props, rules } = this.props;
    this.props.form.setFieldsValue({ [name]: props.value });
  }
  render() {
    const { name, props, rules } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const value = getFieldValue(name);
    return (
      <div className={styles.taskListInp}>
        <FormItem>
          {getFieldDecorator(name, {
            initialValue: props.value,
            rules,
          })(
            <Input
              placeholder={props.placeholder}
            />
          )}
        </FormItem>
        <span style={{ color: value && value.length > props.maxLength ? '#f00' : '#444' }}>{ value ? value.length : 0}/{props.maxLength}</span>
      </div>
    );
  }
}
