import React, { PureComponent } from 'react';
import styles from './index.less';

export default class Title extends PureComponent {
  state = {
  }
  handleChange = (value) => {
    if (this.props.onChange) this.props.onChange(value)
  }
  render() {
    const { name, props, rules } = this.props;
    // const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.taskListInp}>
        <div style={{ borderLeft: '4px #6AF solid', paddingLeft: 12, margin: '40px 0 20px', fontSize: 20, color: '#333' }}>
          {props.text}
        </div>
      </div>
    );
  }
}
