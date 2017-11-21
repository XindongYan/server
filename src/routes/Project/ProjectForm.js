import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, DatePicker, Menu, InputNumber, Upload, Modal, Table, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { QINIU_DOMAIN } from '../../constants';
import path from 'path';
import querystring from 'querystring';

import styles from './Project.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(state => ({
  project: state.project,
  teamUser: state.user.teamUser,
  qiniucloud: state.qiniucloud,
  formData: state.project.formData
}))
@Form.create()
export default class ProjectForm extends PureComponent {
  state = {

  }
  componentDidMount() {
    if (this.props.operation === 'edit') {
      const query = querystring.parse(this.props.location.search.substr(1));
      this.props.dispatch({
        type: 'project/fetchProject',
        payload: query,
      });
    }
    this.props.dispatch({
      type: 'qiniucloud/fetchUptoken'
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.formData._id && this.props.formData._id !== nextProps.formData._id) {
      this.props.form.setFieldsValue({
        title: nextProps.formData.title,
        merchant_tag: nextProps.formData.merchant_tag,
        task_type: nextProps.formData.task_type,
        desc: nextProps.formData.desc,
        deadline: moment(nextProps.formData.deadline),
        price: nextProps.formData.price,
        project_type: nextProps.formData.project_type,
        attachments: nextProps.formData.attachments,
      });
    }
  }
  handleSubmit = () => {
    const { teamUser, formData } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        const payload = {
          team_id: teamUser.team_id,
          user_id: teamUser.user_id,
          ...values,
          attachments: values.attachments ? values.attachments.filter(item => !item.error).map(item => {
            if (!item.error) {
              return {
                name: item.name,
                url: item.url || `${QINIU_DOMAIN}/${item.response.key}`,
                uid: item.uid,
              };
            }
          }) : [],
        };
        if (this.props.operation === 'edit') {
          this.props.dispatch({
            type: 'project/update',
            payload: {
              ...payload,
              _id: formData._id,
            },
          });
        } else if (this.props.operation === 'create') {
          this.props.dispatch({
            type: 'project/add',
            payload,
          });
        }
        console.log(payload);
        
        this.props.dispatch(routerRedux.push('/list/project-list'));
      }
    });
    
  }
  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }
  makeUploadData = (file) => {
    const { qiniucloud } = this.props;
    const extname = path.extname(file.name);
    return {
      token: qiniucloud.uptoken,
      key: `${file.uid}${extname}`,
    }
  }
  render() {
    const { form: { getFieldDecorator }, qiniucloud, operation} = this.props;
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
              rules: [{ required: true, message: '请输入项目标题！' }],
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
              rules: [{ required: true, message: '请输入项目标题！' }],
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
              rules: [{ required: true, message: '请选择任务类型！' }],
            })(
              <Select
                placeholder="请选择任务类型"
                onChange={this.handleSelectChange}
              >
                <Option value="male">male</Option>
                <Option value="female">female</Option>
              </Select>
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
            label="截止日期"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('deadline', {
              rules: [{ required: true, message: '请选择截止日期！' }],
            })(
              <DatePicker format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} showTime />
            )}
          </FormItem>
          <FormItem
            label="项目附件"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('attachments', {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(
              <Upload name="file" action="http://up.qiniu.com" listType="text" data={this.makeUploadData}>
                <Button>
                  <Icon type="upload" /> 点击上传
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem
            label="项目奖励"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('price', {
              initialValue: 0,
              rules: [{
                required: true, message: '请输入项目奖励'
              }],
            })(
              <Input type="number"/>
            )}
          </FormItem>
          <FormItem
            label="项目类型"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('project_type', {
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
            label="审核流程"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('flow', {
              rules: [{ required: true, message: 'Please input your note!' }],
            })(
              <Select style={{ width: '100%' }}>
                <Option value="male">male</Option>
                <Option value="female">female</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            wrapperCol={{ span: 8, offset: 4 }}
          >
            <Button type="primary" htmlType="submit">
              {operation === 'create' ? '创建' : '修改'}
            </Button>
          </FormItem>
        </Form>
      </Card>
    );
  }
}
