import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Button, Tag, Card, Select, Input, message, Avatar, Row, Col } from 'antd';
import styles from './DarenList.less';

const COLORS = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const Search = Input.Search;

@connect(state => ({
  darens: state.tool.darens,
  loading: state.tool.darensLoading,
  currentUser: state.user.currentUser,
}))

export default class DarenList extends PureComponent {
  state = {
    searchValue: '',
  }
  componentDidMount() {
    const { darens: { pagination } } = this.props;
    this.props.dispatch({
      type: 'tool/fetchDarens',
      payload: { ...pagination },
    });
  }
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
      search: this.state.searchValue,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'tool/fetchDarens',
      payload: params,
    });
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  }
  handleChange = (e) => {
    if (!e.target.value) {
      this.handleSearch(e.target.value, 'search')
    }
  }
  handleSearch = (value, name) => {
    const { dispatch, currentUser, darens: { pagination } } = this.props;
    const values = {
      currentPage: 1,
      pageSize: pagination.pageSize,
      search: this.state.searchValue,
    };

    values[name] = value;
    dispatch({
      type: 'tool/fetchDarens',
      payload: values,
    });
  }

  render() {
    const { darens, loading,  } = this.props;

    const columns = [{
      title: '达人账号',
      dataIndex: 'headFullUrl',
      width: 280,
      fixed: 'left',
      render: (val, record) =>
        <Row>
          <Col span={4}>
            <Avatar shape="square" style={{ backgroundColor: '#87d068' }} icon="user" src={val}/>
          </Col>
          <Col span={20}>
            <Row><strong>{record.nick}</strong></Row>
            <Row>{record.attributes.role}</Row>
            <Row>{record.attributes.creator_type}</Row>
          </Col>
        </Row>
      ,
    }, {
      title: '粉丝数',
      dataIndex: 'darenMissionData.fansCount',
      sorter: true,
      width: 100,
    }, {
      title: '粉丝月增长数',
      width: 100,
    }, {
      title: '最近7天PV',
      width: 100,
    }, {
      title: '直播平均PV',
      width: 100,
    }, {
      title: '合作商家数',
      dataIndex: 'darenMissionData.cooperateSellerCount',
      sorter: true,
      width: 100,
    }, {
      title: '历史任务均价',
      dataIndex: 'darenMissionData.avgFee',
      sorter: true,
      width: 100,
    }, {
      title: '累计任务数',
      dataIndex: 'darenMissionData.completeMission',
      sorter: true,
      width: 100,
    }, {
      title: '评价',
      dataIndex: 'darenMissionData.score',
      sorter: true,
      width: 100,
    }, {
      title: '平均接单率',
      dataIndex: 'darenMissionData.receiveRate',
      sorter: true,
      width: 100,
    }, {
      title: '平均完成率',
      dataIndex: 'darenMissionData.completeRate',
      sorter: true,
      width: 100,
    }, {
      title: '合作渠道数',
      key: 'channelAbilitys.lenght',
      width: 100,
      // fixed: 'right',
      render: (record) => record.channelAbilitys.length,
    }, {
      title: '合作渠道',
      dataIndex: 'channelAbilitys',
      width: 200,
      // fixed: 'right',
      render: (val) => {
        return val.map((item, index) => <Tag key={index} color={COLORS[index]}>{item.channelName}</Tag>);
      },
    }];
    return (
      <Card bordered={false} bodyStyle={{ padding: 14 }}>
        <div className={styles.tableList}>
          <div className={styles.tableListOperator} align="right">
            <Search
              style={{ width: 260}}
              placeholder="昵称"
              onChange={this.handleChange}
              onSearch={(value) => this.handleSearch(value, 'search')}
              enterButton
            />
          </div>
          <Table
            loading={loading}
            dataSource={darens.list}
            columns={columns}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              ...darens.pagination,
            }}
            onChange={this.handleStandardTableChange}
            rowKey="_id"
            scroll={{ x: columns.map(item => item.width).reduce((a, b) => a + b, 0) }}
          />
        </div>
      </Card>
    );
  }
}