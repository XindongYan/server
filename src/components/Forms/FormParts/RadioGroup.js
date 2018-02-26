import React, { PureComponent } from 'react';
import { Form, Radio, Tooltip, Icon } from 'antd';
import styles from './index.less';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;

export default class NRadioGroup extends PureComponent {
  state = {
    residences: [],
  }

  handleChange = (e) => {
    if (this.props.onChange) this.props.onChange(e.target.value)
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
      <div style={{ padding: '10px 20px 0'}}>
        <p className={styles.lineTitleDefult}>
          {props.label}
        </p>
        <div>
          <FormItem>
            {getFieldDecorator(name, {
              initialValue: props.value,
              rules,
            })(
              <RadioGroup onChange={this.handleChange}>
                {props.dataSource.map((item, index) =>
                  <Radio value={item.value} key={index}>
                    {item.label}
                    <Tooltip placement="bottom" title={item.labelExtra}>
                      <Icon type="question-circle-o" style={{ marginLeft: 5 }}/>
                    </Tooltip>
                  </Radio>
                )}
              </RadioGroup>
            )}
          </FormItem>
        </div>
      </div>
    );
  }
}
