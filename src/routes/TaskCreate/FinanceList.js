import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import querystring from 'querystring';
import { Table, Card, Button, Input, Form, Menu, Modal, Icon, message, Radio, Popconfirm, DatePicker } from 'antd';
import TaskNameColumn from '../../components/TaskNameColumn';
import TaskStatusColumn from '../../components/TaskStatusColumn';
import DockPanel from '../../components/DockPanel';
import { Link } from 'dva/router';
import { TASK_APPROVE_STATUS } from '../../constants';
import styles from './TableList.less';

const RadioButton = Radio.Button;
const { RangePicker } = DatePicker;
const Search = Input.Search;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@connect(state => ({
  projectFinanceTask: state.task.projectFinanceTask,
  loading: state.task.projectFinanceTaskLoading,
  currentUser: state.user.currentUser,
}))
export default class FinanceList extends PureComponent {
  state = {
    modalVisible: false,
  }

  componentDidMount() {
    const { dispatch, teamUser, projectFinanceTask: { pagination } } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    dispatch({
      type: 'task/fetchProjectFinanceTasks',
      payload: { ...pagination, project_id: query.project_id },
    });
  }
  componentWillReceiveProps(nextProps) {
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
  handleSearch = (value, name) => {
    const { dispatch, projectFinanceTask: { pagination } } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    const values = {
      project_id: query.project_id,
      ...pagination,
    };
    if(name === 'time') {
      values['create_time_start'] = value[0] ? value[0].format('YYYY-MM-DD 00:00:00') : '';
      values['create_time_end'] = value[1] ? value[1].format('YYYY-MM-DD 23:59:59') : '';
    } else {
      values[name] = value;
    }
    dispatch({
      type: 'task/fetchProjectFinanceTasks',
      payload: {
        currentPage: 1,
        ...values, 
      }
    });
  }
  handlePayoff = (record) => {
    const { currentUser, projectFinanceTask: { pagination } } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch({
      type: 'task/payoff',
      payload: {
        _id: record._id,
        user_id: currentUser._id,
        payoff_type: '支付宝',
      },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          message.success(result.msg);
          this.props.dispatch({
            type: 'task/fetchProjectFinanceTasks',
            payload: { ...pagination, project_id: query.project_id },
          });
        }
      },
    });
  }

  render() {
    const { projectFinanceTask, loading, } = this.props;
    const { selectedRows, modalVisible, selectedRowKeys, darenModalVisible, activeKey } = this.state;

    const columns = [
      {
        title: '任务ID',
        width: 80,
        dataIndex: 'id',
        render: (val, record) => <a onClick={() => this.handleShowDockPanel(record, 'OperationPane')}>{val}</a>,
      },
      {
        title: '内容标题',
        dataIndex: 'name',
        render: (record, task) => (
          <Link to={`/project/task/view?_id=${task._id}`}>
            <TaskNameColumn text={record} length={10} />
          </Link>
        )
      },
      {
        title: '姓名',
        key: 'username',
        render: (record) => record.taker_id ? record.taker_id.name : '',
      },
      {
        title: '昵称',
        key: 'nickname',
        render: (record) => record.taker_id ? record.taker_id.nickname : '',
      },
      // {
      //   title: '分数',
      //   dataIndex: 'taker_id',
      //   render: (val) => val ? val.nickname : '',
      // },
      {
        title: '状态',
        dataIndex: 'approve_status',
        render: val => (<TaskStatusColumn status={val}/>),
      },
      {
        title: '稿费',
        dataIndex: 'price',
        render: val => val ? val : '',
      },
      {
        title: '支付宝',
        key: 'alipay_number',
        render: (record) => record.taker_id ? record.taker_id.alipay_number : '',
      },
      {
        title: '发放者',
        dataIndex: 'payoff_id',
        render: val => val ? val.name : '',
      },
      {
        title: '支付方式',
        dataIndex: 'payoff_type',
        render: val => val ? val : '',
      },
      {
        title: '佣金发放状态',
        dataIndex: 'payoff',
        render: val => val ? '已发放' : '未发放',
      },
    ];
    const opera = {
      title: '操作',
      render: (record) => {
        if (!record.payoff) {
          return (
            <Popconfirm placement="left" title={`确认佣金已发放?`} onConfirm={() => this.handlePayoff(record)} okText="确认" cancelText="取消">
              <a onClick={this.handleShowModal}>
                发放佣金
              </a>
            </Popconfirm>
          );
        } else {
          return '';
        }
      }
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
    if (projectFinanceTask.approve_status === TASK_APPROVE_STATUS.publishedToTaobao || projectFinanceTask.approve_status === TASK_APPROVE_STATUS.taobaoRejected || projectFinanceTask.approve_status === TASK_APPROVE_STATUS.taobaoAccepted) {
      columns.push(daren_nickname, pushTime, opera);
    } else {
      columns.push(opera);
    }
    return (
      <div>
        <Card bordered={false} bodyStyle={{ padding: 14 }}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <RangePicker style={{ width: 240 }} onChange={(value) => this.handleSearch(value,'time')} />
              <Search
                style={{ width: 260, float: 'right' }}
                placeholder="ID／名称／商家标签"
                onChange={this.handleSearchClear}
                onSearch={(value) => this.handleSearch(value, 'search')}
                enterButton
              />
            </div>
            <Table
              loading={loading}
              dataSource={projectFinanceTask.list}
              columns={columns}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                ...projectFinanceTask.pagination,
              }}
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
