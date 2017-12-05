import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, Checkbox, Modal, message, Radio, Popconfirm, DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { RIGHTS, APPROVE_ROLES, ROLES, TASK_APPROVE_STATUS, CHANNEL_NAMES } from '../../constants';
import TaskNameColumn from '../../components/TaskNameColumn';
import TaskStatusColumn from '../../components/TaskStatusColumn';
import { Link } from 'dva/router';
import moment from 'moment';
import styles from './TableList.less';

const { RangePicker } = DatePicker;
const Search = Input.Search;
const FormItem = Form.Item;
const { Option } = Select;
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
  projects: state.project.data,
  teamUser: state.user.teamUser,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    selectedRowKeys: [],
    formValues: { approve_status: TASK_APPROVE_STATUS.waitingForApprove },
    user: {},
  };

  componentDidMount() {
    const { dispatch, data: { pagination }, currentUser, teamUser } = this.props;
    if (currentUser._id) {
      dispatch({
        type: 'task/fetchApproverTasks',
        payload: { ...pagination, ...this.state.formValues, user_id: currentUser._id }
      });
    }
    if (teamUser.team_id) {
      dispatch({
        type: 'project/fetch',
        payload: {
          team_id: teamUser.team_id,
        },
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, data: { pagination }, currentUser, teamUser } = nextProps;
    if (currentUser._id !== this.props.currentUser._id) {
      dispatch({
        type: 'task/fetchApproverTasks',
        payload: { ...pagination, ...this.state.formValues, user_id: currentUser._id }
      });
    }
    if (teamUser.team_id !== this.props.teamUser.team_id) {
      dispatch({
        type: 'project/fetch',
        payload: {
          team_id: teamUser.team_id,
        },
      });
    }
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, currentUser } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      user_id: currentUser._id,
      ...formValues,
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

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {

    this.setState({ selectedRowKeys, selectedRows });
  }
  handleSearch = (value, name) => {
    const { dispatch, data: { pagination }, currentUser } = this.props;
    const { formValues } = this.state;
    const values = {
      user_id: currentUser._id,
      ...formValues,
    };
    if(name === 'time') {
      values['handin_time_start'] = value[0] ? value[0].format('YYYY-MM-DD 00:00:00') : '';
      values['handin_time_end'] = value[1] ? value[1].format('YYYY-MM-DD 23:59:59') : '';
    } else {
      values[name] = value;
    }
    this.setState({
      formValues: values,
    });
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
    const { dispatch, data: { pagination }, currentUser } = this.props;
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
            payload: { ...pagination, ...this.state.formValues, user_id: currentUser._id }
          });
        }
      },
    }); 
  }
  changeApproveStatus = (e) => {
    const { data: { pagination }, dispatch, currentUser } = this.props;
    dispatch({
      type: 'task/fetchApproverTasks',
      payload: { ...pagination, ...this.state.formValues, user_id: currentUser._id, approve_status: e.target.value, }
    });
    this.setState({
      formValues: { ...this.state.formValues, user_id: currentUser._id, approve_status: e.target.value, }
    });
  }
  render() {
    const { data, loading, currentUser, projects: { list } } = this.props;
    const { selectedRows, modalVisible, formValues, selectedRowKeys } = this.state;
    const columns = [
      {
        title: '稿子ID',
        dataIndex: 'id',
      },
      {
        title: '任务名称',
        dataIndex: 'name',
        width: 200,
        render: (record) => (
          <Link to="http://120.27.215.205/">
            <TaskNameColumn text={record} length={10}/>
          </Link>
        )
      },
      {
        title: '提交时间',
        dataIndex: 'handin_time',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '修改',
        dataIndex: 'update_times',
      },
      {
        title: '写手',
        dataIndex: 'publisher_id',
        render: val => val ? val.name : '',
      },
      {
        title: '发布渠道',
        dataIndex: 'channel_name',
        render: val => val || '',
      },
      {
        title: '商家标签',
        dataIndex: 'merchant_tag',
        render: val => val ? val : '',
      },
      {
        title: '审核状态',
        dataIndex: 'approve_status',
        render: val => (<TaskStatusColumn status={val}/>),
      },
    ];
    const approver = {
      title: '审核人',
      dataIndex: 'approver_id',
      render: value => value ? value.name : '',
    }
    const grade = {
      title: '审核分数',
      dataIndex: 'grade',
      render: value => value < 0 ? 0 : value,
    }
    const approveTime = {
      title: '审核时间',
      dataIndex: 'approve_time',
      render: value => <span>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</span>,
    }
    const opera = {
      title: '操作',
      render: (record) => {
        if (record.approve_status === TASK_APPROVE_STATUS.waitingForApprove) {
          if (!record.current_approvers || record.current_approvers.length === 0 || record.current_approvers.indexOf(currentUser._id) >= 0) {
            return (
              <div>
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
              <Link to={`/approver/task/view?_id=${record._id}`}>
                <span>详情</span>
              </Link>
            );
          }
        } else if(record.approve_status === TASK_APPROVE_STATUS.passed) {
          return (
            <Link to={`/approver/task/edit?_id=${record._id}`}>
              <span>详情</span>
            </Link>
          );
        } else if(record.approve_status === TASK_APPROVE_STATUS.rejected) {
          return (
            <Link to={`/approver/task/view?_id=${record._id}`}>
              <span>详情</span>
            </Link>
          );
        }
      },
    }
    if (formValues.approve_status === 0){
      columns.push(opera)
    } else {
      columns.push( approver, grade, approveTime, opera)
    }
    return (
      <PageHeaderLayout title="">
	      <div className={styles.searchBox}>
          <RadioGroup value={formValues.approve_status} onChange={this.changeApproveStatus}> 
            <RadioButton value={TASK_APPROVE_STATUS.waitingForApprove}>待审核</RadioButton>
            <RadioButton value={TASK_APPROVE_STATUS.passed}>已通过</RadioButton>
            <RadioButton value={TASK_APPROVE_STATUS.rejected}>未通过</RadioButton>
          </RadioGroup>
        </div>
        <Card bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Select
                showSearch
                allowClear
                style={{ width: 160, marginRight: 8 }}
                placeholder="活动"
                optionFilterProp="children"
                onChange={(value) => this.handleSearch(value,'project_id')}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                { list && list.length > 0 &&
                  list.map(item => <Option key={item._id} value={item._id}>{item.name}</Option>)
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
                { CHANNEL_NAMES.map(item => <Option key={item} value={item}>{item}</Option>) }
              </Select>
              <RangePicker style={{ width: 240 }} onChange={(value) => this.handleSearch(value,'time')} />
              <Search
                style={{ width: 260 }}
                placeholder="任务名称／商家标签"
                onSearch={(value) => this.handleSearch(value, 'search')}
                enterButton
              />
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
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
