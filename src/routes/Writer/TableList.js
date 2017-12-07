import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Radio, Input, DatePicker } from 'antd';
import moment from 'moment';
import { Link } from 'dva/router';
import TaskNameColumn from '../../components/TaskNameColumn';
import TaskStatusColumn from '../../components/TaskStatusColumn';
import { TASK_APPROVE_STATUS, ORIGIN } from '../../constants';
import styles from './TableList.less';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const Search = Input.Search;

@connect(state => ({
  data: state.task.approverTask,
  takerTask: state.task.takerTask,
  loading: state.task.takerTaskLoading,
  currentUser: state.user.currentUser,
}))
export default class TableList extends PureComponent {
  state = {
    formValues: { approve_status: TASK_APPROVE_STATUS.taken },
  }

  componentDidMount() {
    const { dispatch, currentUser } = this.props;
    if (currentUser._id) {
      dispatch({
        type: 'task/fetchTakerTasks',
        payload: { ...this.state.formValues, user_id: currentUser._id },
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { dispatch, currentUser } = nextProps;
    if (currentUser._id !== this.props.currentUser._id) {
      dispatch({
        type: 'task/fetchTakerTasks',
        payload: { ...this.state.formValues, user_id: currentUser._id },
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
      type: 'task/fetchTakerTasks',
      payload: params,
    });
  }

  handleSearch = (value, name) => {
    const { dispatch, data: { pagination }, currentUser } = this.props;
    const { formValues } = this.state;
    const values = {
      user_id: currentUser._id,
      ...formValues,
    };
    if(name === 'time') {
      values['take_time_start'] = value[0] ? value[0].format('YYYY-MM-DD 00:00:00') : '';
      values['take_time_end'] = value[1] ? value[1].format('YYYY-MM-DD 23:59:59') : '';
    } else {
      values[name] = value;
    }
    this.setState({
      formValues: values,
    });
    dispatch({
      type: 'task/fetchApproverTasks',
      payload: {
        currentPage: 1,
        pageSize: pagination.pageSize,
        ...values, 
      }
    });
  }

  changeApproveStatus = (e) => {
    const { dispatch, currentUser } = this.props;
    dispatch({
      type: 'task/fetchTakerTasks',
      payload: { user_id: currentUser._id, approve_status: e.target.value, }
    });
    this.setState({
      formValues: { ...this.state.formValues, user_id: currentUser._id, approve_status: e.target.value, }
    });
  }
  render() {
    const { takerTask, loading } = this.props;
    const { formValues } = this.state;
    const columns = [
      {
        title: '任务ID',
        dataIndex: 'id',
      },
      {
        title: '任务名称',
        dataIndex: 'name',
        render: (record, task) => (
          <a href={`${ORIGIN}/public/task/details?id=${task._id}`}>
            <TaskNameColumn text={record} length={10} />
          </a>
        ),
      },
      {
        title: '接单时间',
        dataIndex: 'take_time',
        sorter: true,
        render: val => (<span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>),
      },
      {
        title: '发布渠道',
        dataIndex: 'channel_name',
        render: val => val || '',
      },
      {
        title: '商家标签',
        dataIndex: 'merchant_tag',
      },
    ];
    const approveStatus = {
      title: '审核状态',
      dataIndex: 'approve_status',
      render: val => (<TaskStatusColumn status={val} />),
    };
    const approver = {
      title: '审核人',
      dataIndex: 'approver_id',
      render: value => value ? value.name : '',
    };
    const grade = {
      title: '审核分数',
      dataIndex: 'grade',
      render: value => value < 0 ? 0 : value,
    };
    const approveTime = {
      title: '审核时间',
      dataIndex: 'approve_time',
      render: value => <span>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</span>,
    };
    const opera = {
      title: '操作',
      render: (record) => {
        if (record.approve_status === TASK_APPROVE_STATUS.taken || record.approve_status === TASK_APPROVE_STATUS.rejected) {
          return (
            <Link to={`/writer/task/edit?_id=${record._id}`}>
              <span>编辑</span>
            </Link>
          );
        } else if (record.approve_status === TASK_APPROVE_STATUS.waitingForApprove) {
          return (
            <div>
              <Link to={`/writer/task/view?_id=${record._id}`}>
                <span>查看</span>
              </Link>
            </div>
          );
        } else if (record.approve_status === TASK_APPROVE_STATUS.passed) {
          return (
            <Link to={`/writer/task/view?_id=${record._id}`}>
              <span>查看</span>
            </Link>
          );
        }
      }
    };
    if (formValues.approve_status === -1) {
      columns.push(opera);
    } else if (formValues.approve_status === 0) {
      columns.push( approveStatus, opera);
    } else {
      columns.push( approveStatus, approver, grade, approveTime, opera);
    }
    return (
      <div>
        <div className={styles.searchBox}>
          <RadioGroup value={formValues.approve_status} onChange={this.changeApproveStatus}>
            <RadioButton value={TASK_APPROVE_STATUS.taken}>待完成</RadioButton>
            <RadioButton value={TASK_APPROVE_STATUS.waitingForApprove}>待审核</RadioButton>
            <RadioButton value={TASK_APPROVE_STATUS.passed}>已通过</RadioButton>
            <RadioButton value={TASK_APPROVE_STATUS.rejected}>未通过</RadioButton>
          </RadioGroup>
        </div>
        <Card bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
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
              dataSource={takerTask.list}
              columns={columns}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                ...takerTask.pagination,
              }}
              onChange={this.handleStandardTableChange}
              rowKey="_id"
            />
          </div>
        </Card>
      </div>
    );
  }
}
