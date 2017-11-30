import React, { PureComponent } from 'react';
import { connect } from 'dva';
import querystring from 'querystring';
import path from 'path';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { Card, Form, Input, Select, Icon, Button, DatePicker, Menu, InputNumber, Upload, Modal, Table, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { QINIU_DOMAIN, QINIU_UPLOAD_DOMAIN, APPROVE_FLOWS, TASK_TYPES, PROJECT_LEVELS, APPROVE_ROLES } from '../../constants';

import styles from './Project.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(state => ({
  teamUser: state.user.teamUser,
  qiniucloud: state.qiniucloud,
  formData: state.project.formData,
  teamUsers: state.team.teamUsers,
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
    this.props.dispatch({
      type: 'team/fetchTeamUsers',
      payload: { team_id: this.props.teamUser.team_id },
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.formData._id && this.props.formData._id !== nextProps.formData._id) {
      const approvers = {};
      const flow = APPROVE_FLOWS.find(item => item.value === nextProps.formData.approve_flow);
      
      (flow ? flow.texts : []).forEach((item, index) => {
        approvers[`approvers${item}`] = nextProps.formData.approvers[index];
      })
      this.props.form.setFieldsValue({
        title: nextProps.formData.title,
        merchant_tag: nextProps.formData.merchant_tag,
        task_type: nextProps.formData.task_type,
        desc: nextProps.formData.desc,
        deadline: nextProps.formData.deadline ? moment(nextProps.formData.deadline) : null,
        price: nextProps.formData.price,
        attachments: nextProps.formData.attachments,
        approve_flow: nextProps.formData.approve_flow,
        max_take: nextProps.formData.max_take,
        max_task: nextProps.formData.max_task,
        project_level: nextProps.formData.project_level,
      });
      setTimeout(() => {
        this.props.form.setFieldsValue(approvers);
      }, 200);
    }
  }
  handleSubmit = () => {
    const { form: { getFieldDecorator, getFieldValue }, teamUser, formData } = this.props;
    const flow = APPROVE_FLOWS.find(item => item.value === getFieldValue('approve_flow'));
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const approvers = (flow ? flow.texts : [] ).map(item => values[`approvers${item}`])
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
          approvers,
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
        this.props.dispatch(routerRedux.push('/list/project-list'));
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
    const { form: { getFieldDecorator, getFieldValue }, qiniucloud, operation, teamUsers, formData } = this.props;
    const flow = APPROVE_FLOWS.find(item => item.value === (formData.approve_flow || getFieldValue('approve_flow')));
    return (
      <Card bordered={false} title={`${operation === 'create' ? '创建' : '修改'}活动`}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            label="标题"
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
            label="类型"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('task_type', {
              initialValue: 1,
              rules: [{ required: true, message: '请选择任务类型！' }],
            })(
              <Select
                placeholder="请选择任务类型"
                onChange={this.handleSelectChange}
              >
                {TASK_TYPES.map(item => <Option value={item.value} key={item.value}>{item.text}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem
            label="项目描述"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('desc', {
            })(
              <Input.TextArea />
            )}
          </FormItem>
          <FormItem
            label="截止时间"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('deadline', {
            })(
              <DatePicker format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }}
              showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} />
            )}
          </FormItem>
          <FormItem
            label="附件"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('attachments', {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(
              <Upload name="file" action={QINIU_UPLOAD_DOMAIN} listType="text" data={this.makeUploadData}>
                <Button>
                  <Icon type="upload" /> 点击上传
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem
            label="参考奖励"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('price', {
              initialValue: 0,
              rules: [{
                required: true, message: '请输入项目奖励'
              }],
            })(
              <Input type="number" addonAfter="元"/>
            )}
          </FormItem>
          <FormItem
            label="级别"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('project_level', {
              initialValue: 1,
              rules: [{
                required: true, message: '请选择项目级别'
              }],
            })(
              <Select
                placeholder="择项目级别"
              >
                {PROJECT_LEVELS.map(item => <Option value={item.value} key={item.value}>{item.text}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem
            label="最多接单数"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('max_take', {
              initialValue: 0,
              rules: [{
                required: true, message: '请输入最多抢单数'
              }],
            })(
              <Input type="number" addonAfter="单"/>
            )}
          </FormItem>
          <FormItem
            label="最多投稿数"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('max_task', {
              initialValue: 0,
              rules: [{
                required: true, message: '请输入最多投稿数'
              }],
            })(
              <Input type="number" addonAfter="篇"/>
            )}
          </FormItem>
          <FormItem
            label="审核流程"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('approve_flow', {
              rules: [{ required: true, message: '请选择审核流程' }],
            })(
              <Select style={{ width: '100%' }}>
                {APPROVE_FLOWS.map(item =>
                  <Option value={item.value} key={item.value}>{item.texts.map(item => APPROVE_ROLES.find(item1 => item1.value === item).label).join(',')}</Option>)}
              </Select>
            )}
          </FormItem>
          {
            (flow ? flow.texts : [] ).map((item) => {
              const label = APPROVE_ROLES.find(item1 => item1.value === item).label;
              return (<FormItem
                label={label}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
                key={item}
              >
                {getFieldDecorator(`approvers${item}`, {
                  rules: [{ required: true, message: `请选择${label}人员` }],
                })(
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder={`选择${label}人员`}
                  >
                    {teamUsers.filter(teamUser => teamUser.approve_roles.indexOf(item) >= 0)
                      .map(teamUser => <Option key={teamUser.user_id._id} value={teamUser.user_id._id}>{teamUser.user_id.name}</Option>)}
                  </Select>
                )}
              </FormItem>)
            })
          }
          <FormItem
            wrapperCol={{ span: 8, offset: 4 }}
          >
            <Button type="primary" htmlType="submit">
              {operation === 'create' ? '创建' : '保存'}
            </Button>
          </FormItem>
        </Form>
      </Card>
    );
  }
}
