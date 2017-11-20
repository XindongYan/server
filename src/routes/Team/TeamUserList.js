import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Icon, Table, Avatar, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TeamList.less';

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


  handleRowSelectChange = (selectedRowKeys, selectedRows) => {

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys });
  }
  render() {
    const { team: { loading, data: { list, pagination } } } = this.props;
    const { selectedRows, selectedRowKeys } = this.state;

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
        <Card bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.tableList}>
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
