import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import querystring from 'querystring';
import { Table, Card, Button, Input, DatePicker, Form, Menu, Checkbox, Popconfirm, Modal, Select, Row, Col,
Popover, Dropdown, Icon, message, Radio, Tooltip } from 'antd';
import { Link } from 'dva/router';
import { ORIGIN, TASK_APPROVE_STATUS, APPROVE_FLOWS, APPROVE_ROLES, CHANNELS } from '../../constants';
import DockPanel from '../../components/DockPanel';
import TaskNameColumn from '../../components/TaskNameColumn';
import TaskStatusColumn from '../../components/TaskStatusColumn';
import ProjectDetail from '../../components/ProjectDetail';
import styles from './TeamList.less';

const { RangePicker } = DatePicker;
const Search = Input.Search;
const FormItem = Form.Item;
const { Option } = Select;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  teamTask: state.task.teamTask,
  loading: state.task.teamTaskLoading,
  formData: state.project.formData,
  currentUser: state.user.currentUser,
  suggestionUsers: state.team.suggestionUsers,
  teamUsers: state.team.teamUsers,
  teamUser: state.user.teamUser,
}))
@Form.create()
export default class TeamTaskStatistics extends PureComponent {
  state = {
    modalVisible: false,
    darenModalVisible: false,
    selectedRows: [],
    selectedRowKeys: [],
    searchValue: '',
    task: {},
  };

