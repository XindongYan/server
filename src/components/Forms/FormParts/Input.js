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
  componentWillUnmount() {

  }
  render() {
    const { name, props, rules } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.taskBox}>
        <FormItem>
          {getFieldDecorator(name, {
            rules,
          })(
            <Input
              placeholder={props.placeholder}
            />
          )}
        </FormItem>
        <span style={{ color: formData.title && formData.title.length > props.maxLength ? '#f00' : '#444' }}>{ formData.title ? formData.title.length : 0}/{props.maxLength}</span>
      </div>
    );
  }
}
