import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Icon, message, Form } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;
@connect(state => ({

}))

export default class Inputs extends PureComponent {
  state = {
    data: {
      component: 'Input',
      name: 'name',
      label: '标题',
      props: {
        className: '',
        maxLength: 19,
        tips: '',
        placeholder: '',
        value: '',
      },
      rules: [{
        required: true, message: '标题不能为空',
      }, {
        max: 18, message: '文字长度太长, 要求长度最大为18',
      }, {
        whitespace: true, message: '标题不能为空格'
      }]
    }
  }
  componentDidMount() {

  }
  componentWillUnmount() {

  }
  render() {
    // const { data } = this.props;
    const { data } = this.state;

    let getFieldDecorator = null;
    if (this.props.form) {
      getFieldDecorator = this.props.form.getFieldDecorator;
    }
    return (
      <div>
        <FormItem>
          {getFieldDecorator('title', {
          })(
            <Input
              className={data.props.className}
              suffix={<span>{data.props.value.length}/{data.props.maxLength}</span>}
              placeholder={data.props.placeholder}
            />
          )}
        </FormItem>
      </div>
    );
  }
}
