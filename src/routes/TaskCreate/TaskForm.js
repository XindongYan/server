import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Card, Form, Input, Select, Icon, Button, DatePicker, Menu, InputNumber, Upload, Modal, Table, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { QINIU_DOMAIN, QINIU_UPLOAD_DOMAIN, APPROVE_FLOWS, TASK_TYPES, TASK_APPROVE_STATUS } from '../../constants';
import path from 'path';
import querystring from 'querystring';

const FormItem = Form.Item;
const { Option } = Select;

@connect(state => ({
  teamUser: state.user.teamUser,
  qiniucloud: state.qiniucloud,
  formData: state.task.formData,
}))
@Form.create()
export default class TaskForm extends PureComponent {
  state = {

  }
  componentDidMount() {
    const { operation, formData } = this.props;
    if (operation === 'edit') {
      const query = querystring.parse(this.props.location.search.substr(1));
      this.props.dispatch({
        type: 'task/fetchTask',
        payload: { _id: query._id },
      });
      this.props.form.setFieldsValue({
        title: formData.title,
        merchant_tag: formData.merchant_tag,
        task_type: formData.task_type,
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
      });
    }
  }
  handleSubmit = () => {
    const { form: { getFieldDecorator, getFieldValue }, teamUser, formData } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const payload = {
          ...values,
          team_id: teamUser.team_id,
          project_id: query.project_id,
          creator_id: teamUser.user_id,
          approve_status: TASK_APPROVE_STATUS.created,
        };
        if (this.props.operation === 'edit') {
          this.props.dispatch({
            type: 'task/update',
            payload: {
              ...payload,
              _id: formData._id,
            },
            callback: (result) => {
              if (result.error) {
                message.error(result.msg);
              } else {
                message.success(result.msg);
                this.props.dispatch(routerRedux.push(`/project/task/list?project_id=${query.project_id}`));
              }
            }, 
          });
        } else if (this.props.operation === 'create') {
          this.props.dispatch({
            type: 'task/add',
            payload,
            callback: (result) => {
              if (result.error) {
                message.error(result.msg);
              } else {
                message.success(result.msg);
                this.props.dispatch(routerRedux.push(`/project/task/list?project_id=${query.project_id}`));
              }
            }, 
          });
        }
        
      }
    });
  }
  normFile = (e) => {
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
    const { form: { getFieldDecorator, getFieldValue }, qiniucloud, operation, formData } = this.props;
    
    return (
      <Card bordered={false}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            label="任务标题"
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
              initialValue: 1,
              rules: [{ required: true, message: '请选择任务类型！' }],
            })(
              <Select
                placeholder="请选择任务类型"
              >
                {TASK_TYPES.map(item => <Option value={item.value} key={item.value}>{item.text}</Option>)}
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
