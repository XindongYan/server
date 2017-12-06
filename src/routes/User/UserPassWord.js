import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import path from 'path';
import querystring from 'querystring';
import { Form, Input, Tabs, Button, Icon, Checkbox, Row, Col, Alert, message, Upload } from 'antd';
import styles from './UserPassWord.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;
@Form.create()
@connect(state => ({
  currentUser: state.user.currentUser,
}))
export default class PassWord extends Component {
  state = {
    count: 0,
    type: '',
  }
  componentDidMount() {
    const query = querystring.parse(this.props.location.search.substr(1));
    this.setState({
      type: query.type,
    })
    this.props.dispatch({
      type: 'user/fetchCurrent',
    });
  }
  onGetCaptcha = () => {
    this.props.form.validateFields(['phone'], (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: `login/getSmsCode`,
          payload: {
            phone: this.props.form.getFieldValue('phone')
          },
        });
        let count = 59;
        this.setState({ count });
        this.interval = setInterval(() => {
          count -= 1;
          this.setState({ count });
          if (count === 0) {
            clearInterval(this.interval);
          }
        }, 1000);
      }
    });
  }
  handleSubmit = () => {
    const { currentUser } = this.props;
    this.props.form.validateFields({ force: true },
      (err) => {
        if (!err) {
          this.props.dispatch({
            type: 'user/changePassword',
            payload: {
              _id: currentUser._id,
              old_pwd: this.props.form.getFieldValue('oldPsd'),
              pwd: this.props.form.getFieldValue('newPsd'),
            },
            callback: (result) => {
              if (result.error) {
                message.error(result.msg);
              } else {
                message.success(result.msg);
                this.props.form.resetFields();
                // this.props.dispatch(routerRedux.push('/setting/userInfo'));
              }
            },
          });
        }
      }
    );
  }
  handleSubmitPhone = () => {
    const { currentUser } = this.props;
    this.props.form.validateFields({ force: true },
      (err) => {
        if (!err) {
          this.props.dispatch({
            type: 'user/changePasswordBySms_code',
            payload: {
              phone: this.props.form.getFieldValue('phone'),
              sms_code: this.props.form.getFieldValue('sms_code'),
              pwd: this.props.form.getFieldValue('password'),
            },
            callback: (result) => {
              if (result.error) {
                message.error(result.msg);
              } else {
                message.success(result.msg);
                this.props.form.resetFields();
              }
            },
          });
        }
      }
    );
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && form.getFieldValue('newPsd') === value) {
      form.validateFields(['confirm'], { force: true });
      callback();
    } else {
      callback('两次输入密码不一致！');
    }
  }
  passConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (!value || (value && form.getFieldValue('password') === value)) {
      form.validateFields(['confirm'], { force: true });
      callback();
    } else {
      callback('两次输入密码不一致！');
    }
  }
  render() {
    const { type, count } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 6 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    return (
      <div className={styles.main}>
        <div className={styles.top}>
          修改密码
        </div>
        { type === 'pass' &&
          <Form>
            <FormItem
              {...formItemLayout}
              label="旧密码"
              style={{ padding: '0 20px' }}
            >
              {getFieldDecorator('oldPsd', {
                rules: [{
                  required: true, message: '请输入旧密码!',
                }],
              })(
                <Input type="password" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="新密码"
              style={{ padding: '0 20px' }}
            >
              {getFieldDecorator('newPsd', {
                rules: [{
                  required: true, message: '请输入新密码!',
                }],
              })(
                <Input type="password" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="重复密码"
              style={{ padding: '0 20px' }}
            >
              {getFieldDecorator('againPsd', {
                rules: [{
                  required: true, message: '请确认新密码!',
                }, {
                  validator: this.checkConfirm,
                }],
              })(
                <Input type="password" />
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Row gutter={8}>
                <Col span={16} style={{ textAlign: 'center' }}>
                  <Button type="primary" onClick={this.handleSubmit}>保存</Button>
                </Col>
                <Col span={8} style={{ textAlign: 'center' }}>
                  <Link to="/user/login">
                    <span>忘记旧密码</span>
                  </Link>
                </Col>
              </Row>
            </FormItem>
          </Form>
        }
        { type === 'phone' &&
          <Form>
            <FormItem>
              {getFieldDecorator('phone', {
                rules: [{
                  required: true, message: '请输入手机号！',
                }, {
                  pattern: /^1\d{10}$/, message: '手机号格式错误！',
                }],
              })(
                <Input
                  size="large"
                  prefix={<Icon type="mobile" className={styles.prefixIcon} />}
                  placeholder="手机号"
                />
              )}
            </FormItem>
            <FormItem>
              <Row gutter={8}>
                <Col span={16}>
                  {getFieldDecorator('sms_code', {
                    rules: [{
                      required: true, message: '请输入验证码！',
                    }],
                  })(
                    <Input
                      size="large"
                      prefix={<Icon type="mail" className={styles.prefixIcon} />}
                      placeholder="验证码"
                    />
                  )}
                </Col>
                <Col span={8}>
                  <Button
                    disabled={count}
                    className={styles.getCaptcha}
                    size="large"
                    onClick={this.onGetCaptcha}
                  >
                    {count ? `${count} s` : '获取验证码'}
                  </Button>
                </Col>
              </Row>
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码!' }],
              })(
                <Input
                  size="large"
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码"
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('conformPassword', {
                rules: [{ required: true, message: '请确认密码!' },{
                  validator: this.passConfirm,
                }],
              })(
                <Input
                  size="large"
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="重复密码"
                />
              )}
            </FormItem>
            <FormItem>
              <Row gutter={8}>
                <Col span={16} style={{ textAlign: 'center' }}>
                  <Button type="primary" onClick={this.handleSubmitPhone}>保存</Button>
                </Col>
                <Col span={8} style={{ textAlign: 'center' }}>
                  <Link to="/user/login">
                    <span>去登陆</span>
                  </Link>
                </Col>
              </Row>
            </FormItem>
          </Form>
        }
      </div>
    );
  }
}