import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, Popconfirm, Modal, Table, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './FlowList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  flow: state.flow,
  teamUser: state.user.teamUser,
}))
@Form.create()
export default class FlowList extends PureComponent {
  state = {
    _id: '',
    name: '',
    desc: '',
    flow: [],
    modalVisible: false,
    modalType: 'add',
    selectedRows: [],
    selectedRowKeys: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch, teamUser } = this.props;
    if (teamUser.team_id) {
      dispatch({
        type: 'flow/fetch',
        payload: {
          team_id: teamUser.team_id,
        },
      });
      dispatch({
        type: 'flow/fetchApproveRoles',
        payload: {
          team_id: teamUser.team_id,
        },
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { dispatch, teamUser } = nextProps;
    if (teamUser.team_id !== this.props.teamUser.team_id) {
      dispatch({
        type: 'flow/fetch',
        payload: {
          team_id: teamUser.team_id,
        },
      });
      dispatch({
        type: 'flow/fetchApproveRoles',
        payload: {
          team_id: teamUser.team_id,
        },
      });
    }
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, teamUser } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      team_id: teamUser.team_id,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'flow/fetch',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'flow/fetch',
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
          type: 'flow/remove',
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
        type: 'flow/fetch',
        payload: values,
      });
    });
  }

  handleModalVisible = (flag, modalType) => {
    this.setState({
      modalVisible: !!flag,
      modalType,
    });
  }
  handleEdit = (record) => {
    this.setState({
      _id: record._id,
      name: record.name,
      desc: record.desc,
      flow: record.flow,
    });
    this.handleModalVisible(true, 'edit');
  }
  handleRemove = (record) => {
    this.props.dispatch({
      type: 'flow/remove',
      payload: {
        _id: record._id,
        team_id: this.props.teamUser.team_id,
      },
    });
    message.success('删除成功');
  }
  handleModalOk = () => {
    if (this.state.modalType === 'add') {
      this.props.dispatch({
        type: 'flow/add',
        payload: {
          team_id: this.props.teamUser.team_id,
          name: this.state.name,
          desc: this.state.desc,
          flow: this.state.flow,
        },
      });
      message.success('添加成功');
    } else if (this.state.modalType === 'edit') {
      this.props.dispatch({
        type: 'flow/update',
        payload: {
          team_id: this.props.teamUser.team_id,
          _id: this.state._id,
          name: this.state.name,
          desc: this.state.desc,
          flow: this.state.flow,
        },
      });
      message.success('修改成功');
    }

    
    this.setState({
      modalVisible: false,
      _id: '',
      name: '',
      desc: '',
      flow: [],
      modalType: '',
    });
  }
  handleRowSelectChange = (selectedRowKeys, selectedRows) => {

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys });
  }
  render() {
    const { flow: { loading, data: { list, pagination }, approveRoles } } = this.props;
    const { selectedRows, modalVisible, name, desc, flow, selectedRowKeys } = this.state;

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '描述',
        dataIndex: 'desc',
      },
      {
        title: '流程',
        dataIndex: 'flow',
        render: val => val.map(item => {
          const role = approveRoles.find(item1 => item1.id === item);
          return role ? role.name : '';
        }).join(','),
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
      },
      {
        title: '操作',
        render: (record) => (
          <p>
            <a onClick={() => this.handleEdit(record)}>修改</a>
            <span className={styles.splitLine} />
            <Popconfirm placement="left" title={`确认删除 ${record.name}?`} onConfirm={() => this.handleRemove(record)} okText="确认" cancelText="否">
              <a>删除</a>
            </Popconfirm>
            
          </p>
        ),
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
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true, 'add')}>新建</Button>
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
        <Modal
          title="新建审批流程"
          visible={modalVisible}
          onOk={this.handleModalOk}
          onCancel={() => this.handleModalVisible()}
        >
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="名称"
          >
            <Input placeholder="请输入" onChange={e => this.setState({ name: e.target.value })} value={name} />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="描述"
          >
            <Input placeholder="请输入" onChange={e => this.setState({ desc: e.target.value })} value={desc} />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="流程"
          >
            <Select
              mode="multiple"
              placeholder="Please select"
              value={flow.map(item => String(item))}
              onChange={(e) => this.setState({ flow: e.map(item => Number(item)) })}
              style={{ width: '100%' }}
            >
              {
                approveRoles.map(item => (<Option key={item.id} value={String(item.id)}>{item.name}</Option>))
              }
            </Select>
          </FormItem>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
