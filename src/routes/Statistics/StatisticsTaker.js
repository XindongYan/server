import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import querystring from 'querystring';
import G2 from '@antv/g2';
import { Table, Card, Button, Input, Form, Menu, Checkbox, Popconfirm, Modal, Select, Row, Col,
Popover, Dropdown, Icon, message, Radio, Tooltip, Cascader } from 'antd';
import { Link } from 'dva/router';
import TrimSpan from '../../components/TrimSpan';
import { ORIGIN, TASK_APPROVE_STATUS, APPROVE_FLOWS, APPROVE_ROLES, CHANNELS, CHANNELS_FOR_CASCADER, TASK_TYPES } from '../../constants';
import DockPanel from '../../components/DockPanel';
import TaskNameColumn from '../../components/TaskNameColumn';
import TaskStatusColumn from '../../components/TaskStatusColumn';
import styles from './index.less';

const Search = Input.Search;
const FormItem = Form.Item;
const { Option } = Select;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  data: state.statistics.statisticsTaker,
  loading: state.statistics.statisticsTakerLoading,
  suggestionUsers: state.team.suggestionUsers,
  teamUsers: state.team.teamUsers,
  teamUser: state.user.teamUser,
}))
@Form.create()
export default class StatisticsTaker extends PureComponent {
  state = {
  }

  componentWillMount() {
    const { dispatch, data: { pagination }, teamUser: { team_id, user_id }, publish_taobao_time_start, publish_taobao_time_end, daren_id } = this.props;
    if (team_id) {
      this.props.dispatch({
        type: 'statistics/fetchStatisticsTaker',
        payload: { team_id: team_id, user_id, publish_taobao_time_start, publish_taobao_time_end, daren_id },
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { dispatch, data: { pagination }, teamUser: { team_id, user_id }, publish_taobao_time_start, publish_taobao_time_end, daren_id } = nextProps;
    if (this.props.teamUser.team_id !== nextProps.teamUser.team_id ||
      ( nextProps.teamUser.team_id && this.props.publish_taobao_time_start !==  publish_taobao_time_start) ||
      this.props.daren_id !==  daren_id) {
      this.props.dispatch({
        type: 'statistics/fetchStatisticsTaker',
        payload: { team_id, user_id, publish_taobao_time_start, publish_taobao_time_end, daren_id },
      });
    }
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, teamUser: { team_id, user_id }, publish_taobao_time_start, publish_taobao_time_end, daren_id } = this.props;
    const { searchValue } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      team_id,
      user_id,
      daren_id,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      search: searchValue,
      ...filters,
      publish_taobao_time_start,
      publish_taobao_time_end,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'statistics/fetchStatisticsTaker',
      payload: params,
    });
  }

