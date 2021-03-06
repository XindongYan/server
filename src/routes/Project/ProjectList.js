import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import querystring from 'querystring';
import moment from 'moment';
import TaskNameColumn from '../../components/TaskNameColumn';
import TrimSpan from '../../components/TrimSpan';
import DateTimeColumn from '../../components/DateTimeColumn';
import { Row, Col, Card, Input, Select, Icon, Button, Menu, Popconfirm, Modal, Table, message, Radio, DatePicker, Tooltip } from 'antd';
import { Link } from 'dva/router';
import { PROJECT_STATUS_TEXT, PROJECT_STATUS } from '../../constants';

import styles from './Project.less';

const { RangePicker } = DatePicker;
const Search = Input.Search;
const { Option } = Select;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  data: state.project.data,
  loading: state.project.loading,
  teamUser: state.user.teamUser,
  currentUser: state.user.currentUser,
}))
export default class ProjectList extends PureComponent {
  state = {
    selectedRows: [],
    selectedRowKeys: [],
    create_time_start: null,
    create_time_end: null,
    search: '',
  };

  componentDidMount() {
    const { dispatch, teamUser, currentUser, data: { pagination, status, type } } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    if (teamUser.team_id) {
      dispatch({
        type: 'project/fetch',
        payload: {
          ...pagination,
          team_id: teamUser.team_id,
          user_id: currentUser._id,
          status,
          type: Number(query.type || type),
        },
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { dispatch, teamUser, currentUser, data: { pagination, status, type } } = nextProps;
    const query = querystring.parse(this.props.location.search.substr(1));
    if (teamUser.team_id !== this.props.teamUser.team_id) {
      dispatch({
        type: 'project/fetch',
        payload: {
          ...pagination,
          team_id: teamUser.team_id,
          user_id: currentUser._id,
          status,
          type: Number(query.type || type),
        },
      });
    }
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, teamUser, currentUser, data: { status, type } } = this.props;
    const { create_time_start, create_time_end, search } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      team_id: teamUser.team_id,
      user_id: currentUser._id,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      status,
      type,
      ...filters,
      create_time_start,
      create_time_end,
      search,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'project/fetch',
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
          type: 'project/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  }

  handleAdd = () => {
    this.props.dispatch(routerRedux.push('/project/create'));
  }
  handleEdit = (record) => {
    this.props.dispatch(routerRedux.push(`/project/edit?_id=${record._id}`));
  }
  handlePublish = (record) => {
    const { dispatch, teamUser } = this.props;
    dispatch({
      type: 'project/publish',
      payload: {
        _id: record._id,
        user_id: teamUser.user_id,
      },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          message.success(result.msg);
          this.props.dispatch(routerRedux.push(`/project/task/list?project_id=${record._id}`));
        }
      },
    });
  }
  handleOffshelf = (record) => {
    const { dispatch, teamUser, currentUser, data: { pagination, status, type } } = this.props;
    const { create_time_start, create_time_end, search } = this.state;
    dispatch({
      type: 'project/offshelf',
      payload: {
        _id: record._id,
        user_id: teamUser.user_id,
      },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          message.success(result.msg);
          this.handleFetch();
        }
      },
    });
  }
  handleRemove = (record) => {
    const { dispatch, teamUser, currentUser, data: { pagination, status, type } } = this.props;
    dispatch({
      type: 'project/remove',
      payload: {
        _id: record._id,
      },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          message.success(result.msg);
          this.handleFetch();
        }
      },
    });
  }
  handleSearch = (value, name) => {
    const { dispatch, teamUser, currentUser, data: { pagination, status, type } } = this.props;
    const { create_time_start, create_time_end, search } = this.state;
    const values = {
      ...pagination,
      team_id: teamUser.team_id,
      user_id: currentUser._id,
      create_time_start,
      create_time_end,
      search,
      status,
      type,
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
      type: 'project/fetch',
      payload: values,
    });
  }
  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }
    this.setState({ selectedRowKeys });
  }

  changeStatus = (e) => {
    const { dispatch, teamUser, currentUser, data: { pagination, type } } = this.props;
    const { create_time_start, create_time_end, search } = this.state;
    dispatch({
      type: 'project/fetch',
      payload: {
        ...pagination,
        team_id: teamUser.team_id,
        user_id: currentUser._id,
        status: e.target.value,
        type,
        currentPage: 1,
        create_time_start,
        create_time_end,
        search,
      },
    });
  }
  changeType = (e) => {
    const { dispatch, teamUser, currentUser, data: { pagination, status } } = this.props;
    const { create_time_start, create_time_end, search } = this.state;
    let newStatus = status;
    if (e.target.value === 3) {
      newStatus = -4;
    }
    dispatch({
      type: 'project/fetch',
      payload: {
        ...pagination,
        team_id: teamUser.team_id,
        user_id: currentUser._id,
        status: newStatus,
        type: e.target.value,
        create_time_start,
        create_time_end,
        search,
      },
    });
  }
  handleFetch = () => {
    const { dispatch, currentUser, teamUser, data: { pagination, status, type } } = this.props;
    const { create_time_start, create_time_end, search } = this.state;
    dispatch({
      type: 'project/fetch',
      payload: {
        ...pagination,
        team_id: teamUser.team_id,
        user_id: currentUser._id,
        status,
        type,
        create_time_start,
        create_time_end,
        search,
        currentPage: 1,
      },
    });
  }
  handleSearchChange = (e) => {
    if (!e.target.value) {
      this.handleSearch(e.target.value, 'search')
    }
    this.setState({ search: e.target.value });
  }
  render() {
    const { loading, data: { list, pagination, status, type } } = this.props;
    const { selectedRows, selectedRowKeys, create_time_start, create_time_end } = this.state;

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );
    const columns = [
      {
        title: '活动ID',
        dataIndex: 'id',
      },
      {
        title: '标题',
        dataIndex: 'name',
        render: (val, record) => (<Link to={`/project/task/list?project_id=${record._id}`}><TaskNameColumn text={val} length={10}/></Link>),
      },
      {
        title: '商家名称',
        dataIndex: 'merchant_tag',
        render: (val) => (
          <TrimSpan text={val} length={10} />
        )
      },
      {
        title: '截止时间',
        dataIndex: 'deadline',
        render: (val) => <DateTimeColumn value={val} />,
      },
      {
        title: '创建者',
        dataIndex: 'creator_id',
        render: val => val ? val.nickname : '',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: (val) => <DateTimeColumn value={val} />,
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: val => PROJECT_STATUS_TEXT[val],
      },
      {
        title: '操作',
        render: (record) => {
          if (record.status === PROJECT_STATUS.created) {
            return (
              <p>
                <Link to={`/project/task/list?project_id=${record._id}`}>任务</Link>
                <span className={styles.splitLine} />
                <a onClick={() => this.handleEdit(record)}>修改</a>
                { record.type !== 3 &&
                  <span className={styles.splitLine} />
                }
                { record.type !== 3 &&
                  <Popconfirm placement="left" title={`确认上架?`} onConfirm={() => this.handlePublish(record)} okText="确认" cancelText="取消">
                    <a>上架</a>
                  </Popconfirm>
                }
                <span className={styles.splitLine} />
                <Popconfirm placement="left" title={`确认删除?`} onConfirm={() => this.handleRemove(record)} okText="确认" cancelText="取消">
                  <a>删除</a>
                </Popconfirm>
              </p>
            );
          } else if (record.status === PROJECT_STATUS.published) {
            return (
              <p>
                <Link to={`/project/task/list?project_id=${record._id}`}>任务</Link>
                <span className={styles.splitLine} />
                <Popconfirm placement="left" title={`确认下架?`} onConfirm={() => this.handleOffshelf(record)} okText="确认" cancelText="取消">
                  <a>下架</a>
                </Popconfirm>
              </p>
            );
          } else if (record.status === PROJECT_STATUS.offshelf) {
            return (
              <p>
                <Link to={`/project/task/list?project_id=${record._id}`}>任务</Link>
                <span className={styles.splitLine} />
                <a onClick={() => this.handleEdit(record)}>修改</a>
                <span className={styles.splitLine} />
                <Popconfirm placement="left" title={`确认上架?`} onConfirm={() => this.handlePublish(record)} okText="确认" cancelText="取消">
                  <a>上架</a>
                </Popconfirm>
                <span className={styles.splitLine} />
                <Popconfirm placement="left" title={`确认删除?`} onConfirm={() => this.handleRemove(record)} okText="确认" cancelText="取消">
                  <a>删除</a>
                </Popconfirm>
              </p>
            );
          }
        },
      },
    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    // const rowSelection = {
    //   selectedRowKeys,
    //   onChange: this.handleRowSelectChange,
    //   getCheckboxProps: record => ({
    //     disabled: record.disabled,
    //   }),
    // };
    return (
      <div>
        <div className={styles.searchBox}>
          <div>
            <RadioGroup value={type} onChange={this.changeType}> 
              <RadioButton value={-4}>全部</RadioButton>
              <RadioButton value={1}>接单活动</RadioButton>
              <RadioButton value={2}>投稿活动</RadioButton>
              <RadioButton value={3}>派单活动</RadioButton>
            </RadioGroup>
          </div>
          {type !== 3 &&
            <div>
              <RadioGroup value={status} onChange={this.changeStatus}> 
                <RadioButton value={-4}>全部</RadioButton>
                <RadioButton value={2}>已上架</RadioButton>
                <RadioButton value={3}>已下架</RadioButton>
              </RadioGroup>
            </div>
          }
            
        </div>
        <Card bordered={false} bodyStyle={{ padding: 14 }}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              {/* <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>新建</Button> */}
              <RangePicker style={{ width: 240 }} onChange={(value) => this.handleSearch(value, 'time')}
                value={create_time_start ? [ moment(create_time_start), moment(create_time_end) ] : []} />
              <Tooltip placement="top" title="创建时间">
                <Icon type="question-circle-o" style={{ marginLeft: 8 }} />
              </Tooltip>
              <Search
                style={{ width: 260, float: 'right'}}
                placeholder="ID／名称／商家名称"
                onSearch={(value) => this.handleSearch(value, 'search')}
                onChange={this.handleSearchChange}
                value={this.state.search}
                enterButton
              />
            </div>
            <Table
              loading={loading}
              dataSource={list}
              columns={columns}
              pagination={paginationProps}
              onChange={this.handleStandardTableChange}
              rowKey="_id"
            />
          </div>
        </Card>
      </div>
    );
  }
}
