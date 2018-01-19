import React, { PureComponent } from 'react';
import { connect } from 'dva';
import querystring from 'querystring';
import path from 'path';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { Card, Form, Input, Select, Icon, Button, DatePicker, Upload, message, Tooltip } from 'antd';
import { QINIU_DOMAIN, QINIU_UPLOAD_DOMAIN, APPROVE_FLOWS, TASK_TYPES, PROJECT_LEVELS, APPROVE_ROLES, CHANNEL_NAMES } from '../../constants';

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
    const { teamUser } = this.props;
    if (this.props.operation === 'edit') {
      const query = querystring.parse(this.props.location.search.substr(1));
      this.props.dispatch({
        type: 'project/fetchProject',
        payload: { _id: query._id },
      });
    }
    this.props.dispatch({
      type: 'qiniucloud/fetchUptoken'
    });
    if (teamUser.team_id) {
      this.props.dispatch({
        type: 'team/fetchTeamUsers',
        payload: { team_id: teamUser.team_id },
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.formData._id && this.props.formData._id !== nextProps.formData._id) {
      const approvers = {};
      const flow = APPROVE_FLOWS.find(item => item.value === nextProps.formData.approve_flow);
      (flow ? flow.texts : []).forEach((item, index) => {
        approvers[`approvers${item}`] = nextProps.formData.approvers[index];
      });
      const fieldsValue = {
        type: nextProps.formData.type,
        name: nextProps.formData.name,
        channel_name: nextProps.formData.channel_name,
        merchant_tag: nextProps.formData.merchant_tag,
        task_type: nextProps.formData.task_type,
        desc: nextProps.formData.desc,
        deadline: nextProps.formData.deadline ? moment(nextProps.formData.deadline) : null,
        price: nextProps.formData.price,
        attachments: nextProps.formData.attachments,
        approve_flow: nextProps.formData.approve_flow,
        project_level: nextProps.formData.project_level,
      };
      this.props.form.setFieldsValue(fieldsValue);
      setTimeout(() => {
        if (nextProps.formData.type === 1) {
          approvers.max_take = nextProps.formData.max_take;
        }
        this.props.form.setFieldsValue(approvers);
      }, 200);
    }
    if (nextProps.teamUsers.length === 0 && nextProps.teamUser.team_id) {
      this.props.dispatch({
        type: 'team/fetchTeamUsers',
        payload: { team_id: nextProps.teamUser.team_id },
      });
    }
  }
  handleSubmit = () => {
    const { form: { getFieldValue }, teamUser, formData } = this.props;
    const flow = APPROVE_FLOWS.find(item => item.value === getFieldValue('approve_flow'));
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const approvers = (flow ? flow.texts : []).map(item => values[`approvers${item}`]);
        const payload = {
          team_id: teamUser.team_id,
          user_id: teamUser.user_id,
          ...values,
          attachments: values.attachments ? values.attachments.filter(item => !item.error).map(item => {
            return {
              name: item.name,
              url: item.url || `${QINIU_DOMAIN}/${item.response.key}`,
              uid: item.uid,
            };
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
            callback: (result) => {
              if (result.error) {
                message.error(result.msg);
              } else {
                message.success(result.msg);
                this.handleJump(values);
              }
            },
          });
        } else if (this.props.operation === 'create') {
          this.props.dispatch({
            type: 'project/add',
            payload: {
              ...payload,
            },
            callback: (result) => {
              if (result.error) {
                message.error(result.msg);
              } else {
                message.success(result.msg);
                this.handleJump(values);
              }
            },
          });
        }
        
      }
    });
  }
  handleJump = (project) => {
    this.props.dispatch(routerRedux.push(`/project/list?type=${project.type}`));
  }
  beforeUpload = (file) => {
    const promise = new Promise(function(resolve, reject) {
      const isLt100M = file.size / 1024 / 1024 <= 100;
      if (!isLt100M) {
        message.error('上传文件最大100M');
        reject(isLt100M);
      }
      resolve(isLt100M);
    });
    return promise;
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
    };
  }
  render() {
    const { form: { getFieldDecorator, getFieldValue }, operation, teamUsers, formData } = this.props;
    const type = getFieldValue('type') || formData.type;
    const flow = APPROVE_FLOWS.find(item => item.value === (getFieldValue('approve_flow') || formData.approve_flow));
    return (
      <Card bordered={false} title={`${operation === 'create' ? '创建' : '修改'}活动`}>
        <Form>
          <FormItem
            label="活动类型"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('type', {
              rules: [{ required: true, message: '请选择活动类型！' }],
            })(
              <Select
                placeholder="请选活动类型"
              >
                <Option value={1} key={1}>接单活动</Option>
                <Option value={2} key={2}>投稿活动</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            label="标题"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入项目标题！' }, {
                whitespace: true, message: '项目标题不能为空格！',
              }],
            })(
              <Input placeholder="最多20字" maxLength="20" />
            )}
          </FormItem>
          <FormItem
            label="渠道"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('channel_name', {
              rules: [{ required: true, message: '请选择渠道！' }],
            })(
              <Select
                placeholder="选择渠道"
              >
                {CHANNEL_NAMES.map(item => <Option value={item} key={item}>{item}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem
            label="商家标签"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('merchant_tag', {
              rules: [{ required: true, message: '请输入项目标题！' }, {
                whitespace: true, message: '商家标签不能为空格！',
              }],
            })(
              <Input maxLength="30" placeholder="最多输入30个字" />
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
            label="描述"
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
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: '100%' }}
                showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                disabledDate={(current) => {
                  const date = new Date();
                  date.setHours(0, 0, 0, 0);
                  return current && current.valueOf() <= Date.parse(date);
                }}
              />
            )}
          </FormItem>
          <FormItem
            label={
              <Tooltip placement="topLeft" title="建议上传pdf格式文件">
                附件 <Icon type="question-circle-o" />
              </Tooltip>
            }
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('attachments', {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(
              <Upload name="file" action={QINIU_UPLOAD_DOMAIN} listType="text" data={this.makeUploadData} beforeUpload={this.beforeUpload}>
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
              }, {
                pattern: /^(\d{1,5}|0)(\.\d{1,2})?$/, message: '请输入整数位5以内，小数位2以内的数字'
              }],
            })(
              <Input type="number" addonAfter="元" />
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
          {type === 1 && <FormItem
            label="最多接单数"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('max_take', {
              initialValue: 1,
              rules: [{
                required: true, message: '请输入最多接单数'
              }],
            })(
              <Input type="number" addonAfter="单" />
            )}
          </FormItem>}
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
                  <Option value={item.value} key={item.value}>{item.texts.map(item1 => APPROVE_ROLES.find(item2 => item2.value === item1).label).join(',')}</Option>)}
              </Select>
            )}
          </FormItem>
          {
            (flow ? flow.texts : []).map((item) => {
              const label = APPROVE_ROLES.find(item1 => item1.value === item).label;
              return (
                <FormItem
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
                      {teamUsers.filter(teamUser => teamUser.user_id && teamUser.approve_roles.indexOf(item) >= 0)
                        .map(teamUser => <Option key={teamUser.user_id._id} value={teamUser.user_id._id}>{teamUser.user_id.nickname}</Option>)}
                    </Select>
                  )}
                </FormItem>
              );
            })
          }
          <FormItem
            wrapperCol={{ span: 8, offset: 4 }}
          >
            <Button type="primary" onClick={this.handleSubmit}>
              {operation === 'create' ? '创建' : '保存'}
            </Button>
          </FormItem>
        </Form>
      </Card>
    );
  }
}
