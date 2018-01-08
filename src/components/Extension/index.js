import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, message, Input, Button, Row, Col } from 'antd';

import styles from './index.less';

@connect(state => ({

}))

export default class Extension extends PureComponent {
  state = {

  }
  componentDidMount() {

  }
  componentWillUnmount() {

  }
  
  handelCopy = () => {
    const clipboardswfdata = '12312312312312';  
    window.document.clipboardswf.SetVariable('str', clipboardswfdata);  
  }
  render() {
    const { visible, url } = this.props;
    return (
        <Modal
          width={700}
          title="推广"
          visible={this.props.visible}
        >
          <div>
            <div>
              <img src="" />
            </div>
            <Row gutter={16}>
              <Col span={20}>
                <Input
                  value={url || ''}
                  disabled={true}
                  id="box"
                />
              </Col>
              <Col span={4}>
                <Button type="primary" onClick={this.handelCopy}>复制</Button>
              </Col>
                
            </Row>
          </div>
        </Modal>
    );
  }
}
