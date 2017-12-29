import React, { PureComponent } from 'react';
import { connect } from 'dva';
import $ from 'jquery';
import { Input, Icon, message, Cascader, Form } from 'antd';
// import { ORIGIN  } from '../../constants';
import styles from './MerchantTag.less';

const ORIGIN = 'http://localhost:3000';
const FormItem = Form.Item;
@Form.create()

@connect(state => ({

}))

export default class CascaderSelect extends PureComponent {
  state = {
    residences: [],
  }
  componentDidMount() {
    this.props.form.setFieldsValue({
      target_population: this.props.formData.target_population,
    });
    $.get(`${ORIGIN}/jsons/we.taobao.json`,(result) => {
      this.setState({
        residences: result,
      })
    })
  }
  componentWillUnmount() {

  }
  handleTaskChange = (e) => {
    if (this.props.onChange) this.props.onChange(e, 'target_population')
  }
  render() {
    const { form: { getFieldDecorator, getFieldValue }, formData } = this.props;
    return (
      <div>
        <p className={styles.lineTitleDefult}>
          本文目标人群
        </p>
        <div>
          <FormItem style={{ marginBottom: 10 }}>
            {getFieldDecorator('target_population')(
              <Cascader
                placeholder="请选择"
                style={{ width: '200px' }}
                onChange={this.handleTaskChange}
                options={this.state.residences}
              />
            )}
          </FormItem>
        </div>
        <p className={styles.promptText}>围绕匹配的人群进行创作，可得到更多曝光~, 点击
          <a target="_blank" href="https://we.taobao.com/creative/group">#查看人群说明与热点#</a>
        </p>
      </div>
    );
  }
}
