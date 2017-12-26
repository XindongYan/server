import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Icon, message } from 'antd';
import styles from './MerchantTag.less';

@connect(state => ({

}))

export default class MerchantTag extends PureComponent {
  state = {
  }
  componentDidMount() {

  }
  componentWillUnmount() {

  }
  changeInp = (e) => {
    if (this.props.onChange) this.props.onChange({ merchant_tag: e.target.value });
  }
  render() {
    const { merchant_tag } = this.props;
    return (
      <div style={{ marginBottom: 15 }}>
        <div className={styles.taskTitBox} style={{lineHeight: '40px',background: '#f5f5f5', textIndent: '1em', fontSize: 14, color: '#333'}}>
          商家标签
        </div>
        <div className={styles.taskList}>
          <Input
            type="text"
            value={merchant_tag}
            maxLength="30"
            onChange={this.changeInp}
            placeholder="请在这里输入商家标签,最多30个字"
          />
        </div>
      </div>
    );
  }
}
