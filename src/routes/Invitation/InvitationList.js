import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Icon, Table, Button, Badge, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './InvitationList.less';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  invitation: state.invitation,
  teamUser: state.user.teamUser,
}))
export default class TableList extends PureComponent {
  state = {
    addInputValue: '',
    modalVisible: false,
    selectedRows: [],
    selectedRowKeys: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch, teamUser } = this.props;
    if (teamUser.team_id) {
      dispatch({
        type: 'invitation/fetch',
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
        type: 'invitation/fetch',
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
      type: 'invitation/fetch',
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
        type: 'invitation/fetch',
        payload: values,
      });
    });
  }


  handleRowSelectChange = (selectedRowKeys, selectedRows) => {

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys });
  }
  handleAddInvitationCodes = () => {
    const { dispatch, teamUser } = this.props;
    dispatch({
      type: 'invitation/add',
      payload: {
        team_id: teamUser.team_id,
        user_id: teamUser.user_id,
        num: 5,
      },
    });
  }
  render() {
    const { invitation: { loading, data: { list, pagination } } } = this.props;
    const { selectedRows, selectedRowKeys } = this.state;

    const columns = [
      {
        title: '邀请码',
        dataIndex: 'code',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (val) => {
          if (val === 1) {
            return '未使用';
          } else if (val === 2) {
            return '已使用';
          } else {
            return val;
          }
        }
      },
      {
        title: '使用者',
        dataIndex: 'user_id.name',
        render: (val) => {
          return val;
        }
      },
      {
        title: '使用时间',
        dataIndex: 'use_time',
        render: val => val ? <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span> : '',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
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
        <Card bordered={false} bodyStyle={{ padding: 10 }}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleAddInvitationCodes()}>添加</Button>
            </div>
            <Table
              loading={loading}
              rowSelection={rowSelection}
              dataSource={list}
              columns={columns}
              pagination={paginationProps}
              onChange={this.handleStandardTableChange}
              rowKey="_id"
              rowClassName={(record) => {
                if (record.status === 2) return styles.used;
                else return '';
              }}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
