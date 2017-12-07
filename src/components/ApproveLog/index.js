import React, { PureComponent } from 'react';
import { Row, Col, Popover, Timeline, Button } from 'antd';
import moment from 'moment';
import { TASK_APPROVE_STATUS } from '../../constants';

export default class ApproveLog extends PureComponent {
  state = {}
  renderGrades = (grades) => {
    return grades.map((item, index) => (
      <Row key={index}>
        <Col span={8}>{item.name}:</Col><Col span={16}>{item.value} 分</Col>
      </Row>
    ));
  }
  render() {
    const { approveData = [] } = this.props;
    return (
      <div style={{ position: 'fixed', top: 140, right: 20, zIndex: 8 }}>
        <Popover
          content={
            <Timeline style={{ width: 300 }}>
              {approveData.map((item, index) => {
                let color = 'blue';
                if (item.approve_status === TASK_APPROVE_STATUS.passed) {
                  color = 'green';
                } else if (item.approve_status === TASK_APPROVE_STATUS.rejected) {
                  color = 'red';
                }
                return (
                  <Timeline.Item color={color} key={index}>
                    <p>{moment(item.approve_time).format('YYYY-MM-DD HH:mm')} {item.approver_id ? item.approver_id.name : ''}</p>
                    {item.grade > 0 &&
                      <p>{this.renderGrades(item.grades)}
                      <Row key={4}>
                        <Col span={8}>得分:</Col><Col span={16}>{item.grade} 分</Col>
                      </Row>
                      </p>}
                  </Timeline.Item>
                );
              })}
            </Timeline>
          }
          title="审核记录"
          trigger="hover"
          placement="bottomRight"
        >
          <Button type="default" shape="circle" icon="bars" size="large" />
        </Popover>
      </div>
    );
  }
}

