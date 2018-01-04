import React, { PureComponent } from 'react';
import { connect } from 'dva';
import $ from 'jquery';
import { Input, Icon, message, Cascader } from 'antd';
// import { ORIGIN  } from '../../constants';
import styles from './MerchantTag.less';
const ORIGIN = 'http://localhost:3000';

@connect(state => ({

}))

export default class CascaderSelect extends PureComponent {
  state = {
    residences: [],
  }
  componentDidMount() {
    $.get(`${ORIGIN}/jsons/we.taobao.json`,(result) => {
      this.setState({
        residences: result,
      })
    })
  }
  componentWillUnmount() {

  }
  handleTaskChange = (e) => {
    if (this.props.onChange) this.props.onChange(e, 'crowd')
  }
  render() {
    const { formData } = this.props;
    return (
      <div>
        <p className={styles.lineTitleDefult}>
          本文目标人群
        </p>
        <div>
          <Cascader
            placeholder="请选择"
            style={{ width: '200px' }}
            value={formData.crowd}
            onChange={this.handleTaskChange}
            options={this.state.residences}
          />
        </div>
        <p className={styles.promptText}>围绕匹配的人群进行创作，可得到更多曝光~, 点击
          <a target="_blank" href="https://we.taobao.com/creative/group">#查看人群说明与热点#</a>
        </p>
      </div>
    );
  }
}
