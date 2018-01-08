import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, message } from 'antd';
import Input from './Input.js';

import styles from './index.less';

@connect(state => ({

}))

export default class WeitaoForm extends PureComponent {
  state = {
    component: '',
    name: '',
    laybel: '',
    props: {
      maxLength: 1,
      placeholder: '',
      value: '',
      max: 1,
      min: 1,
      uploadTips: '',
    },
    rules: [],
    tips: '',
  }
  componentDidMount() {

  }
  componentWillUnmount() {

  }
  handleDescChange = (content) => {
    if (this.props.onChange) this.props.onChange({ task_desc: content });
  }
  
  render() {
    const { style, operation, formData } = this.props;
    return (
      <div className={styles.taskBox} style={style}>
        <div className={styles.taskTitBox} style={{lineHeight: '40px',background: '#f5f5f5', textIndent: '1em', fontSize: 14, color: '#333'}}>
          内容创作
        </div>
        <div className={styles.taskContentBox}>
          <Input form={this.props.form} />
        </div>
      </div>
    );
  }
}
