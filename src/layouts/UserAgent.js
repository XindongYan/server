import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Icon } from 'antd';

export default class UserAgent extends PureComponent {
  state = {
    visible: false,
    lowerVisible: false,
  }
  componentDidMount() {
    if (navigator.userAgent.indexOf('Chrome') === -1) {
      this.setState({
        visible: true,
      })
    } else {
      this.setState({
        lowerVisible: true,
      })
    }
  }
  componentWillReceiveProps(nextProps) {

  }
  render() {
    return (
      <div>
        <Modal
          title=""
          visible={this.state.lowerVisible}
          closable={false}
          footer={null}
        >
          <p style={{ fontSize: 16, padding: '20px 0', minHeight: 80 }}>
            <Icon type="warning" style={{ float: 'left', fontSize: 40, marginRight: 10, color: '#faad14', marginRight: 10 }} />
            <span style={{ float: 'left', padding: 10 }}>当前的浏览器版本过低，需要升级(版本号59.0以上)</span>
          </p>
        </Modal>

        <Modal
            title=""
            visible={this.state.visible}
            closable={false}
            footer={null}
          >
          <p style={{ fontSize: 16, padding: '20px 0', minHeight: 100 }}>
            <Icon type="warning" style={{ float: 'left', fontSize: 40, marginRight: 10, color: '#faad14', marginRight: 10 }} />
            <span style={{ padding: 10 }}>当前的浏览器版本可能存在兼容性问题，请使用chrome浏览器浏览(版本号59.0以上)</span>
          </p>
        </Modal>
      </div>
    );
  }
}
