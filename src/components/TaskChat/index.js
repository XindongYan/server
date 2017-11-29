import React, { PureComponent } from 'react';
import { Popover, Button } from 'antd';
import { ORIGIN } from '../../constants';

export default class TaskChat extends PureComponent {
  state = {
    visible: false,
  }
  hide = () => {
    this.setState({
      visible: false,
    });
  }
  handleVisibleChange = (visible) => {
    this.setState({ visible });
  }

  render() {
    const { task } = this.props;
    const { visible } = this.state;
    return (
      <div style={{ position: 'fixed' }}>
        <Popover
          content={
            <iframe src={`${ORIGIN}/htmls/taskChat.html?task_id=${task._id}`}
              style={{ width: 380, height: '600px' }}>
            </iframe>
          }
          title="聊天窗口"
          trigger="click"
          placement="bottomRight"
          visible={visible}
          onVisibleChange={this.handleVisibleChange}
        >
          <Button type="default" shape="circle" icon="message" size="large"/>
        </Popover>
      </div>
    );
  }
}
