import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import querystring from 'querystring';
import { Table, Card, Button, Input, DatePicker, Form, Menu, Checkbox, Popconfirm, Modal, Select, Row, Col,
Popover, Dropdown, Icon, message, Radio, Tooltip } from 'antd';
import { Link } from 'dva/router';
import { TASK_APPROVE_STATUS, APPROVE_FLOWS, APPROVE_ROLES } from '../../constants';
import DockPanel from '../../components/DockPanel';
import TaskNameColumn from '../../components/TaskNameColumn';
import TrimSpan from '../../components/TrimSpan';
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
export default class TeamTasks extends PureComponent {
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
  }
  componentWillReceiveProps(nextProps) {
    const { dispatch, teamUser, teamTask: { pagination, approve_status }, teamUser: { team_id } } = nextProps;
    if (teamUser.team_id !== this.props.teamUser.team_id) {
      dispatch({
        type: 'task/fetchTeamTasks',
        payload: { ...pagination, approve_status, team_id },
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
    const flow = APPROVE_FLOWS.find(item => item.value === formData.approve_flow);
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const columns = [
      {
        title: '任务ID',
        dataIndex: 'id',
        width: 80,
        fixed: 'left',
        render: (val, record) => <a onClick={() => this.handleShowDockPanel(record, 'DetailPane')}>{val}</a>,
      },
      {
        title: '名称',
        dataIndex: 'name',
        render: (val, record) => (
          <a target="_blank" href={record.taobao && record.taobao.url ? record.taobao.url : `/task/detail.html?_id=${record._id}`}>
            <TaskNameColumn text={val} length={10} />
          </a>
        )
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
      },
      {
        title: '渠道',
        dataIndex: 'channel_name',
      },
      {
        title: '商家标签',
        dataIndex: 'merchant_tag',
        render: (val) => (
          <TrimSpan text={val} length={10} />
        )
      },
      {
        title: '接单人',
        dataIndex: 'taker_id',
        render: (val) => val ? val.nickname : '',
      },
      {
        title: '接单时间',
        dataIndex: 'take_time',
        render: val => val ? <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span> : '',
      },
    ];
    const status = {
      title: '状态',
      dataIndex: 'approve_status',
      render: val => (<TaskStatusColumn status={val}/>),
    };
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
    const daren_nickname = {
      title: '发布人',
      dataIndex: 'daren_id',
      width: 80,
      render: val => val ? val.nickname : '',
    };
    const pushTime = {
      title: '发布时间',
      dataIndex: 'publish_taobao_time',
      render: val => ( 
        val ?
        <Tooltip placement="top" title={moment(val).format('YYYY-MM-DD HH:mm:ss')}>
          {moment(val).fromNow()}
        </Tooltip> : ''
      ),
    };
    const pushStatusText = {
      title: '推送状态',
      dataIndex: 'taobao.pushStatusText',
      render: val => {
        let pushStatusTextTags = '';
        if (val) {
          pushStatusTextTags = val.map((item, index) => <p key={index}>{item}</p>);
        }
        return <span>{pushStatusTextTags}</span>
      },
    };
    const recruitColumn = {
      title: '投稿状态',
      dataIndex: 'taobao.recruitFail',
      render: (val, record) => {
        if (record.taobao.recruitStatusDesc) {
          let color = '';
          if (record.taobao.recruitStatusDesc === '审核中') {
            color = 'rgb(252, 166, 28)';
          } else if (record.taobao.recruitStatusDesc === '审核通过') {
            color = 'rgb(74, 190, 90)';
          } else if (record.taobao.recruitStatusDesc === '审核不通过') {
            color = 'rgb(248, 109, 109)';
          }
          return (
            <div>
              <div>{record.taobao.recruitTitle ? `已投${record.taobao.recruitTitle}` : ''}</div>
              <div><span style={{ color, marginRight: 5 }}>{record.taobao.recruitStatusDesc}</span>
              {record.taobao.recruitStatusDesc === '审核不通过' ?
                <Popover placement="top" content={record.taobao.recruitFailMessage} trigger="hover">
                  <Icon type="question-circle-o" />
                </Popover>: ''}
              </div>
            </div>
          );
        } else {
          return '';
        }
      },
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    if (teamTask.approve_status === TASK_APPROVE_STATUS.all) {
      columns.push(status);
    } else if (teamTask.approve_status === TASK_APPROVE_STATUS.publishedToTaobao || teamTask.approve_status === TASK_APPROVE_STATUS.taobaoRejected || teamTask.approve_status === TASK_APPROVE_STATUS.taobaoAccepted) {
      columns.push(daren_nickname, pushTime, pushStatusText, recruitColumn);
    }
    columns.push(opera);
    return (
      <div>
        <RadioGroup value={teamTask.approve_status} style={{ marginBottom: 12 }} onChange={this.changeApproveStatus}>
          <RadioButton value={TASK_APPROVE_STATUS.all}>全部</RadioButton>
          <RadioButton value={TASK_APPROVE_STATUS.created}>已创建</RadioButton>
          <RadioButton value={TASK_APPROVE_STATUS.published}>已上架</RadioButton>
          <RadioButton value={TASK_APPROVE_STATUS.taken}>待完成</RadioButton>
          <RadioButton value={TASK_APPROVE_STATUS.waitingForApprove}>待审核</RadioButton>
          <RadioButton value={TASK_APPROVE_STATUS.rejected}>未通过</RadioButton>
          <RadioButton value={TASK_APPROVE_STATUS.passed}>已通过</RadioButton>
          <Tooltip placement="top" title="待发布至阿里创作平台">
            <RadioButton value={TASK_APPROVE_STATUS.waitingToTaobao}>
              待发布
            </RadioButton>
          </Tooltip>
          <Tooltip placement="top" title="已发布至阿里创作平台">
            <RadioButton value={TASK_APPROVE_STATUS.publishedToTaobao}>
              已发布
            </RadioButton>
          </Tooltip>
          <Tooltip placement="top" title="阿里创作平台不通过">
            <RadioButton value={TASK_APPROVE_STATUS.taobaoRejected}>
              淘宝不通过
            </RadioButton>
          </Tooltip>
          <Tooltip placement="top" title="阿里创作平台通过">
            <RadioButton value={TASK_APPROVE_STATUS.taobaoAccepted}>
              淘宝通过
            </RadioButton>
          </Tooltip>
        </RadioGroup>
        <Card bordered={false} bodyStyle={{ padding: 14 }}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <RangePicker style={{ width: 240 }} onChange={(value) => this.handleSearch(value,'time')} />
              <Tooltip placement="top" title="创建时间">
                <Icon type="question-circle-o" style={{ marginLeft: 8 }} />
              </Tooltip>
              <Search
                style={{ width: 260, float: 'right' }}
                placeholder="ID／名称／商家标签"
                onChange={this.handleSearchChange}
                onSearch={(value) => this.handleSearch(value, 'search')}
                enterButton
              />
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
