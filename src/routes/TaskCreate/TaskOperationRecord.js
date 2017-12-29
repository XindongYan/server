import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Popover, Timeline } from 'antd';
import moment from 'moment';

@connect(state => ({
  operationRecords: state.task.operationRecords,
}))
export default class TaskOperationRecord extends PureComponent {
  state = {
    visible: false,
  }
  handleLoadRecords = () => {
    const { _id } = this.props;
    this.props.dispatch({
      type: 'task/fetchOperationRecords',
      payload: { _id },
    });
  }
  hide = () => {
    this.setState({
      visible: false,
    });
  }
  handleVisibleChange = (visible) => {
    this.setState({ visible });
    if (visible) {
      this.handleLoadRecords();
    }
  }
  render() {
    const { operationRecords = [] } = this.props;
    return (
      <Popover
        content={
          <Timeline style={{ width: 300 }}>
            {operationRecords.map((item, index) => {
              let color = 'blue';
              if (item.operation.indexOf('审核 通过') >= 0) {
                color = 'green';
              } else if (item.operation.indexOf('审核 不通过') >= 0 || item.operation.indexOf('退回') >= 0) {
                color = 'red';
              }
              return (
                <Timeline.Item color={color} key={index}>
                  <p>{item.operation}</p>
                  <p>{moment(item.time).format('YYYY-MM-DD HH:mm')} {item.user_id ? item.user_id.name : ''}</p>
                </Timeline.Item>
              );
            })}
          </Timeline>
        }
        title="动态"
        trigger="hover"
        placement="left"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
      >
      {this.props.children}
      </Popover>
    );
  }
}

