import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';

export default class UserAgent extends PureComponent {
  state = {
  }
  componentDidMount() {
    var warnChrome = null;
    if (warnChrome) {
      warnChrome.destroy();
    }
    if (navigator.userAgent.indexOf('Chrome') === -1) {
        warnChrome = Modal.warning({
          title: '当前的浏览器版本可能存在兼容性问题，需要使用Chrome',
      });
    } else {
      var userAgent = navigator.userAgent.substring(navigator.userAgent.indexOf('Chrome')+7,navigator.userAgent.indexOf('Chrome')+9);
      if (Number(userAgent) < 59) {
        warnChrome = Modal.warning({
          title: '当前的浏览器版本过低，需要升级',
        });
      }
    }
  }
  componentWillReceiveProps(nextProps) {

  }
  render() {
    return (
      <div>
      </div>
    );
  }
}
