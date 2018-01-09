import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Icon, Table, Button, Badge, message, Radio } from 'antd';
import { INVITATION_ROLE } from '../../constants';
import styles from './InvitationList.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
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
    tabValue: INVITATION_ROLE.writer,
  };

  componentDidMount() {
    const { dispatch, teamUser } = this.props;
    if (teamUser.team_id) {
      dispatch({
        type: 'invitation/fetchInvitation',
        payload: {
          team_id: teamUser.team_id,
          user_id: teamUser.user_id,
          role: INVITATION_ROLE.writer,
        },
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, teamUser } = nextProps;
    if (teamUser.team_id !== this.props.teamUser.team_id) {
      dispatch({
        type: 'invitation/fetchInvitation',
        payload: {
          team_id: teamUser.team_id,
          user_id: teamUser.user_id,
          role: INVITATION_ROLE.writer,
        },
      });
    }
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, teamUser } = this.props;
    const { formValues, tabValue } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      team_id: teamUser.team_id,
      user_id: teamUser.user_id,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      role: tabValue,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'invitation/fetchInvitation',
      payload: params,
    });
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
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
    const { tabValue } = this.state;
    dispatch({
      type: 'invitation/add',
      payload: {
        team_id: teamUser.team_id,
        user_id: teamUser.user_id,
        num: 5,
        role: tabValue,
      },
    });
  }
  changeTab = (e) => {
    const { dispatch, teamUser } = this.props;
    this.setState({
      tabValue: e.target.value,
    },() => {
      dispatch({
        type: 'invitation/fetchInvitation',
        payload: {
          team_id: teamUser.team_id,
          user_id: teamUser.user_id,
          role: e.target.value,
        },
      });
    })
  }
  render() {
    const { invitation: { loading, Invitations: { list, pagination } } } = this.props;
    const { selectedRows, selectedRowKeys, tabValue } = this.state;
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
        dataIndex: 'user_id.nickname',
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
        title: '创建者',
        dataIndex: 'creator_id.nickname',
        render: (val) => {
          return val;
        }
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
          <RadioGroup value={tabValue} onChange={(e) => this.changeTab(e)}>
            <RadioButton value={INVITATION_ROLE.writer}>写手</RadioButton>
            <RadioButton value={INVITATION_ROLE.cooperative}>合作伙伴</RadioButton>
            <RadioButton value={INVITATION_ROLE.business}>商家</RadioButton>
            <RadioButton value={INVITATION_ROLE.daren}>达人</RadioButton>
          </RadioGroup>
        </div>
        <Card bordered={false} bodyStyle={{ padding: 10 }}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleAddInvitationCodes()}>生成5个邀请码</Button>
            </div>
            <Table
              loading={loading}
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
      </div>
    );
  }
}
