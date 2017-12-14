import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Row, Col, Steps, Card } from 'antd';
import moment from 'moment';
import querystring from 'querystring';
import { Link } from 'dva/router';
import Result from '../../components/Result';

const { Step } = Steps;
@connect(state => ({
  formData: state.task.formData,
}))

export default class Success extends PureComponent {
  componentDidMount() {
    const query = querystring.parse(this.props.location.search.substr(1));
    if (query._id) {
      this.props.dispatch({
        type: 'task/fetchTask',
        payload: { _id: query._id },
      });
    }
  }
  render() {
    const { formData } = this.props;
    const desc1 = (
      <div style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.45)', position: 'relative', left: 42 }}>
        <div style={{ margin: '8px 0 4px' }}>
          {formData.taker_id ? formData.taker_id.name : ''}
        </div>
        <div>{formData.take_time ? moment(new Date(formData.take_time)).format('YYYY-MM-DD HH:mm') : ''}</div>
      </div>
    );

    const desc2 = (
      <div style={{ fontSize: 12, position: 'relative', left: 42 }}>
        <div style={{ margin: '8px 0 4px' }}>
          {formData.taker_id ? formData.taker_id.name : ''}
        </div>
        <div>{formData.handin_time ? moment(new Date(formData.handin_time)).format('YYYY-MM-DD HH:mm') : ''}</div>
      </div>
    );

    const extra = (
      <div>
        <div style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.85)', fontWeight: '500', marginBottom: 20 }}>
          任务名称: {formData.name}
        </div>
        <Row style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={12} lg={12} xl={6}>
            <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>任务 ID：</span>
            {formData.id}
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>截止时间：</span>
            {formData.deadline ? moment(new Date(formData.deadline)).format('YYYY-MM-DD HH:mm') : ''}
          </Col>
        </Row>
        <Steps style={{ marginLeft: -42, width: 'calc(100% + 84px)' }} progressDot current={1}>
          <Step title={<span style={{ fontSize: 14 }}>接单</span>} description={desc1} />
          <Step title={<span style={{ fontSize: 14 }}>提交审核</span>} description={desc2} />
          <Step title={<span style={{ fontSize: 14 }}>审核通过</span>} />
        </Steps>
      </div>
    );
    const actions = (
      <div>
        <Link to="/creation/writer-list">
          <Button type="primary">返回列表</Button>
        </Link>
        <Link to={`/writer/task/view?_id=${formData._id}`}>
          <Button style={{ marginLeft: 30 }}>查看详情</Button>
        </Link>
      </div>
    );
    return (
      <Card bordered={false}>
        <Result
          type="success"
          title="提交成功"
          description="任务将由审核人员作出审核，审核人员会给批注，请在审核完成后可以在 [已通过] 或 [未通过] 列表查看"
          extra={extra}
          actions={actions}
          style={{ marginTop: 48, marginBottom: 16 }}
        />
      </Card>
    );
  }
}
