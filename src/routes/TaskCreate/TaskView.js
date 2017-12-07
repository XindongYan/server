import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Select, Icon, Button, Upload, message } from 'antd';
import path from 'path';
import querystring from 'querystring';
import { QINIU_DOMAIN, QINIU_UPLOAD_DOMAIN, TASK_APPROVE_STATUS } from '../../constants';

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
    
  }
  componentWillReceiveProps(nextProps) {
    
  }
  render() {
    const { form: { getFieldDecorator }, operation } = this.props;
    return (
      <Card bordered={false} title="任务详情">
        <div>
        </div>
      </Card>
    );
  }
}
