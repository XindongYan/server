import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, DatePicker, Menu, InputNumber, Popconfirm, Modal, Table, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Project.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(state => ({
  project: state.project,
  teamUser: state.user.teamUser,
}))
@Form.create()
export default class FlowList extends PureComponent {
  state = {
    formValues: {},
  }
  handleSubmit = () => {
    const { teamUser } = this.props;
    const values = this.props.form.getFieldsValue();
    console.log(values);
    this.props.dispatch({
      type: 'project/add',
      payload: {
        team_id: teamUser.team_id,
        user_id: teamUser.user_id,
        ...values,
      },
    });
    this.props.dispatch(routerRedux.push('/list/project-list'));
  }
  render() {
    const { form: { getFieldDecorator }} = this.props;
    const { formValues } = this.state;

    
    return (
      <Card bordered={false}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            label="项目标题"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('title', {
              rules: [{ required: true, message: 'Please input your note!' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            label="商家标签"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('merchant_tag', {
              rules: [{ required: true, message: 'Please input your note!' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            label="项目描述"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('desc', {
              rules: [{ required: true, message: 'Please input your note!' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            label="任务类型"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('task_type', {
              rules: [{ required: true, message: 'Please select your gender!' }],
            })(
              <Select
                placeholder="Select a option and change input text above"
                onChange={this.handleSelectChange}
              >
                <Option value="male">male</Option>
                <Option value="female">female</Option>
              </Select>
            )}
          </FormItem>
           <FormItem
            label="截止日期"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('deadline', {
              rules: [{ required: true, message: 'Please input your note!' }],
            })(
              <DatePicker style={{ width: '100%' }} />
            )}
          </FormItem>
          <FormItem
            wrapperCol={{ span: 8, offset: 4 }}
          >
            <Button type="primary" htmlType="submit">
              创建
            </Button>
          </FormItem>
        </Form>
      </Card>
    );
  }
}