  componentDidMount() {
    const { dispatch, teamUser, teamTask: { pagination, approve_status }, teamUser: { team_id } } = this.props;
    if (team_id) {
      dispatch({
        type: 'task/fetchTeamTasks',
        payload: { ...pagination, approve_status, team_id },
      });
    }
    if (teamUser.team_id) {
      this.props.dispatch({
        type: 'team/fetchTeamUsers',
        payload: { team_id: teamUser.team_id },
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { dispatch, teamUser, teamTask: { pagination, approve_status }, teamUser: { team_id } } = nextProps;
    if (teamUser.team_id !== this.props.teamUser.team_id) {
      dispatch({
        type: 'task/fetchTeamTasks',
        payload: { ...pagination, approve_status, team_id },
      });
    }
    if (nextProps.teamUsers.length === 0 && nextProps.teamUser.team_id) {
      this.props.dispatch({
        type: 'team/fetchTeamUsers',
        payload: { team_id: nextProps.teamUser.team_id },
      });
    }
  }
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, teamTask: { approve_status }, teamUser: { team_id } } = this.props;
    const { searchValue } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      team_id,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      approve_status,
      search: searchValue,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    
    window.scrollTo(0, 0);
    dispatch({
      type: 'task/fetchTeamTasks',
      payload: params,
    });
  }


  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'task/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
              selectedRowKeys: [],
            });
          },
        });
        break;
      default:
        break;
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  }
  
  handleSearch = (value, name) => {
    const { dispatch, teamTask: { pagination, approve_status }, teamUser: { team_id } } = this.props;
    const values = {
      approve_status,
      team_id,
      ...pagination,
    };
    if(name === 'time') {
      values['create_time_start'] = value[0] ? value[0].format('YYYY-MM-DD 00:00:00') : '';
      values['create_time_end'] = value[1] ? value[1].format('YYYY-MM-DD 23:59:59') : '';
    } else {
      values[name] = value;
    }
    dispatch({
      type: 'task/fetchTeamTasks',
      payload: values,
    });
  }

  handleAdd = () => {
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch(routerRedux.push(`/project/task/create?project_id=${query.project_id}`));
  }

  handleEdit = (record) => {
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch(routerRedux.push(`/project/task/edit?project_id=${query.project_id}&_id=${record._id}`));
  }
  handlePublish = (record) => {
    const { dispatch, currentUser, teamTask: { pagination, approve_status }, teamUser: { team_id } } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    dispatch({
      type: 'task/publish',
      payload: {
        _id: record._id,
        user_id: currentUser._id,
      },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          message.success(result.msg);
          dispatch({
            type: 'task/fetchTeamTasks',
            payload: { ...pagination, approve_status, team_id },
          });
        }
      },
    });
  }
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }
  handleShowSpecifyModal = (record) => {
    this.handleModalVisible(true);
    this.setState({ task: record });
  }
  handleDarenModalVisible = (flag) => {
    this.setState({
      darenModalVisible: !!flag,
    });
  }

  handleWithdraw = (record) => {
    const { dispatch, currentUser, teamUser: { team_id } } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    dispatch({
      type: 'task/withdraw',
      payload: {
        _id: record._id,
        user_id: currentUser._id,
      },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          message.success(result.msg);
          dispatch({
            type: 'task/fetchTeamTasks',
            payload: { team_id },
          });
        }
      },
    });
  }
  handleRemove = (record) => {
    const { dispatch, currentUser, teamUser: { team_id } } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    dispatch({
      type: 'task/remove',
      payload: {
        _id: record._id,
        user_id: currentUser._id,
      },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          message.success(result.msg);
          dispatch({
            type: 'task/fetchTeamTasks',
            payload: { team_id },
          });
        }
      },
    });
  }

  changeApproveStatus = (e) => {
    const { dispatch, teamTask, teamUser: { team_id } } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    dispatch({
      type: 'task/fetchTeamTasks',
      payload: { team_id, approve_status: e.target.value, },
    });
  }
  handleSearchChange = (e) => {
    if (e.target.value.length === 0) {
      this.handleSearch(e.target.value, 'search');
    }
    this.setState({ searchValue: e.target.value });
  }
  handleShowDockPanel = (record, activeKey) => {
    this.props.dispatch({
      type: 'task/showDockPanel',
      payload: {
        _id: record._id,
        activeKey,
      },
    });
  }
  render() {
    const { teamTask, loading, formData, form: { getFieldDecorator }, suggestionUsers, teamUsers } = this.props;
    const { selectedRows, modalVisible, selectedRowKeys, darenModalVisible } = this.state;
    console.log(teamUsers);
    const flow = APPROVE_FLOWS.find(item => item.value === formData.approve_flow);
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const columns = [
      {
        title: '序号',
        key: 'index',
        width: 80,
        fixed: 'left',
        render: (val, record, index) => <span>{index + 1}</span>,
      },
      {
        title: '昵称',
        dataIndex: 'user_id',
        render: val => val ? val.nickname : '',
      },
      {
        title: '内容ID',
        dataIndex: 'id',
        render: (val, record) => (
          <a target="_blank" href={`${ORIGIN}/public/task/details?id=${record._id}`}>
            <TaskNameColumn text={val} length={10} />
          </a>
        )
      },
      {
        title: '内容标题',
        dataIndex: 'name',
        render: (val, record) => (
          <a target="_blank" href={`${ORIGIN}/public/task/details?id=${record._id}`}>
            <TaskNameColumn text={val} length={10} />
          </a>
        )
      },
      {
        title: '进店数',
        dataIndex: 'sumCntIpv',
        render: (record) => (
          <TaskNameColumn text={record} length={10} />
        )
      },
      {
        title: '转发次数',
        dataIndex: 'sumShareCnt',
        render: (val) => val ? val : '',
      },
      {
        title: '互动数',
        dataIndex: 'sumSnsCnt',
        render: (val) => val ? val : '',
      },
      {
        title: '阅读数',
        dataIndex: 'sumReadCnt',
        render: (val) => val ? val : '',
      },
      {
        title: '点赞数',
        dataIndex: 'sumFavorCnt',
        render: (val) => val ? val : '',
      },
      {
        title: '评论数',
        dataIndex: 'sumCmtCnt',
        render: (val) => val ? val : '',
      },
      {
        title: '付款金额',
        dataIndex: 'totalAlipayFee',
        render: (val) => val ? val : '',
      },
      {
        title: '淘宝佣金',
        key: '1',
        render: (val) => val ? val : '',
      },
      {
        title: '淘宝动态奖励',
        dataIndex: 'fee',
        render: (val) => val ? val : '',
      },
      {
        title: '尼采佣金',
        key: '3',
        render: (val) => val ? val : '',
      },
      {
        title: '尼采奖励',
        key: '4',
        render: (val) => val ? val : '',
      },
    ];
    const opera = {
      title: '操作',
      width: 80,
      fixed: 'right',
      render: (record) => {
        if (record.approve_status === TASK_APPROVE_STATUS.publishedToTaobao || record.approve_status === TASK_APPROVE_STATUS.taobaoRejected ||
          record.approve_status === TASK_APPROVE_STATUS.taobaoAccepted) {
          return (
            <div>
              <a onClick={() => this.handleShowDockPanel(record, 'AnalyzePane')}>
                分析
              </a>
            </div>
          );
        }
        return '';
      },
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    columns.push(opera);
    return (
      <div>
        <Card bordered={false} bodyStyle={{ padding: 14 }}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="成员"
                onSearch={this.handleSearchApprove}
              >
                {//teamUsers.map((teamUser, index) => <Option key={index} value={teamUser.user_id ? teamUser.user_id._id : ''}>{teamUser.user_id.nickname}</Option>)
              }
              </Select>
              <Select
                allowClear
                showSearch
                style={{ width: 160, marginRight: 8 }}
                placeholder="渠道"
                onChange={(value) => this.handleSearch(value,'channel_name')}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                { CHANNELS.map(item => <Option key={item.id} value={item.name}>{item.name}</Option>) }
              </Select>
              <Search
                style={{ width: 260, float: 'right' }}
                placeholder="ID／名称／商家标签"
                onChange={this.handleSearchChange}
                onSearch={(value) => this.handleSearch(value, 'search')}
                enterButton
              />
              <RangePicker style={{ width: 240 }} onChange={(value) => this.handleSearch(value,'time')} />
              <Tooltip placement="top" title="发布到淘宝时间">
                <Icon type="question-circle-o" style={{ marginLeft: 8 }} />
              </Tooltip>
            </div>
            <Table
              scroll={{ x: 1300 }}
              loading={loading}
              dataSource={teamTask.list}
              columns={columns}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                ...teamTask.pagination,
              }}
              rowSelection={rowSelection}
              onChange={this.handleStandardTableChange}
              rowKey="_id"
            />
            <DockPanel />
          </div>
        </Card>
      </div>
    );
  }
}
