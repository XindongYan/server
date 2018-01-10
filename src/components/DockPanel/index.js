import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Spin, Tabs, Breadcrumb, Row, Col } from 'antd';
import moment from 'moment';
import AnalyzePane from './panes/AnalyzePane';
import OperationPane from './panes/OperationPane';

import styles from './index.less';
const TabPane = Tabs.TabPane;

@connect(state => ({
  currentUser: state.user.currentUser,
  visible: state.task.dockPanel.visible,
  _id: state.task.dockPanel._id,
  formData: state.task.formData,
}))

export default class DockPanel extends PureComponent {
  state = {
    
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps._id && nextProps._id !== this.props._id) {
      this.props.dispatch({
        type: 'task/fetchTask',
        payload: { _id: nextProps._id },
      });
    }
  }
  handleClose = () => {
    this.props.dispatch({
      type: 'task/hideDockPanel'
    });
  }
  
  renderExtraItem = (label, value, span) => {
    return (
      <Col span={span}>
        <Row>
          <span style={{ color: 'grey', fontSize: '14px' }}>{label}</span>
        </Row>
        <Row>{value}
        </Row>
      </Col>
    );
  }
  render() {
    const { visible, _id, formData } = this.props;
    const maskClassNames = [styles['dock-panel-mask']];
    const panelClassNames = [styles['dock-panel'], styles['dock-panel-lg']];
    if (!visible) {
      maskClassNames.push(styles['dock-panel-mask-hidden']);
    } else {
      panelClassNames.push(styles['dock-panel-visible']);
    }
    return (
      <div >
        <div className={maskClassNames.join(' ')} onClick={this.handleClose} />
        <div className={panelClassNames.join(' ')}>

            <div className={styles['dock-panel-head']}>
              <div className={styles['dock-panel-head-title']}>
                <Breadcrumb>
                  <Breadcrumb.Item><span style={{ fontSize: '16px' }}>{formData.id}</span></Breadcrumb.Item>
                </Breadcrumb>
                <div className={styles['dock-panel-head-close']}>
                  <Button shape="circle" icon="close" onClick={this.handleClose} />
                </div>
              </div>
              <div className={styles['dock-panel-head-extra']}>
                <Row>
                  {this.renderExtraItem('任务名称', formData.name, 4)}
                  {this.renderExtraItem('商家标签', formData.merchant_tag, 4)}
                  {this.renderExtraItem('渠道', formData.channel_name, 4)}
                  {this.renderExtraItem('创建时间', moment(formData.create_time).format('YYYY-MM-DD HH:mm'), 4)}
                  {this.renderExtraItem('活动酬劳', `￥${formData.price}`, 4)}
                </Row>
              </div>
            </div>
            <div className={[styles['dock-panel-body'], styles['with-header-extra']].join(' ')}>
              <Tabs>
                <TabPane tab="分析" key="1">
                  <AnalyzePane task={formData}/>
                </TabPane>
                <TabPane tab="动态" key="2">
                  <OperationPane _id={_id}/>
                </TabPane>
              </Tabs>
            </div>
        </div>
      </div>
    );
  }
}
