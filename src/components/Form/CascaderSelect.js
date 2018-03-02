import React, { PureComponent } from 'react';
import fetch from 'dva/fetch';
import { Input, Icon, message, Cascader, Form } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;

export default class CascaderSelect extends PureComponent {
  state = {
    residences: [],
  }
  componentDidMount() {
    fetch(`/jsons/we.taobao.json`, {
    }).then(response => response.json()).then(result => {
      this.setState({
        residences: result,
      })
    });
  }
  handleChange = (value) => {
    if (this.props.onChange) this.props.onChange(value.length === 2 ? value[1] : '')
  }
  render() {
    const { name, props, rules } = this.props;
    const { getFieldDecorator } = this.props.form;
    let firstValue = '';
    for (let i = 0; i < this.state.residences.length; i ++) {
      const item = this.state.residences[i].children.find(item1 => item1.value === props.value);
      if (item) {
        firstValue = this.state.residences[i].value;
        break;
      }
    }
    return (
      <div style={{ padding: '10px 20px 0' }}>
        <p className={styles.lineTitleDefult}>
          本文目标人群
        </p>
        <div>
          <FormItem>
            {getFieldDecorator(name, {
              initialValue: props.value ? [firstValue, props.value] : '',
            })(
              <Cascader
                style={{ width: '200px' }}
                onChange={this.handleChange}
                options={this.state.residences}
                disabled={this.props.disabled}
                placeholder="请选择"
              />
            )}
          </FormItem>
        </div>
        <p className={styles.promptText} dangerouslySetInnerHTML={{__html: props.tips}}>
        </p>
      </div>
    );
  }
}
