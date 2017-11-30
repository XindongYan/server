import React, { PureComponent } from 'react';
import { Popover, Button, Badge } from 'antd';
import { ORIGIN } from '../../constants';

export default class TaskChat extends PureComponent {
  state = {
    visible: false,
    taskChatMsgNum: 0,
  }
  componentDidMount() {
    if (window.addEventListener) {
      window.addEventListener("storage", this.handleNewMessge, false);
    } else if (window.attachEvent) {
      window.attachEvent("onstorage", this.handleNewMessge);
    }
  }
  handleNewMessge = () => {
    console.log(window.localStorage);
    this.setState({ taskChatMsgNum: Number(window.localStorage.taskChatMsgNum) });
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
    const { visible, taskChatMsgNum } = this.state;
    return (
      <div style={{ position: 'fixed', top: 80, right: 20 }}>
        <Popover
          content={
            <iframe
              title="taskChat"
              src={`${ORIGIN}/wechat/taskChat?task_id=${task._id}`}
              style={{ width: 320, height: '500px' }}
            >
            </iframe>
          }
          title="聊天窗口"
          trigger="click"
          placement="bottomRight"
          visible={visible}
          onVisibleChange={this.handleVisibleChange}
        >
          <Badge count={taskChatMsgNum}>
            <Button type="default" shape="circle" icon="message" size="large" />
          </Badge>
        </Popover>
      </div>
    );
  }
}
