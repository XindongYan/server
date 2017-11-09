import React, { PureComponent } from 'react';
import moment from 'moment';
import { Table, Alert, Badge } from 'antd';
import styles from './index.less';
import { RIGHTS, APPROVE_ROLES, ROLES } from '../../constants';

const statusMap = ['default', 'processing', 'success', 'error'];
class StandardTable extends PureComponent {
  state = {
    selectedRowKeys: [],
  };

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  render() {
    const { selectedRowKeys } = this.state;
    const { data: { list, pagination }, loading } = this.props;

    const status = ['关闭', '运行中', '已上线', '异常'];

    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '权限',
        dataIndex: 'rights',
        render(val) {
          return val.map(item => RIGHTS.find(item1 => item1.value === item).label).join(',');
        },
      },
      {
        title: '审批角色',
        dataIndex: 'approve_role',
        render(val) {
          return val.map(item => APPROVE_ROLES.find(item1 => item1.value === item).label).join(',');
        },
      },
      {
        title: '角色',
        dataIndex: 'role',
        render(val) {
          return val.map(item => ROLES.find(item1 => item1.value === item).label).join(',');
        },
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '注册IP',
        dataIndex: 'reg_ip',
      },
      {
        title: '最近登录时间',
        dataIndex: 'last_login_time',
        sorter: true,
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      },
      {
        title: '最近登录IP',
        dataIndex: 'last_login_ip',
      },
      {
        title: '操作',
        render: (record) => (
          <p>
            <a onClick={() => this.props.onUpdateUser(record)}>配置</a>
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
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={(
              <p>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                总计 <span style={{ fontWeight: 600 }}>{pagination.total}</span>
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>清空</a>
              </p>
            )}
            type="info"
            showIcon
          />
        </div>
        <Table
          loading={loading}
          rowKey={record => record.key}
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          rowKey="_id"
        />
      </div>
    );
  }
}

export default StandardTable;
