import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Card, Button, message, Menu, DatePicker, Tooltip, Icon } from 'antd';
import StatisticsTask from './StatisticsTask';
import { TASK_TYPES } from '../../constants';

const { RangePicker } = DatePicker;
const SubMenu = Menu.SubMenu;


@connect(state => ({
  publish_taobao_time_end: state.statistics.publish_taobao_time_end,
  publish_taobao_time_start: state.statistics.publish_taobao_time_start,
}))

export default class Statistics extends PureComponent {
  state = {
    currentKey: 'task',
  }
  componentWillMount() {
    const publish_taobao_time_start = new Date();
    publish_taobao_time_start.setDate(1);
    publish_taobao_time_start.setHours(0, 0, 0, 0);
    const publish_taobao_time_end = new Date();
    this.props.dispatch({
      type: 'statistics/saveTimeRange',
      payload: { publish_taobao_time_start, publish_taobao_time_end },
    });
  }
  handleTimeRangeChange = (value) => {
    this.props.dispatch({
      type: 'statistics/saveTimeRange',
      payload: {
        publish_taobao_time_start: value[0].toDate(),
        publish_taobao_time_end: value[1].toDate(),
      },
    });
  }
  handleClick = (e) => {
    this.setState({
      currentKey: e.key,
    });
  }
  
  render() {
    const { publish_taobao_time_start, publish_taobao_time_end } = this.props;
    const { currentKey } = this.state;
    const newProps = { publish_taobao_time_start, publish_taobao_time_end };
    let content = currentKey;
    if (currentKey === 'task') {
      content = <StatisticsTask {...newProps}/>
    }
    return (
      <div>
        <Card bodyStyle={{ paddingBottom: 0 }}>
          <RangePicker allowClear={false} style={{ width: 240 }}
            value={[moment(publish_taobao_time_start || new Date()), moment(publish_taobao_time_end || new Date())]}
            onChange={(value) => this.handleTimeRangeChange(value)}
          />
          <Tooltip placement="top" title="发布时间">
            <Icon type="question-circle-o" style={{ marginLeft: 8 }} />
          </Tooltip>
          <Menu
            style={{ marginTop: 20, borderBottom: 'none' }}
            onClick={this.handleClick}
            selectedKeys={[this.state.currentKey]}
            mode="horizontal"
          >
             <Menu.Item key="task">
              文章
            </Menu.Item>
            <Menu.Item key="channel">
              渠道
            </Menu.Item>
            <Menu.Item key="writer">
              写手
            </Menu.Item>
            <Menu.Item key="shop" disabled={true}>
              店铺
            </Menu.Item>
            <Menu.Item key="product" disabled={true}>
              商品
            </Menu.Item>
          </Menu>
        </Card>
        <Card style={{ marginTop: 20 }}>
          {content}
        </Card>
      </div>
    );
  }
}
