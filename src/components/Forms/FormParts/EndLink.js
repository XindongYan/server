import React, { PureComponent } from 'react';
import { connect } from 'dva';
import $ from 'jquery';
import { Input, Icon, message } from 'antd';
import { ORIGIN } from '../../../constants';
import styles from './index.less';

@connect(state => ({

}))

export default class EndLink extends PureComponent {
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
          文末链接
        </p>
        <div>
          
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
