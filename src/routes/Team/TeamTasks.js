import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Table, Card, Button, Input, DatePicker, Form, Popconfirm, Modal, Select,
Popover, Dropdown, Icon, message, Radio, Tooltip } from 'antd';
import { TASK_APPROVE_STATUS, APPROVE_FLOWS, APPROVE_ROLES } from '../../constants';
import DockPanel from '../../components/DockPanel';
import TaskNameColumn from '../../components/TaskNameColumn';
import TrimSpan from '../../components/TrimSpan';
import TaskStatusColumn from '../../components/TaskStatusColumn';
import DateTimeColumn from '../../components/DateTimeColumn';
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
    selectedRows: [],
    selectedRowKeys: [],
    search: '',
    create_time_start: null,
    create_time_end: null,
  }

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
    const { search, create_time_start, create_time_end } = this.state;
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
      search, create_time_start, create_time_end,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'task/fetchTeamTasks',
      payload: params,
    });
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  }
  
  handleSearch = (value, name) => {
    const { dispatch, teamTask: { pagination, approve_status }, teamUser: { team_id } } = this.props;
    const { search, create_time_start, create_time_end } = this.state;
    const values = {
      search, create_time_start, create_time_end,
      approve_status,
      team_id,
      ...pagination,
      currentPage: 1,
    };
    if(name === 'time') {
      values['create_time_start'] = value[0] ? value[0].format('YYYY-MM-DD 00:00:00') : '';
      values['create_time_end'] = value[1] ? value[1].format('YYYY-MM-DD 23:59:59') : '';
      if (value && value[0]) {
        this.setState({ create_time_start: value[0].format('YYYY-MM-DD 00:00:00'), create_time_end: value[1].format('YYYY-MM-DD 23:59:59') });
      } else {
        this.setState({ create_time_start: null, create_time_end: null });
      }
    } else {
      values[name] = value;
      this.setState({ [name]: value });
    }
    dispatch({
      type: 'task/fetchTeamTasks',
      payload: values,
    });
  }

  changeApproveStatus = (e) => {
    const { dispatch, teamTask, teamUser: { team_id } } = this.props;
    const { search, create_time_start, create_time_end } = this.state;
    dispatch({
      type: 'task/fetchTeamTasks',
      payload: { team_id, approve_status: e.target.value, search, create_time_start, create_time_end },
    });
  }
  handleSearchChange = (e) => {
    if (e.target.value.length === 0) {
      this.handleSearch(e.target.value, 'search');
    }
    this.setState({ search: e.target.value });
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
    const { selectedRows, selectedRowKeys } = this.state;
    const flow = APPROVE_FLOWS.find(item => item.value === formData.approve_flow);

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
        render: (val) => <DateTimeColumn value={val} />,
      },
      {
        title: '渠道',
        dataIndex: 'channel_name',
      },
      {
        title: '商家名称',
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
        render: (val) => <DateTimeColumn value={val} />,
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
      render: (val) => <DateTimeColumn value={val} />,
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
                placeholder="ID／名称／商家名称"
                value={this.state.search}
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
