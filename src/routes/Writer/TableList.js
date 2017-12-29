import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Radio, Input, DatePicker, Tooltip, Divider, Popconfirm, message } from 'antd';
import moment from 'moment';
import querystring from 'querystring';
import { Link } from 'dva/router';
import $ from 'jquery';
import fetch from 'dva/fetch';
import { stringify } from 'qs';
import TaskNameColumn from '../../components/TaskNameColumn';
import TaskStatusColumn from '../../components/TaskStatusColumn';
import { TASK_APPROVE_STATUS, ORIGIN } from '../../constants';
import styles from './TableList.less';

import { queryConvertedTasks } from '../../services/task';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const Search = Input.Search;

@connect(state => ({
  data: state.task.takerTask,
  loading: state.task.takerTaskLoading,
  currentUser: state.user.currentUser,
}))
export default class TableList extends PureComponent {
  state = {
    nicaiCrx: null,
    version: '',
  }

  componentDidMount() {
    const { dispatch, currentUser, data: { pagination, approve_status } } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    if (currentUser._id) {
      dispatch({
        type: 'task/fetchTakerTasks',
        payload: {
          ...pagination,
          approve_status: query.approve_status ? Number(query.approve_status) : approve_status,
          user_id: currentUser._id
        },
      });
    }
    const nicaiCrx = document.getElementById('nicaiCrx');
    nicaiCrx.addEventListener('publishResult', this.publishResult);
    nicaiCrx.addEventListener('setVersion', this.setVersion);
    if (!this.state.nicaiCrx) {
      this.setState({ nicaiCrx }, () => {
        setTimeout(() => {
          this.handleGetVersion();
        }, 400);
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { dispatch, currentUser, data: { pagination, approve_status } } = nextProps;
    const query = querystring.parse(this.props.location.search.substr(1));
    if (currentUser._id !== this.props.currentUser._id) {
      dispatch({
        type: 'task/fetchTakerTasks',
        payload: {
          ...pagination,
          approve_status: query.approve_status ? Number(query.approve_status) : approve_status,
          user_id: currentUser._id,
        },
      });
    }
  }
  componentWillUnmount() {
    const nicaiCrx = document.getElementById('nicaiCrx');
    nicaiCrx.removeEventListener('publishResult', this.publishResult);
    nicaiCrx.removeEventListener('setVersion', this.setVersion);
  }
  publishResult = (e) => {
    const data = JSON.parse(e.target.innerText);
    message.destroy();
    if (data.error) {
      message.error(data.msg);
    } else {
      message.success(data.msg);
      this.handleFetch();
    }
  }
  setVersion = (e) => {
    const data = JSON.parse(e.target.innerText);
    this.setState({
      version: data,
    })
  }
  handleGetVersion = () => {
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getVersion', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  handleFetch = () => {
    const { dispatch, currentUser, data: { pagination, approve_status } } = this.props;
    dispatch({
      type: 'task/fetchTakerTasks',
      payload: { ...pagination, approve_status, user_id: currentUser._id, currentPage: 1, },
    });
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
      user_id: currentUser._id,
      approve_status,
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

  handlePublish = async (record) => {
    if (this.state.version) {
      const { currentUser } = this.props;
      const tasks = await queryConvertedTasks({
        _ids: JSON.stringify([record._id]),
      });
      this.state.nicaiCrx.innerText = JSON.stringify({...tasks, user: currentUser});
      const customEvent = document.createEvent('Event');
      customEvent.initEvent('publishToTaobao', true, true);
      this.state.nicaiCrx.dispatchEvent(customEvent);
      message.destroy();
      message.loading('发布中 ...', 60);
    } else {
      message.destroy();
      message.warn('请安装尼采创作平台插件并用淘宝授权登录！', 60 * 60);
    }
  }

  handleSearch = (value, name) => {
    const { dispatch, data: { pagination, approve_status }, currentUser } = this.props;
    const values = {
      user_id: currentUser._id,
      approve_status,
    };
    if(name === 'time') {
      values['take_time_start'] = value[0] ? value[0].format('YYYY-MM-DD 00:00:00') : '';
      values['take_time_end'] = value[1] ? value[1].format('YYYY-MM-DD 23:59:59') : '';
    } else {
      values[name] = value;
    }
    dispatch({
      type: 'task/fetchTakerTasks',
      payload: {
        currentPage: 1,
        pageSize: pagination.pageSize,
        ...values, 
      }
    });
  }

  changeApproveStatus = (e) => {
    const { dispatch, currentUser, data: { pagination } } = this.props;
    dispatch({
      type: 'task/fetchTakerTasks',
      payload: { ...pagination, user_id: currentUser._id, approve_status: e.target.value, currentPage: 1, }
    });
  }
  render() {
    const { data, loading } = this.props;
    const columns = [
      {
        title: '任务ID',
        dataIndex: 'id',
      },
      {
        title: '名称',
        dataIndex: 'name',
        render: (record, task) => (
          <Link to={`/project/task/view?_id=${task._id}`}>
            <TaskNameColumn text={record} length={10} />
          </Link>
        ),
      },
      {
        title: '接单时间',
        dataIndex: 'take_time',
        render: val => (
          <Tooltip placement="top" title={moment(val).format('YYYY-MM-DD HH:mm:ss')}>
            {moment(val).format('MM/DD')}
          </Tooltip>
        ),
      },
      {
        title: '发布渠道',
        dataIndex: 'channel_name',
        render: val => val || '',
      },
      {
        title: '商家标签',
        dataIndex: 'merchant_tag',
        render: (record) => (
          <TaskNameColumn text={record} length={10} />
        )
      },
    ];
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
      render: val => ( 
        val ?
        <Tooltip placement="top" title={moment(val).format('YYYY-MM-DD HH:mm:ss')}>
          {moment(val).fromNow()}
        </Tooltip> : ''
      ),
    };
    const pushStatusText = {
      title: '推送状态',
      dataIndex: 'taobao',
      render: val => {
        let pushStatusTextTags = '';
        if (val.pushStatusText) {
          pushStatusTextTags = val.pushStatusText.map((item, index) => <p key={index}>{item}</p>);
        }
        return <span>{pushStatusTextTags}</span>
      },
    };
    const opera = {
      title: '操作',
      render: (record) => {
        if (record.approve_status === TASK_APPROVE_STATUS.taken || record.approve_status === TASK_APPROVE_STATUS.rejected) {
          return (
            <div>
              <a target="_blank" href={`${ORIGIN}/public/task/details?id=${record._id}`}>
                外链
              </a>
              <Divider type="vertical" />
              <Link to={`/writer/task/edit?_id=${record._id}`}>
                <span>编辑</span>
              </Link>
            </div>
          );
        } else if (record.approve_status === TASK_APPROVE_STATUS.waitingForApprove) {
          return (
            <div>
              <a target="_blank" href={`${ORIGIN}/public/task/details?id=${record._id}`}>
                外链
              </a>
              <Divider type="vertical" />
              <Link to={`/writer/task/view?_id=${record._id}`}>
                <span>查看</span>
              </Link>
            </div>
          );
        } else if (record.approve_status === TASK_APPROVE_STATUS.passed) {
          return (
            <div>
              <a target="_blank" href={`${ORIGIN}/public/task/details?id=${record._id}`}>
                外链
              </a>
              <Divider type="vertical" />
              <Link to={`/writer/task/view?_id=${record._id}`}>
                <span>查看</span>
              </Link>
            </div>
          );
        } else if (record.approve_status === TASK_APPROVE_STATUS.waitingToTaobao) {
          return (
            <div>
              <a target="_blank" href={`${ORIGIN}/public/task/details?id=${record._id}`}>
                外链
              </a>
              <Divider type="vertical" />
              <Popconfirm placement="left" title={`确认发布至阿里创作平台?`} onConfirm={() => this.handlePublish(record)} okText="确认" cancelText="取消">
                <a>发布</a>
              </Popconfirm>
            </div>
          );
        } else if (record.approve_status === TASK_APPROVE_STATUS.publishedToTaobao) {
          return (
            <div>
              <a target="_blank" href={`${ORIGIN}/public/task/details?id=${record._id}`}>
                外链
              </a>
              <Divider type="vertical" />
              <a target="_blank" href={record.taobao ? record.taobao.url : ''}>
                查看
              </a>
            </div>
          );
        }
      }
    };
    if (data.approve_status === -1 || data.approve_status === 0) {
      columns.push(opera);
    } else if (data.approve_status === TASK_APPROVE_STATUS.publishedToTaobao || data.approve_status === TASK_APPROVE_STATUS.taobaoAccepted
      || data.approve_status === TASK_APPROVE_STATUS.taobaoRejected) {
      columns.push( pushStatusText, opera);
    } else {
      columns.push( approver, grade, approveTime, opera);
    }
    return (
      <div>
        <div className={styles.searchBox}>
          <RadioGroup value={data.approve_status} onChange={this.changeApproveStatus}>
            <Tooltip placement="top" title="待完成/草稿箱">
              <RadioButton value={TASK_APPROVE_STATUS.taken}>待完成</RadioButton>
            </Tooltip>
            <RadioButton value={TASK_APPROVE_STATUS.waitingForApprove}>待审核</RadioButton>
            <RadioButton value={TASK_APPROVE_STATUS.passed}>已通过</RadioButton>
            <RadioButton value={TASK_APPROVE_STATUS.rejected}>未通过</RadioButton>
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
            <Tooltip placement="top" title="阿里创作平台通过">
              <RadioButton value={TASK_APPROVE_STATUS.taobaoAccepted}>
                淘宝通过
              </RadioButton>
            </Tooltip>
            <Tooltip placement="top" title="阿里创作平台不通过">
              <RadioButton value={TASK_APPROVE_STATUS.taobaoRejected}>
                淘宝不通过
              </RadioButton>
            </Tooltip>
          </RadioGroup>
        </div>
        <Card bordered={false} bodyStyle={{ padding: 14 }}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <RangePicker style={{ width: 240 }} onChange={(value) => this.handleSearch(value,'time')} />
              <Search
                style={{ width: 260, float: 'right' }}
                placeholder="名称／商家标签"
                onSearch={(value) => this.handleSearch(value, 'search')}
                enterButton
              />
            </div>
            <Table
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
          </div>
        </Card>
      </div>
    );
  }
}
