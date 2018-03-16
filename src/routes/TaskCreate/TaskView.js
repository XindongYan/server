import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Input, Select, Icon, Button, Upload, message, Row, Col } from 'antd';
import path from 'path';
import querystring from 'querystring';
import ProjectDetail from '../../components/ProjectDetail';
import styles from './TableList.less';

@connect(state => ({
  formData: state.task.formData,
  project: state.taskSquare.project,
}))
export default class TaskForm extends PureComponent {
  state = {

  }
  componentDidMount() {
    const { dispatch, formData } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    dispatch({
      type: 'task/fetchTask',
      payload: { _id: query._id },
      callback: (result) => {
        if (result.task.project_id) {
          dispatch({
            type: 'taskSquare/fetchProject',
            payload: { ...this.state.page, _id: result.task.project_id }
          });
        }
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    const { dispatch, formData } = this.props;
    
  }
  render() {
    const { formData, project } = this.props;
    return (
      <div>
        { formData.project_id && project && project._id &&
          <ProjectDetail project={project} />
        }
        <Card bordered={false} title="任务详情" style={{ padding: '0 0 40px' }}>
          <div className={styles.taskViewBox}>
            <Row gutter={24} className={styles.taskViewList}>
              <Col span={6}>
                任务标题：
              </Col>
              <Col span={18}>
                <div>{formData.name || '无'}</div>
              </Col>
            </Row>
            <Row gutter={24} className={styles.taskViewList}>
              <Col span={6}>
                商家名称：
              </Col>
              <Col span={18}>
                <div>{formData.merchant_tag || '无'}</div>
              </Col>
            </Row>
            <Row gutter={24} className={styles.taskViewList}>
              <Col span={6}>
                渠道：
              </Col>
              <Col span={18}>
                <div>{formData.channel_name || '无'}</div>
              </Col>
            </Row>
            <Row gutter={24} className={styles.taskViewList}>
              <Col span={6}>
                任务描述：
              </Col>
              <Col span={18}>
                <div style={{ wordWrap: 'break-word' }}>{formData.desc || '无'}</div>
              </Col>
            </Row>
            <Row gutter={24} className={styles.taskViewList}>
              <Col span={6}>
                附 件：
              </Col>
              <Col span={18}>
                { formData.attachments && formData.attachments.length > 0 ?
                  formData.attachments.map(item => <a target="_blank" href={item.url}>{item.name}</a>)
                  : <span>无</span>
                }
              </Col>
            </Row>
            <Row gutter={24} className={styles.taskViewList}>
              <Col span={6}>
                奖 励：
              </Col>
              <Col span={18}>
                <div>¥ {formData.price}</div>
              </Col>
            </Row>
          </div>
        </Card>
      </div>
    );
  }
}
