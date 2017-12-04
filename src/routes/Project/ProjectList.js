import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Row, Col, Card, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, Popconfirm, Modal, Table, message } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { PROJECT_STATUS_TEXT, PROJECT_STATUS } from '../../constants';

import styles from './Project.less';

const { Option } = Select;
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
  };

  componentDidMount() {
    const { dispatch, teamUser, type } = this.props;
    if (teamUser.team_id) {
      dispatch({
        type: 'project/fetch',
        payload: {
          team_id: teamUser.team_id,
          type,
        },
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { dispatch, teamUser, type } = nextProps;
    if (teamUser.team_id !== this.props.teamUser.team_id) {
      dispatch({
        type: 'project/fetch',
        payload: {
          team_id: teamUser.team_id,
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

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'project/fetch',
        payload: values,
      });
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
    const { dispatch, teamUser } = this.props;
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
        }
      },
    });
  }
  handleRowSelectChange = (selectedRowKeys, selectedRows) => {

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys });
  }
  render() {
    const { project: { loading, data: { list, pagination }, approveRoles } } = this.props;
    const { selectedRows, selectedRowKeys } = this.state;

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );
    const columns = [
      {
        title: '标题',
        dataIndex: 'name',
      },
      {
        title: '商家标签',
        dataIndex: 'merchant_tag',
      },
      {
        title: '截止时间',
        dataIndex: 'deadline',
        render: val => val ? <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span> : '',
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

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    return (
      <PageHeaderLayout title="">
        <Card bordered={false} bodyStyle={{ padding: 14 }}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>新建</Button>
              {
                selectedRows.length > 0 && (
                  <span>
                    <Button>批量操作</Button>
                    <Dropdown overlay={menu}>
                      <Button>
                        更多操作 <Icon type="down" />
                      </Button>
                    </Dropdown>
                  </span>
                )
              }
            </div>
            <Table
              loading={loading}
              rowSelection={rowSelection}
              dataSource={list}
              columns={columns}
              pagination={paginationProps}
              onChange={this.handleStandardTableChange}
              rowKey="_id"
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
