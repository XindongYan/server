import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Input, Select, Icon, Button, Menu, Checkbox, message, Radio, Popconfirm, DatePicker,
Tooltip, Divider, Form, Modal } from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';
import { RIGHTS, APPROVE_ROLES, ROLES, TASK_APPROVE_STATUS, CHANNEL_NAMES, ORIGIN, RIGHT } from '../../constants';
import TaskNameColumn from '../../components/TaskNameColumn';
import TaskStatusColumn from '../../components/TaskStatusColumn';
import DockPanel from '../../components/DockPanel';
import styles from './TableList.less';

const { RangePicker } = DatePicker;
const Search = Input.Search;
const { Option } = Select;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
function onChange(date, dateString) {
  console.log(date, dateString);
}
@connect(state => ({
  data: state.task.approverTask,
  loading: state.task.approverTaskLoading,
  currentUser: state.user.currentUser,
  teamUser: state.user.teamUser,
  teamUsers: state.team.data.list,
  suggestionUsers: state.team.suggestionUsers,
}))
@Form.create()

export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    selectedRowKeys: [],
    user_id: '',
    darenModalVisible: false,
  };

  componentDidMount() {
    const { dispatch, data: { pagination, approve_status }, currentUser, teamUser } = this.props;
    if (currentUser._id) {
      dispatch({
        type: 'task/fetchApproverTasks',
        payload: { ...pagination, approve_status, user_id: currentUser._id }
      });
    }
    if (teamUser.team_id) {
      if (currentUser.rights.indexOf(RIGHT.teamAdmin) >= 0) {
        dispatch({
          type: 'team/fetch',
          payload: {
            team_id: teamUser.team_id,
            currentPage: 1,
            pageSize: 99999999,
          },
        });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, data: { pagination, approve_status }, currentUser, teamUser } = nextProps;
    if (currentUser._id !== this.props.currentUser._id) {
      dispatch({
        type: 'task/fetchApproverTasks',
        payload: { ...pagination, approve_status, user_id: currentUser._id }
      });
    }
    if (teamUser.team_id !== this.props.teamUser.team_id) {
      if (currentUser.rights.indexOf(RIGHT.teamAdmin) >= 0) {
        dispatch({
          type: 'team/fetch',
          payload: {
            team_id: teamUser.team_id,
            currentPage: 1,
            pageSize: 99999999,
          },
        });
      }
    }
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, currentUser, data: { approve_status } } = this.props;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      user_id: this.state.user_id || currentUser._id,
      approve_status,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'task/fetchApproverTasks',
      payload: params,
    });
  }
  handleSelectTeamUser = (value) => {
    this.setState({ user_id: value });
    const { data: { pagination, approve_status }, dispatch } = this.props;
    dispatch({
      type: 'task/fetchApproverTasks',
      payload: { ...pagination, user_id: value, approve_status }
    });
  }
  handleChangeTeamUser = (value) => {
    if (!value) {
      this.setState({ user_id: '' });
      const { data: { pagination, approve_status }, dispatch, currentUser } = this.props;
      dispatch({
        type: 'task/fetchApproverTasks',
        payload: { ...pagination, user_id: currentUser._id, approve_status }
      });
    }
  }
  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  }
  handleSearch = (value, name) => {
    const { dispatch, data: { pagination, approve_status }, currentUser } = this.props;
    const values = {
      user_id: this.state.user_id || currentUser._id,
      approve_status,
    };
    if(name === 'time') {
      values['handin_time_start'] = value[0] ? value[0].format('YYYY-MM-DD 00:00:00') : '';
      values['handin_time_end'] = value[1] ? value[1].format('YYYY-MM-DD 23:59:59') : '';
    } else {
      values[name] = value;
    }
    dispatch({
      type: 'task/fetchApproverTasks',
      payload: { 
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
        ...values, 
      }
    });
  }

  handleReject = (record) => {
    const { dispatch, data: { pagination, approve_status }, currentUser } = this.props;
    dispatch({
      type: 'task/reject',
      payload: { _id: record._id, approver_id: currentUser._id },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          message.success(result.msg);
          dispatch({
            type: 'task/fetchApproverTasks',
            payload: { ...pagination, approve_status, user_id: this.state.user_id || currentUser._id }
          });
        }
      },
    }); 
  }
  changeApproveStatus = (e) => {
    const { data: { pagination }, dispatch, currentUser } = this.props;
    dispatch({
      type: 'task/fetchApproverTasks',
      payload: { ...pagination, user_id: this.state.user_id || currentUser._id, approve_status: e.target.value, }
    });
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

  handleDarenModalVisible = (flag) => {
    this.setState({
      darenModalVisible: !!flag,
    });
  }
  handleSpecifyDaren = () => {
    const { dispatch, currentUser, data: { pagination, approve_status } } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err && values.target_user_id.length >= 24) {
        dispatch({
          type: 'project/darenTasks',
          payload: {
            task_ids: this.state.selectedRowKeys,
            user_id: currentUser._id,
            target_user_id: values.target_user_id,
          },
          callback: (result) => {
            if (result.error) {
              message.error(result.msg);
            } else {
              message.success(result.msg);
              this.handleDarenModalVisible(false);
              dispatch({
                type: 'task/fetchApproverTasks',
                payload: { ...pagination, approve_status, user_id: currentUser._id }
              });
              this.handleRowSelectChange([], []);
            }
          },
        });
      } else {
        message.warn('请选择达人！');
      }
    });
  }
  handleSearchDaren = (value) => {
    if (value) {
      this.props.dispatch({
        type: 'team/searchUsers',
        payload: {
          nickname: value
        }
      });
    }
  }
  render() {
    const { data, loading, currentUser, teamUsers, form: { getFieldDecorator }, suggestionUsers } = this.props;
    const { selectedRows, modalVisible, selectedRowKeys, darenModalVisible } = this.state;
    const columns = [
      {
        title: '任务ID',
        width: 80,
        dataIndex: 'id',
        render: (val, record) => <a onClick={() => this.handleShowDockPanel(record, 'DetailPane')}>{val}</a>,
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: 200,
        render: (record, task) => (
          <Link to={`/project/task/view?_id=${task._id}`}>
            <TaskNameColumn text={record} length={10} />
          </Link>
        )
      },
      {
        title: '提交时间',
        dataIndex: 'handin_time',
        render: val => ( 
          val ?
          <Tooltip placement="top" title={moment(val).format('YYYY-MM-DD HH:mm:ss')}>
            {moment(val).fromNow()}
          </Tooltip> : ''
        ),
      },
      {
        title: '修改',
        dataIndex: 'update_times',
      },
      {
        title: '写手',
        dataIndex: 'taker_id',
        render: val => val ? val.nickname : '',
      },
      {
        title: '发布渠道',
        dataIndex: 'channel_name',
        render: val => val || '',
      },
      {
        title: '商家标签',
        dataIndex: 'merchant_tag',
        render: val => val ? <TaskNameColumn text={val} length={10}/> : '',
      },
    ];
    const approver = {
      title: '审核人',
      dataIndex: 'approver_id',
      render: value => value ? value.nickname : '',
    }
    const grade = {
      title: '审核分数',
      dataIndex: 'grade',
      render: value => value < 0 ? 0 : value,
    }
    const approveTime = {
      title: '审核时间',
      dataIndex: 'approve_time',
      render: val => (
        <Tooltip placement="top" title={moment(val).format('YYYY-MM-DD HH:mm:ss')}>
          {moment(val).format('MM/DD')}
        </Tooltip>
      ),
    }
    const opera = {
      title: '操作',
      render: (record) => {
        if (record.approve_status === TASK_APPROVE_STATUS.waitingForApprove) {
          if (!record.current_approvers || record.current_approvers.length === 0 || record.current_approvers.indexOf(currentUser._id) >= 0) {
            return (
              <div>
                <a target="_blank" href={`${ORIGIN}/public/task/details?id=${record._id}&channel_name=${record.channel_name}`}>
                  外链
                </a>
                <Divider type="vertical" />
                <Link to={`/approver/task/edit?_id=${record._id}`}>
                  <span>审核</span>
                </Link>
                { record.approve_step === 0 && <span className={styles.splitLine} /> }
                { record.approve_step === 0 && <Popconfirm placement="left" title={`确认退回?`} onConfirm={() => this.handleReject(record)} okText="确认" cancelText="取消">
                  <a>退回</a>
                </Popconfirm> }
              </div>
            );
          } else {
            return (
              <div>
                <a target="_blank" href={`${ORIGIN}/public/task/details?id=${record._id}&channel_name=${record.channel_name}`}>
                  外链
                </a>
                <Divider type="vertical" />
                <Link to={`/approver/task/view?_id=${record._id}`}>
                  <span>详情</span>
                </Link>
              </div>
            );
          }
        } else if(record.approve_status === TASK_APPROVE_STATUS.passed) {
          return (
            <div>
              <a target="_blank" href={`${ORIGIN}/public/task/details?id=${record._id}&channel_name=${record.channel_name}`}>
                外链
              </a>
              <Divider type="vertical" />
              <Link to={`/approver/task/edit?_id=${record._id}`}>
                <span>详情</span>
              </Link>
            </div>
          );
        } else if(record.approve_status === TASK_APPROVE_STATUS.rejected) {
          return (
            <div>
              <a target="_blank" href={`${ORIGIN}/public/task/details?id=${record._id}&channel_name=${record.channel_name}`}>
                外链
              </a>
              <Divider type="vertical" />
              <Link to={`/approver/task/view?_id=${record._id}`}>
                <span>详情</span>
              </Link>
            </div>
          );
        }
      },
    }
    const operaAdmin = {
      title: '操作',
      render: (record) => {
        if (record.approve_status === TASK_APPROVE_STATUS.waitingForApprove) {
          if (!record.current_approvers || record.current_approvers.length === 0 || record.current_approvers.indexOf(currentUser._id) >= 0) {
            return (
              <div>
                <a target="_blank" href={`${ORIGIN}/public/task/details?id=${record._id}&channel_name=${record.channel_name}`}>
                  外链
                </a>
              </div>
            );
          } else {
            return (
              <div>
                <a target="_blank" href={`${ORIGIN}/public/task/details?id=${record._id}&channel_name=${record.channel_name}`}>
                  外链
                </a>
                <Divider type="vertical" />
                <Link to={`/approver/task/view?_id=${record._id}`}>
                  <span>详情</span>
                </Link>
              </div>
            );
          }
        } else if(record.approve_status === TASK_APPROVE_STATUS.passed) {
          return (
            <div>
              <a target="_blank" href={`${ORIGIN}/public/task/details?id=${record._id}&channel_name=${record.channel_name}`}>
                外链
              </a>
              <Divider type="vertical" />
              <Link to={`/approver/task/view?_id=${record._id}`}>
                <span>详情</span>
              </Link>
            </div>
          );
        } else if(record.approve_status === TASK_APPROVE_STATUS.rejected) {
          return (
            <div>
              <a target="_blank" href={`${ORIGIN}/public/task/details?id=${record._id}&channel_name=${record.channel_name}`}>
                外链
              </a>
              <Divider type="vertical" />
              <Link to={`/approver/task/view?_id=${record._id}`}>
                <span>详情</span>
              </Link>
            </div>
          );
        }
      },
    }
    if (!this.state.user_id) {
      if (data.approve_status === 'waitingForApprove' || data.approve_status === 'approving'){
        columns.push(opera)
      } else {
        columns.push(approver, grade, approveTime, opera)
      }
    } else {
      if (data.approve_status === 'waitingForApprove' || data.approve_status === 'approving'){
        columns.push(operaAdmin)
      } else {
        columns.push(approver, grade, approveTime, operaAdmin)
      }
    }
    
    const rowSelection = data.approve_status === 'passed' ? {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    } : null;
    return (
      <div>
        <div className={styles.searchBox}>
          <RadioGroup value={data.approve_status} onChange={this.changeApproveStatus}>
            <RadioButton value="all">全部</RadioButton>
            <RadioButton value="waitingForApprove">待审核</RadioButton>
            <RadioButton value="approving">审核中</RadioButton>
            <RadioButton value="rejected">未通过</RadioButton>
            <RadioButton value="passed">已通过</RadioButton>
          </RadioGroup>
          {currentUser.rights && currentUser.rights.indexOf(RIGHT.teamAdmin) >= 0 &&
            <Select
              style={{ width: '30%', marginLeft: 20 }}
              mode="combobox"
              optionLabelProp="children"
              placeholder="搜索审核人员"
              notFoundContent=""
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              allowClear
              onChange={this.handleChangeTeamUser}
              onSelect={this.handleSelectTeamUser}
            >
              {teamUsers.filter(item => item.user_id && item.user_id.rights.indexOf(RIGHT.approver) >= 0)
                .map(item => <Option value={item.user_id._id} key={item.user_id._id}>{item.user_id.nickname}</Option>)}
            </Select>
          }
        </div>
        <Card bordered={false} bodyStyle={{ padding: 14 }}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Select
                allowClear
                showSearch
                style={{ width: 160, marginRight: 8 }}
                placeholder="渠道"
                onChange={(value) => this.handleSearch(value,'channel_name')}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                { CHANNEL_NAMES.map(item => <Option key={item} value={item}>{item}</Option>) }
              </Select>
              <RangePicker style={{ width: 240 }} onChange={(value) => this.handleSearch(value,'time')} />
              <Search
                style={{ width: 260, float: 'right'}}
                placeholder="ID／名称／商家标签"
                onSearch={(value) => this.handleSearch(value, 'search')}
                enterButton
              />
              { selectedRows.length > 0 && (
                  <span>
                    <Button icon="user-add" type="default" onClick={() => this.handleDarenModalVisible(true)}>指定达人</Button>
                  </span>
                )
              }
            </div>
            <Table
              loading={loading}
              rowKey={record => record.key}
              dataSource={data.list}
              columns={columns}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                ...data.pagination,
              }}
              onChange={this.handleStandardTableChange}
              rowKey="_id"
              rowSelection={rowSelection}
            />
            { darenModalVisible && <Modal
                title="指定达人"
                visible={darenModalVisible}
                onOk={this.handleSpecifyDaren}
                onCancel={() => this.handleDarenModalVisible(false)}
              >
                <FormItem
                  label="达人"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                >
                  {getFieldDecorator('target_user_id', {
                    initialValue: '',
                    rules: [{ required: true, message: '请选择达人！' }],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      mode="combobox"
                      optionLabelProp="children"
                      placeholder="搜索昵称指定达人"
                      notFoundContent=""
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      filterOption={false}
                      onSearch={this.handleSearchDaren}
                    >
                      {suggestionUsers.map(item => <Option value={item._id} key={item._id}>{item.nickname}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Modal>}
            <DockPanel />
          </div>
        </Card>
      </div>
    );
  }
}
