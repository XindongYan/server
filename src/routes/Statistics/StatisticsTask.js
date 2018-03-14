import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import querystring from 'querystring';
import G2 from '@antv/g2';
import { Table, Card, Button, Input, Form, Menu, Checkbox, Popconfirm, Modal, Select, Row, Col,
Popover, Dropdown, Icon, message, Radio, Tooltip, Cascader } from 'antd';
import { Link } from 'dva/router';
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
  data: state.statistics.statisticsTask,
  loading: state.statistics.statisticsTaskLoading,
  suggestionUsers: state.team.suggestionUsers,
  teamUsers: state.team.teamUsers,
  teamUser: state.user.teamUser,
}))
@Form.create()
export default class StatisticsTask extends PureComponent {
  state = {
    searchValue: '',
    task: {},
    total: {},
    resultChart: null,
    channelChart: null,
  }

  componentWillMount() {
    const { dispatch, data: { pagination }, teamUser: { team_id, user_id }, publish_taobao_time_start, publish_taobao_time_end, daren_id } = this.props;
    if (team_id) {
      this.props.dispatch({
        type: 'statistics/fetchStatisticsTask',
        payload: { team_id: team_id, user_id, publish_taobao_time_start, publish_taobao_time_end, daren_id },
      });
      this.props.dispatch({
        type: 'team/fetchTeamUsers',
        payload: { team_id: team_id },
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { dispatch, data: { pagination }, teamUser: { team_id, user_id }, publish_taobao_time_start, publish_taobao_time_end, daren_id } = nextProps;
    if (this.props.teamUser.team_id !== nextProps.teamUser.team_id ||
      ( nextProps.teamUser.team_id && this.props.publish_taobao_time_start !==  publish_taobao_time_start) ||
      this.props.daren_id !==  daren_id) {
      this.props.dispatch({
        type: 'statistics/fetchStatisticsTask',
        payload: { team_id, user_id, publish_taobao_time_start, publish_taobao_time_end, daren_id },
      });
      this.props.dispatch({
        type: 'team/fetchTeamUsers',
        payload: { team_id: nextProps.teamUser.team_id },
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
      type: 'statistics/fetchStatisticsTask',
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
    } else if (name === 'channel' && value.length >= 1) {
      values[name] = JSON.stringify(value);
    } else {
      values[name] = value;
    }
    dispatch({
      type: 'statistics/fetchStatisticsTask',
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
  renderTotalBox = () => {
    const { data } = this.props;
    let totalList = [];
    if (data.totals.sumCntIpv !== undefined) {
      totalList = [{
        text: '总文章数',
        value: data.totals.sumTaskCnt,
      }, {
        text: '总进店数',
        value: data.totals.sumCntIpv,
      }, {
        text: '总阅读数',
        value: data.totals.sumReadCnt,
      }, {
        text: '淘宝总佣金',
        value: Number(data.totals.fee).toFixed(2),
      }];
    }
    return totalList;
  }
  render() {
    const { data, loading, formData, form: { getFieldDecorator }, suggestionUsers, teamUsers } = this.props;
    const totalList = this.renderTotalBox();

    const gridStyle = {
      width: `${1 / totalList.length * 100}%`,
      textAlign: 'center',
    };
    const columns = [
      {
        title: '任务ID',
        dataIndex: 'id',
        width: 80,
        fixed: 'left',
        render: (val, record) => (
          <a onClick={() => this.handleShowDockPanel(record, 'AnalyzePane')}>
            {val}
          </a>
        )
      },
      {
        title: '写手',
        width: 120,
        dataIndex: 'taker_id',
        render: val => val ? val.nickname : '',
      },
      {
        title: '内容标题',
        dataIndex: 'name',
        width: 200,
        render: (val, record) => (
          <a target="_blank" href={record.taobao && record.taobao.url ? record.taobao.url : ''}>
            <TaskNameColumn text={val} length={10} />
          </a>
        )
      },
      {
        title: '进店数',
        width: 80,
        dataIndex: 'taobao.summary.sumCntIpv',
        render: (val) => val ? val.value : '',
      },
      {
        title: '阅读数',
        width: 80,
        dataIndex: 'taobao.summary.sumReadCnt',
        render: (val) => val ? val.value : '',
      },
      {
        title: '付款金额',
        width: 90,
        dataIndex: 'totalAlipayFee',
        render: (val) => val ? val : 0,
      },
      {
        title: '淘宝佣金',
        width: 90,
        dataIndex: 'fee',
        render: (val) => val ? val : 0,
      },
      {
        title: '淘宝动态奖励',
        dataIndex: 'taobao.incomeRewards',
        render: (val) => val && val.length > 0 ? val.map(item => item.fee).reduce((a, b) => a + b, 0).toFixed(2) : '',
      },
      {
        title: '尼采佣金',
        width: 90,
        key: '0',
        render: (val) => val ? val : '',
      },
      {
        title: '尼采奖励',
        width: 90,
        key: '1',
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
          >
            {teamUsers.map(teamUser => teamUser.user_id ? <Option key={teamUser.user_id._id} value={teamUser.user_id._id}>{teamUser.user_id.nickname}</Option> : '')
            }
          </Select>

          <Cascader
            style={{ marginRight: 8 }}
            allowClear={true}
            showSearch={true}
            options={CHANNELS_FOR_CASCADER}
            placeholder="选择渠道"
            onChange={(e) => this.handleSearch(e, 'channel')}
          />

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
        <Row style={{margin: '20px 0'}}>
          { totalList.map((item, index) => <Card.Grid key={index} style={gridStyle}>
            <div>{item.text}</div>
            <h2>{item.value}</h2>
          </Card.Grid>)}
        </Row>
        <div className={styles.tableList}>
          <Table
            // scroll={{ x: 1300 }}
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
