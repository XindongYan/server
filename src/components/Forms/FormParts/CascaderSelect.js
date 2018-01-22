import React, { PureComponent } from 'react';
import { connect } from 'dva';
import $ from 'jquery';
import { Input, Icon, message, Cascader, Form } from 'antd';
import { ORIGIN } from '../../../constants';
import styles from './index.less';

const FormItem = Form.Item;

@connect(state => ({

}))

export default class CascaderSelect extends PureComponent {
  state = {
    residences: [],
    rules: [],
  }
  componentDidMount() {
    $.get(`${ORIGIN}/jsons/we.taobao.json`,(result) => {
      this.setState({
        residences: result,
      })
    })
    const { formData } = this.props;
    if (formData && formData.crowd) {
      const fieldsValue = {
        crowd: formData.crowd,
      };
      this.props.form.setFieldsValue(fieldsValue);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.formData.title && nextProps.formData.title) {
      const { formData } = nextProps;
      const fieldsValue = {
        crowd: formData.crowd,
      };
      this.props.form.setFieldsValue(fieldsValue);
      if (nextProps.rules) {
        this.setState({
          
        })
      }
    }
  }
  componentWillUnmount() {

  }
  handleTaskChange = (e) => {
    if (this.props.onChange) this.props.onChange(e, 'crowd')
  }
  render() {
    const { formData, form: { getFieldDecorator } } = this.props;
    return (
      <div style={{ padding: '10px 20px 0'}}>
        <p className={styles.lineTitleDefult}>
          本文目标人群
        </p>
        <div>
          <FormItem>
            {getFieldDecorator('crowd', {
              rules: [{
                required: this.props.rules, message: '请选择目标人群',
              }]
            })(
              <Cascader
                placeholder={'请选择'}
                style={{ width: '200px' }}
                onChange={this.handleTaskChange}
                options={this.state.residences}
                disabled={this.props.disabled}
              />
            )}
          </FormItem>
          
        </div>
        { this.props.operation !== 'view' &&
          <p className={styles.promptText}>围绕匹配的人群进行创作，可得到更多曝光~, 点击
            <a target="_blank" href="https://we.taobao.com/creative/group">#查看人群说明与热点#</a>
          </p>
        }
      </div>
    );
  }
}
