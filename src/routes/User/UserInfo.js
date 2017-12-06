import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, Tabs, Button, Icon, Checkbox, Row, Col, Alert, message } from 'antd';
import styles from './Login.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;

@connect(state => ({

}))
@Form.create()
export default class UserInfo extends Component {
  state = {
    
  }

  componentWillReceiveProps(nextProps) {
    
  }

  componentWillUnmount() {
    
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="用户名"
          >
            {getFieldDecorator('nickname', {
              rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="手机号"
          >
            {getFieldDecorator('phone', {
              rules: [{ required: false, message: '请输入手机号' }],
            })(
              <Input style={{ width: '100%' }} disabled />
            )}
          </FormItem>
          <hr />
        </Form>
      </div>
    );
  }
}
