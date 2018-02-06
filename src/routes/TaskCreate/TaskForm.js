import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Select, Icon, Button, Upload, message, Tooltip } from 'antd';
import path from 'path';
import querystring from 'querystring';
import { Link, routerRedux } from 'dva/router';
import { QINIU_DOMAIN, QINIU_UPLOAD_DOMAIN, TASK_APPROVE_STATUS, SOURCE, CHANNEL_NAMES } from '../../constants';

const FormItem = Form.Item;
const { Option } = Select;

@connect(state => ({
  teamUser: state.user.teamUser,
  qiniucloud: state.qiniucloud,
  formData: state.task.formData,
  projectFormData: state.project.formData,
}))
@Form.create()
export default class TaskForm extends PureComponent {
  state = {

  }
  componentDidMount() {
    const { operation, formData } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    if (operation === 'edit') {
      this.props.dispatch({
        type: 'task/fetchTask',
        payload: { _id: query._id },
      });
      this.props.form.setFieldsValue({
        name: formData.name,
        desc: formData.desc,
        attachments: formData.attachments,
        price: formData.price,
        channel_name: formData.channel_name,
        merchant_tag: formData.merchant_tag,
      });
    } else if (operation === 'create') {
      this.props.dispatch({
        type: 'project/fetchProject',
        payload: { _id: query.project_id },
        callback: (result) => {
          if (!result.error) {
            const f = {
              channel_name: result.project.channel_name,
              merchant_tag: result.project.merchant_tag,
            };
            this.props.form.setFieldsValue(f);
          }
        },
      });
    }
    this.props.dispatch({
      type: 'qiniucloud/fetchUptoken'
    });
  }
  componentWillReceiveProps(nextProps) {
    const { operation } = nextProps;
    if (operation === 'edit' && nextProps.formData._id && this.props.formData._id !== nextProps.formData._id) {
      const f = {
        name: nextProps.formData.name,
        desc: nextProps.formData.desc,
        attachments: nextProps.formData.attachments,
        price: nextProps.formData.price,
        channel_name: nextProps.formData.channel_name,
        merchant_tag: nextProps.formData.merchant_tag,
      };
      this.props.form.setFieldsValue(f);
    }
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'task/clearFormData'
    });
  }
  handleSubmit = (type) => {
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
              source: SOURCE.task,
              approve_status: TASK_APPROVE_STATUS.created,
            },
            callback: (result) => {
              if (result.error) {
                message.error(result.msg);
              } else {
                message.success(result.msg);
                if (type === 'next') {
                  this.props.form.resetFields();
                  const f = {
                    channel_name: this.props.projectFormData.channel_name,
                    merchant_tag: this.props.projectFormData.merchant_tag,
                  };
                  this.props.form.setFieldsValue(f);
                } else {
                  this.props.dispatch(routerRedux.push(`/project/task/list?project_id=${query.project_id}`));
                }
              }
            },
          });
        }
        window.scrollTo(0, 0);
      }
    });
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
    const { form: { getFieldDecorator }, operation } = this.props;
    return (
      <Card bordered={false} title={`${operation === 'create' ? '创建' : '修改'}任务`}>
        <Form>
          <FormItem
            label="任务名称"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入任务名称！' }, {
                whitespace: true, message: '任务名称不能为空格！',
              }],
            })(
              <Input placeholder="最多20字" maxLength="20" />
            )}
          </FormItem>
          <FormItem
            label="描述"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('desc', {
            })(
              <Input.TextArea rows={6} />
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
            label="奖励"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('price', {
              initialValue: 0,
              rules: [{
                pattern: /^(\d{1,5}|0)(\.\d{1,2})?$/, message: '请输入整数位5以内，小数位2以内的数字'
              }]
            })(
              <Input type="number" addonAfter="元" />
            )}
          </FormItem>
          <FormItem
            wrapperCol={{ span: 8, offset: 4 }}
          >
            { operation === 'edit' &&
              <Button type="primary" onClick={() => this.handleSubmit('save')}>
                保存
              </Button>
            }
            { operation === 'create' &&
              <div>
                <Button type="primary" onClick={() => this.handleSubmit('next')}>
                  创建下一个
                </Button>
                <Button style={{ marginLeft: 80 }} type="primary" onClick={() => this.handleSubmit('finish')}>
                  创建完成
                </Button>
              </div>
            }
          </FormItem>
        </Form>
      </Card>
    );
  }
}
