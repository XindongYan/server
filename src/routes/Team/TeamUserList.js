import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Icon, Table, Form, Checkbox, Avatar, Modal, Button, Mention, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { RIGHTS } from '../../constants';
import styles from './TeamList.less';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  team: state.team,
  teamUser: state.user.teamUser,
}))
export default class TableList extends PureComponent {
  state = {
    addInputValue: '',
    modalVisible: false,
    selectedRows: [],
    selectedRowKeys: [],
    formValues: {},
    user: {},
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
      user: record,
    });
    this.handleModalVisible(true);
  }
  handleRightsChange = (checkedValues) => {
    this.setState({
      user: { ...this.state.user, rights: checkedValues}
    });
  }
  handleModalOk = () => {
    this.props.dispatch({
      type: 'team/update',
      payload: {
        team_id: this.props.teamUser.team_id,
        ...this.state.user,
      },
    });
    this.handleModalVisible(false);
  }
  handleRowSelectChange = (selectedRowKeys, selectedRows) => {

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys });
  }
  onSearchChange = () => {
    
  }
  onSelect = () => {

  }
  render() {
    const { team: { loading, data: { list, pagination } } } = this.props;
    const { selectedRows, selectedRowKeys, modalVisible, user } = this.state;

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
            <a onClick={() => this.handleEdit(record.user_id)}>修改</a>
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
              <Mention
                placeholder="@电话 将此用户添加到团队"
                style={{ width: '60%' }}
                suggestions={['afc163', 'benjycui', 'yiminghe', 'jljsj33', 'dqaria', 'RaoHai']}
                onSearchChange={this.onSearchChange}
                onSelect={this.onSelect}
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
        </Modal>
      </PageHeaderLayout>
    );
  }
}
