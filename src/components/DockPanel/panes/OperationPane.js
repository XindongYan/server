import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Timeline } from 'antd';
import moment from 'moment';

@connect(state => ({
  operationRecords: state.task.operationRecords,
}))
export default class OperationPane extends PureComponent {
  state = {

  }
  componentDidMount() {
    if (this.props._id) {
      this.props.dispatch({
        type: 'task/fetchOperationRecords',
        payload: { _id: this.props._id },
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps._id && nextProps._id !== this.props._id) {
      this.props.dispatch({
        type: 'task/fetchOperationRecords',
        payload: { _id: nextProps._id },
      });
    }
  }
  render() {
    const { operationRecords = [] } = this.props;
    return (
      <Card>
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
                <p>{moment(item.time).format('YYYY-MM-DD HH:mm')}<span style={{ marginLeft: 20 }}>{item.user_id ? item.user_id.nickname : ''}</span></p>
              </Timeline.Item>
            );
          })}
        </Timeline>
      </Card>
    );
  }
}
