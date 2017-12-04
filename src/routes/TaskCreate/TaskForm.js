import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Select, Icon, Button, Upload, message } from 'antd';
import path from 'path';
import querystring from 'querystring';
import { QINIU_DOMAIN, QINIU_UPLOAD_DOMAIN, TASK_APPROVE_STATUS, CHANNEL_NAMES } from '../../constants';

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
        name: formData.name,
        channel_name: formData.channel_name,
        desc: formData.desc,
        attachments: formData.attachments,
      });
    }
    this.props.dispatch({
      type: 'qiniucloud/fetchUptoken'
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.formData._id && this.props.formData._id !== nextProps.formData._id) {
      this.props.form.setFieldsValue({
        name: nextProps.formData.name,
        channel_name: nextProps.formData.channel_name,
        desc: nextProps.formData.desc,
        attachments: nextProps.formData.attachments,
      });
    }
  }
  handleSubmit = () => {
    const { teamUser, formData } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const payload = {
          ...values,
          attachments: values.attachments ? values.attachments.filter(item => !item.error).map(item => {
            return {
              name: item.name,
              url: item.url || `${QINIU_DOMAIN}/${item.response.key}`,
              uid: item.uid,
            };
          }) : [],
          team_id: teamUser.team_id,
          project_id: query.project_id,
          creator_id: teamUser.user_id,
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
              }
            },
          });
        } else if (this.props.operation === 'create') {
          this.props.dispatch({
            type: 'task/add',
            payload: {
              ...payload,
              approve_status: TASK_APPROVE_STATUS.created,
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
    };
  }
  render() {
    const { form: { getFieldDecorator }, operation } = this.props;
    console.log(this.props)
    return (
      <Card bordered={false} title={`${operation === 'create' ? '创建' : '修改'}任务`}>
        <Form>
          <FormItem
            label="任务标题"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入项目标题！' }],
            })(
              <Input />
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