  getStatisticsTotal = async (params) => {
    const alias = await queryStatisticsTotal(params);
    if (alias.total) {
      this.setState({
        total: alias.total,
      });
    }
    if (alias.channelCounts) {
      const channelCounts = alias.channelCounts.map(item1 => {
        const channel = CHANNELS.find(item => item.id === item1.channel[0]);
        const activity = channel.activityList.find(item => item.id === item1.channel[1]);
        return {...item1, text: `${channel.name}/${activity.name}`};
      });
      this.setState({
        channelCounts: channelCounts,
      });
    }
  }
  handleSearch = (value, name) => {
    const { dispatch, data: { pagination }, teamUser: { team_id, user_id }, publish_taobao_time_start, publish_taobao_time_end, daren_id } = this.props;
    const values = {
      team_id,
      user_id,
      publish_taobao_time_start,
      publish_taobao_time_end,
      daren_id,
    };
    if(name === 'time') {
      values['publish_taobao_time_start'] = value[0] ? value[0].format('YYYY-MM-DD 00:00:00') : '';
      values['publish_taobao_time_end'] = value[1] ? value[1].format('YYYY-MM-DD 23:59:59') : '';
    } else if (name === 'channel' && value && value.length) {
      values[name] = JSON.stringify(value);
    } else {
      values[name] = value;
    }
    dispatch({
      type: 'statistics/fetchStatisticsTaker',
      payload: { ...values, ...pagination},
    });
  }
  handleSearchChange = (e) => {
    if (e.target.value.length === 0) {
      this.handleSearch(e.target.value, 'search');
    }
    this.setState({ searchValue: e.target.value });
  }
  handleShowDockPanel = (record, activeKey) => { //分析
    this.props.dispatch({
      type: 'task/showDockPanel',
      payload: {
        _id: record._id,
        activeKey,
      },
    });
  }
  render() {
    const { data, loading, formData, form: { getFieldDecorator }, suggestionUsers, teamUsers } = this.props;
    const columns = [
      {
        title: '写手',
        dataIndex: 'taker_id',
        width: 140,
        fixed: 'left',
        render: (val, record) => (
          val && val.nickname ? <TrimSpan text={val.nickname} length={7}/> : ''
        ),
      },
      {
        title: '总文章数',
        width: 110,
        dataIndex: 'sumTaskCnt',
        render: val => val ? val : '',
        sorter: true,
      },
      {
        title: '总阅读数',
        dataIndex: 'sumReadCnt',
        width: 110,
        render: val => val ? val : '',
        sorter: true,
      },
      {
        title: '总进店数',
        width: 110,
        dataIndex: 'sumCntIpv',
        render: (val) => val ? val.value : '',
        sorter: true,
      },
      {
        title: '总付款金额',
        width: 110,
        dataIndex: 'totalAlipayFee',
        render: (val) => val ? val : 0,
      },
      {
        title: '总淘宝佣金',
        width: 110,
        dataIndex: 'fee',
        render: (val) => val ? val : 0,
      },
      {
        title: '总动态奖励',
        width: 110,
        dataIndex: 'incomeRewards',
        render: (val) => val && val.length > 0 ? val.map(item => item.fee).reduce((a, b) => a + b, 0).toFixed(2) : '',
      },
      {
        title: '总尼采佣金',
        width: 110,
        key: '0',
        render: (val) => val ? val : '',
      },
      {
        title: '总尼采奖励',
        width: 110,
        key: '1',
        render: (val) => val ? val : '',
      },
      {
        title: '平均通过次数',
        width: 110,
        key: '2',
        render: (val) => val ? val : '',
      },
    ];
    const opera = {
      title: '操作',
      width: 80,
      fixed: 'right',
      render: (record) => {
        return (
          <div>
            <a onClick={() => this.handleShowDockPanel(record, 'AnalyzePane')}>
              分析
            </a>
          </div>
        );
      },
    };
    // columns.push(opera);
    return (
      <div>
        <div className={styles.tableListOperator}>
          <Select
            allowClear={true}
            style={{ width: 160, marginRight: 8 }}
            placeholder="成员"
            onSelect={(e) => this.handleSearch(e, 'taker_id')}
            onChange={(e) => this.handleSearch(e, 'taker_id')}
            showSearch
            optionFilterProp="children"
          >
            {teamUsers.map(teamUser => teamUser.user_id ? <Option key={teamUser.user_id._id} value={teamUser.user_id._id}>{teamUser.user_id.nickname}</Option> : '')
            }
          </Select>
          {
          //   <Search
          //   style={{ width: 260, float: 'right' }}
          //   placeholder="ID／名称／商家标签"
          //   onChange={this.handleSearchChange}
          //   onSearch={(value) => this.handleSearch(value, 'search')}
          //   enterButton
          // />
          }
        </div>
        <div style={{ marginTop: 20 }} className={styles.tableList}>
          <Table
            scroll={{ x: 1200 }}
            loading={loading}
            dataSource={data.list}
            columns={columns}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              ...data.pagination,
            }}
            onChange={this.handleStandardTableChange}
            rowKey="_id"
          />
          <DockPanel />
        </div>
      </div>
    );
  }
}
