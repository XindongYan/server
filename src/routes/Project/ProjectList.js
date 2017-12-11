import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import TaskNameColumn from '../../components/TaskNameColumn';
import { Row, Col, Card, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, Popconfirm, Modal, Table, message, Radio, DatePicker } from 'antd';
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
  project: state.project,
  teamUser: state.user.teamUser,
}))
export default class ProjectList extends PureComponent {
  state = {
    selectedRows: [],
    selectedRowKeys: [],
    formValues: {},
    tabValue: 1,
  };

  componentDidMount() {
    const { dispatch, teamUser, type } = this.props;
    const { tabValue } = this.state;
    if (teamUser.team_id) {
      dispatch({
        type: 'project/fetch',
        payload: {
          team_id: teamUser.team_id,
          status: tabValue,
          type,
        },
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { dispatch, teamUser, type } = nextProps;
    const { tabValue } = this.state;
    if (teamUser.team_id !== this.props.teamUser.team_id) {
      dispatch({
        type: 'project/fetch',
        payload: {
          team_id: teamUser.team_id,
          status: tabValue,
          type,
        },
      });
    }
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, teamUser, type } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      team_id: teamUser.team_id,
      type,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
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

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }
  handleAdd = () => {
    const { type } = this.props;
    if (type === 1) {
      this.props.dispatch(routerRedux.push('/activity/create'));
    } else if (type === 2) {
      this.props.dispatch(routerRedux.push('/deliver/create'));
    }
  }
  handleEdit = (record) => {
    const { type } = this.props;
    if (type === 1) {
      this.props.dispatch(routerRedux.push(`/activity/edit?_id=${record._id}`));
    } else if (type === 2) {
      this.props.dispatch(routerRedux.push(`/deliver/edit?_id=${record._id}`));
    }
  }
  handlePublish = (record) => {
    const { dispatch, teamUser } = this.props;
    dispatch({
      type: 'project/publish',
      payload: {
        _id: record._id,
        user_id: teamUser.user_id,
        team_id: teamUser.team_id,
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
    const { dispatch, teamUser } = this.props;
    dispatch({
      type: 'project/offshelf',
      payload: {
        _id: record._id,
        user_id: teamUser.user_id,
        team_id: teamUser.team_id,
      },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          message.success(result.msg);
        }
      },
    });
  }
  handleRemove = (record) => {
    const { dispatch, teamUser, type } = this.props;
    dispatch({
      type: 'project/remove',
      payload: {
        _id: record._id,
        team_id: teamUser.team_id,
      },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          message.success(result.msg);
          dispatch({
            type: 'project/fetch',
            payload: {
              team_id: teamUser.team_id,
              type,
            },
          });
        }
      },
    });
  }
  handleSearch = (value, name) => {
    const { dispatch, teamUser, type } = this.props;
    const { tabValue } = this.state;
    const values = {
      team_id: teamUser.team_id,
      status: tabValue,
      type,
    };
    if(name === 'time') {
      values['create_time_start'] = value[0] ? value[0].format('YYYY-MM-DD 00:00:00') : '';
      values['create_time_end'] = value[1] ? value[1].format('YYYY-MM-DD 23:59:59') : '';
    } else {
      values[name] = value;
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

  changeTab = (e) => {
    const { dispatch, teamUser, type } = this.props;
    this.setState({
      tabValue: e.target.value,
    })
    dispatch({
      type: 'project/fetch',
      payload: {
        team_id: teamUser.team_id,
        status: e.target.value,
        type,
      },
    });
  }
  render() {
    const { project: { loading, data: { list, pagination }, approveRoles } } = this.props;
    const { selectedRows, selectedRowKeys, tabValue } = this.state;

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
        title: '商家标签',
        dataIndex: 'merchant_tag',
        render: (record) => (
          <TaskNameColumn text={record} length={10} />
        )
      },
      {
        title: '截止时间',
        dataIndex: 'deadline',
        render: val => val ? <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span> : '',
      },
      {
        title: '创建者',
        dataIndex: 'creator_id',
        render: val => val ? val.name : '',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
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
                <span className={styles.splitLine} />
                <Popconfirm placement="left" title={`确认发布?`} onConfirm={() => this.handlePublish(record)} okText="确认" cancelText="取消">
                  <a>发布</a>
                </Popconfirm>
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
                <Popconfirm placement="left" title={`确认发布?`} onConfirm={() => this.handlePublish(record)} okText="确认" cancelText="取消">
                  <a>发布</a>
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
          <RadioGroup value={tabValue} onChange={this.changeTab}> 
            <RadioButton value={1}>已创建</RadioButton>
            <RadioButton value={2}>已发布</RadioButton>
            <RadioButton value={3}>已下架</RadioButton>
          </RadioGroup>
        </div>
        <Card bordered={false} bodyStyle={{ padding: 14 }}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              {/* <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>新建</Button> */}
              <RangePicker style={{ width: 240 }} onChange={(value) => this.handleSearch(value,'time')} />
              <Search
                style={{ width: 260, float: 'right'}}
                placeholder="任务名称／商家标签"
                onSearch={(value) => this.handleSearch(value, 'search')}
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
