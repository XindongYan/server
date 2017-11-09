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
        title: '稿子ID',
        dataIndex: 'id',
      },
      {
        title: '内容标题',
        dataIndex: 'title',
      },
      {
        title: '提交时间',
        dataIndex: 'last_update_time',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '修改',
        dataIndex: 'update_times',
      },
      {
        title: '写手',
        dataIndex: 'publisher_id',
        sorter: true,
        render: val => val ? val.name : '',
      },
      {
        title: '发布渠道',
        dataIndex: 'channel_name',
        render: val => val[0] || '',
      },
      {
        title: '商家标签',
        dataIndex: 'merchant_tag',
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
