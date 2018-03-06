import React, { PureComponent } from 'react';
import { Input, Icon, message, Cascader, Form } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;

export default class CascaderSelect extends PureComponent {
  state = {
  }
  componentDidMount() {
  }
  handleChange = (value) => {
    if (this.props.onChange) this.props.onChange(value.length === 2 ? value[1] : '')
  }
  render() {
    const { name, props, rules } = this.props;
    const { getFieldDecorator } = this.props.form;
    let firstValue = '';
    for (let i = 0; i < props.dataSource.length; i ++) {
      const item = props.dataSource[i].children.find(item1 => item1.value === props.value);
      if (item) {
        firstValue = props.dataSource[i].value;
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
              initialValue: props.value ? [firstValue, props.value] : [],
            })(
              <Cascader
                style={{ width: '200px' }}
                onChange={this.handleChange}
                options={props.dataSource}
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
