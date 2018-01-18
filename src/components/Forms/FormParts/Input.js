import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Icon, message, Form } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;
@connect(state => ({

}))

export default class WeitaoForm extends PureComponent {
  state = {
  }
  componentDidMount() {

  }
  componentWillUnmount() {

  }
  render() {
    const { style, operation, formData } = this.props;
    let getFieldDecorator = null;
    if (this.props.form) {
      getFieldDecorator = this.props.form.getFieldDecorator;
    }
    return (
      <div className={styles.taskBox}>
        <FormItem>
          {getFieldDecorator('title', {
            rules: [{
              required: true, message: '标题不能为空',
            }, {
              max: 18, message: '文字长度太长, 要求长度最大为18',
            }, {
              whitespace: true, message: '标题不能为空格'
            }],
          })(
            <Input
              placeholder="请在这里输入标题"
            />
          )}
        </FormItem>
      </div>
    );
  }
}
