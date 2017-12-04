import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Icon, Table, Form, Checkbox, Avatar, Modal, Button, Select, Popconfirm, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { RIGHTS, APPROVE_ROLES } from '../../constants';
import styles from './TeamList.less';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  team: state.team,
  teamUser: state.user.teamUser,
  currentUser: state.user.currentUser,
}))
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    selectedRowKeys: [],
    formValues: {},
    phone: '',
    user: {},
    addTeamUserModalVisible: false,
  };

  componentDidMount() {
    const { dispatch, teamUser } = this.props;
    if (teamUser.team_id) {
      dispatch({
        type: 'team/fetch',
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
        type: 'team/fetch',
        payload: {
          team_id: teamUser.team_id,
        },
      });
    }
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
      type: 'team/fetch',
      payload: params,
    });
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
        type: 'team/fetch',
        payload: values,
      });
    });
  }
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }
  handleEdit = (record) => {
    this.setState({
      user: {
        user_id: record.user_id._id,
        rights: record.user_id.rights,
        approve_roles: record.approve_roles,
      },
    });
    this.handleModalVisible(true);
  }
  handleRemove = (record) => {
    const { dispatch, teamUser } = this.props;
    dispatch({
      type: 'team/remove',
      payload: {
        _id: record._id,
        callback: () => {
          dispatch({
            type: 'team/fetch',
            payload: {
              team_id: teamUser.team_id,
            },
          });
        },
      },
    });
    message.success('删除成功');
  }
  handleRightsChange = (checkedValues) => {
    this.setState({
      user: { ...this.state.user, rights: checkedValues}
    });
  }
  handleApproveRolesChange = (checkedValues) => {
    this.setState({
      user: { ...this.state.user, approve_roles: checkedValues}
    });
  }
  handleModalOk = () => {
    this.props.dispatch({
      type: 'team/update',
      payload: {
        team_id: this.props.teamUser.team_id,
        ...this.state.user,
      },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          message.success(result.msg);
        }
      }
    });
    this.handleModalVisible(false);
  }
  handleRowSelectChange = (selectedRowKeys, selectedRows) => {

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys });
  }
  onSearch = (value) => {
    this.setState({
      phone: value,
    });
    if (value.length >= 10) {
      this.props.dispatch({
        type: 'team/fetchUsersByPhone',
        payload: {
          phone: value
        },
      });
    }
  }
  handleAddTeamUser = () => {
    const { dispatch, teamUser } = this.props;
    if (!this.state.phone) {
      message.warn('请先选择用户');
    } else {
      dispatch({
        type: 'team/add',
        payload: {
          phone: this.state.phone,
          team_id: teamUser.team_id,
        },
        callback: (result) => {
          if (result.error) {
            message.error(result.msg);
          } else {
            message.success('添加成功');
            this.handleHideTeamUserModal();
          }
        },
      });
    }
    
  }
  handleSelect = (value) => {
    this.setState({ phone: value });
  }
  handleShowAddTeamUserModal = () => {
    this.setState({ addTeamUserModalVisible: true, phone: '' });
  }
  handleHideTeamUserModal = () => {
    this.setState({ addTeamUserModalVisible: false });
  }
  render() {
    const { team: { loading, data: { list, pagination }, suggestionUsers }, currentUser } = this.props;
    const { selectedRows, selectedRowKeys, modalVisible, user, addTeamUserModalVisible } = this.state;

    const columns = [
      {
        title: '头像',
        dataIndex: 'user_id.avatar',
        render: val =>  <Avatar style={{ backgroundColor: '#87d068' }} icon="user" src={val}/>,
      },
      {
        title: '姓名',
        dataIndex: 'user_id.name',
      },
      {
        title: '角色',
        dataIndex: 'user_id.rights',
        render(val) {
          return val.map(item => RIGHTS.find(item1 => item1.value === item).label).join(',');
        },
      },
      {
        title: '审核角色',
        dataIndex: 'approve_roles',
        render(val) {
          return val.map(item => APPROVE_ROLES.find(item1 => item1.value === item).label).join(',');
        },
      },
      {
        title: '电话',
        dataIndex: 'user_id.phone',
      },
      {
        title: '邀请码',
        dataIndex: 'invitation_code',
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
            {record.user_id._id !== currentUser._id &&
              <span><span className={styles.splitLine} />
              <Popconfirm placement="left" title={`确认删除?`} onConfirm={() => this.handleRemove(record)} okText="确认" cancelText="否">
                <a>删除</a>
              </Popconfirm></span> }
            
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
              <Button onClick={this.handleShowAddTeamUserModal} type="primary" icon="plus">添加成员</Button>
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
        <Modal
          title="用户权限"
          visible={modalVisible}
          onOk={this.handleModalOk}
          onCancel={() => this.handleModalVisible()}
        >
          <FormItem
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            label="权限"
          >
            <CheckboxGroup options={RIGHTS.filter(item => item.value !== 8)} value={user.rights} onChange={this.handleRightsChange} />
          </FormItem>
          <FormItem
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            label="审核角色"
          >
            <CheckboxGroup options={APPROVE_ROLES} value={user.approve_roles} onChange={this.handleApproveRolesChange} />
          </FormItem>
        </Modal>
        <Modal
          title="添加成员"
          visible={addTeamUserModalVisible}
          onOk={this.handleAddTeamUser}
          onCancel={() => this.handleHideTeamUserModal()}
        >
          <FormItem
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            label="用户电话"
          >
            <Select
              style={{ width: '100%' }}
              mode="combobox"
              optionLabelProp="children"
              value={this.state.phone}
              placeholder="搜索用户添加至团队"
              notFoundContent=""
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={this.onSearch}
              onSelect={this.handleSelect}
            >
              {suggestionUsers.map(item => <Option value={item.phone} key={item.phone}>{item.name}</Option>)}
            </Select>
          </FormItem>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
