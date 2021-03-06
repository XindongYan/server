import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Card, Button, message, Menu, DatePicker, Tooltip, Icon } from 'antd';
import StatisticsTask from './StatisticsTask';
import StatisticsChannel from './StatisticsChannel';
import StatisticsTaker from './StatisticsTaker';

import { TASK_TYPES } from '../../constants';

const { RangePicker } = DatePicker;
const SubMenu = Menu.SubMenu;

@connect(state => ({
  publish_taobao_time_end: state.statistics.publish_taobao_time_end,
  publish_taobao_time_start: state.statistics.publish_taobao_time_start,
  currentUser: state.user.currentUser,
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
    const { publish_taobao_time_start, publish_taobao_time_end, currentUser } = this.props;
    const { currentKey } = this.state;
    const newProps = { publish_taobao_time_start, publish_taobao_time_end, daren_id: currentUser._id };
    let content = currentKey;
    if (currentKey === 'task') {
      content = <StatisticsTask {...newProps}/>
    } else if (currentKey === 'channel') {
      content = <StatisticsChannel {...newProps}/>
    } else if (currentKey === 'taker') {
      content = <StatisticsTaker {...newProps}/>
    }
    return (
      <div>
        <Card bodyStyle={{ paddingBottom: 0 }}>
          <Tooltip placement="top" title="发布到淘宝的时间">
            发布时间<Icon type="question-circle-o" style={{ margin: '0 2px 0 6px' }} /><strong style={{ margin: '0 8px 0 2px' }}>:</strong>
          </Tooltip>
          <RangePicker allowClear={false} style={{ width: 240 }}
            value={[moment(publish_taobao_time_start || new Date()), moment(publish_taobao_time_end || new Date())]}
            onChange={(value) => this.handleTimeRangeChange(value)}
          />
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
            <Menu.Item key="taker">
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
