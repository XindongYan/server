import React, { PureComponent } from 'react';
import { Rate, Form } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;

export default class Rating extends PureComponent {
  state = {
  }
  handleChange = (value) => {
    if (this.props.onChange) this.props.onChange(value)
  }
  render() {
    const { name, props, rules } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.taskListInp}>
        <FormItem label={props.label} colon={false}>
          {getFieldDecorator(name, {
            initialValue: props.value,
            rules
          })(
            <Rate count={props.count} onChange={this.handleChange} />
          )}
        </FormItem>
        <div style={{ marginTop: -30 }} dangerouslySetInnerHTML={{__html: props.tips}}></div>
      </div>
    );
  }
}
