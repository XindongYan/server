import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import querystring from 'querystring';
import { Table, Card, Button, Menu, Checkbox, Popconfirm, message } from 'antd';
import { TASK_APPROVE_STATUS } from '../../constants';
import styles from './TableList.less';
import TaskTitleColumn from '../../components/TaskTitleColumn';
import TaskStatusColumn from '../../components/TaskStatusColumn';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  projectTask: state.task.projectTask,
  loading: state.task.projectTaskLoading,
  formData: state.project.formData,
}))

export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    selectedRowKeys: [],
    formValues: {},
    user: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch({
      type: 'task/fetchProjectTasks',
      payload: { project_id: query.project_id },
    });
    this.props.dispatch({
      type: 'project/fetchProject',
      payload: { _id: query.project_id },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'task/fetchProjectTasks',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'task/fetchProjectTasks',
      payload: {},
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
        type: 'task/fetch',
        payload: values,
      });
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
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  render() {
    const { projectTask, loading, formData } = this.props;
    const { selectedRows, modalVisible, user, selectedRowKeys } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const columns = [
      {
        title: '稿子ID',
        dataIndex: 'id',
      },
      {
        title: '内容标题',
        dataIndex: 'title',
        render: (record) => (
          <TaskTitleColumn text={record} length={10}/>
        )
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
      },
      {
        title: '渠道',
        dataIndex: 'channel_name',
      },
      {
        title: '商家标签',
        dataIndex: 'merchant_tag',
      },
      {
        title: '状态',
        dataIndex: 'approve_status',
        render: val => (<TaskStatusColumn status={val}/>),
      },
      {
        title: '操作',
        render: (record) => (
          <p>
            <a onClick={() => this.handleEdit(record)}>修改</a>
            <span className={styles.splitLine} />
            <Popconfirm placement="left" title={`确认删除?`} onConfirm={() => this.handleRemove(record)} okText="确认" cancelText="否">
              <a>删除</a>
            </Popconfirm>
          </p>
        ),
      },
    ];
    const gridStyle = {
      width: '32%',
      margin: '5px',
      padding: '10px',
    };
    return (
      <div>
        <Card title={formData.title} noHovering bordered={false} style={{ margin: '10px 0' }} bodyStyle={{ padding:'10px 5px' }}>
          <Card.Grid style={gridStyle}>商家标签：{ formData.merchant_tag }</Card.Grid>
          <Card.Grid style={gridStyle}>截止日期：{ formData.deadline ? moment(formData.deadline).format('YYYY-MM-DD HH:mm') : '未设置' }</Card.Grid>
          <Card.Grid style={gridStyle}>项目奖励：{ formData.price }</Card.Grid>
        </Card>
        <Card bordered={false} bodyStyle={{ padding: 14 }}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>新建任务</Button>
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
              dataSource={projectTask.list}
              columns={columns}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                ...projectTask.pagination,
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
