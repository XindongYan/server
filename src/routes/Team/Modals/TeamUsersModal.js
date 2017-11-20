import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Modal, Table, Avatar, message } from 'antd';
@connect(state => ({
  teamUsers: state.team.teamUsers,
  loading: state.team.teamUsersLoading,
  visible: state.team.teamUsersModalVisible,
}))
export default class TeamUsersModal extends PureComponent {
  state = {
    
  }

  componentDidMount() {
    const { dispatch } = this.props;
  }

  handleSelectRows = (rows) => {

  }

  handleSearch = (e) => {
    
  }
  handleTableChange = (pagination, filtersArg, sorter) => {
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
      type: 'team/fetchTeamUsers',
      payload: params,
    });
  }
  handleClose = () => {
    this.props.dispatch({
      type: 'team/toggleTeamUsersModal',
      payload: false,
    });
  }
  render() {
    const { teamUsers: { list, pagination }, visible, loading } = this.props;

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
    return (
      <Modal
        width="100%"
        height="100%"
        style={{ top: 0 }}
        bodyStyle={{ padding: 10 }}
        title="团队成员"
        visible={visible}
        onOk={this.handleAdd}
        onCancel={() => this.handleClose()}
        footer={null}
      >
        <Table
        loading={loading}
        columns={columns} dataSource={list}
        pagination={paginationProps} onChange={this.handleTableChange}
        rowKey="_id"/>
      </Modal>
    );
  }
}
