import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Button, Tag, Card, Select, Input, message, Avatar, Row, Col } from 'antd';
import styles from './DarenList.less';
import ChartPopover from './ChartPopover';

const COLORS = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const Search = Input.Search;

@connect(state => ({
  darens: state.daren.darens,
  loading: state.daren.darensLoading,
  currentUser: state.user.currentUser,
}))

export default class DarenList extends PureComponent {
  state = {
    searchValue: '',
    y: document.body.clientHeight - 196,
  }
  componentDidMount() {
    const { darens: { pagination } } = this.props;
    this.props.dispatch({
      type: 'daren/fetchDarens',
      payload: { ...pagination },
    });
    document.body.onresize = () => {
      this.setState({ y: document.body.clientHeight - 196 });
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ y: document.body.clientHeight - 196 });
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
      type: 'daren/fetchDarens',
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
      type: 'daren/fetchDarens',
      payload: values,
    });
  }

  render() {
    const { darens, loading,  } = this.props;

    const columns = [{
      title: '达人账号',
      dataIndex: 'headFullUrl',
      width: 250,
      render: (val, record) =>
        <a href={`https://v.taobao.com/n/author/homepage?&userId=${record.userId}`} target="_blank">
          <Row>
            <Col span={5}>
              <Avatar shape="square" style={{ backgroundColor: '#87d068' }} icon="user" src={val}/>
            </Col>
            <Col span={19}>
              <Row><strong>{record.nick}</strong></Row>
              <Row>{record.attributes.role}</Row>
              <Row>{record.attributes.creator_type}</Row>
            </Col>
          </Row>
        </a>
      ,
    }, {
      title: '粉丝分析',
      dataIndex: 'fans_data',
      width: 100,
      render: (val, record) => {
        if (val) {
          return (
            <div>
              {val.gender && val.gender.length > 0 &&
                <ChartPopover data={{ list: val.gender, field: 'gender', title: '性别比例', _id: record._id }}>
                  <p><a>性别比例</a></p>
                </ChartPopover>}
              {val.age && val.age.length > 0 &&
                <ChartPopover data={{ list: val.age, field: 'age', title: '年龄比例', _id: record._id }}>
                  <p><a>年龄比例</a></p>
                </ChartPopover>}
              {val.interest && val.interest.length > 0 &&
                <ChartPopover data={{ list: val.interest, field: 'interest', title: '生活偏好', _id: record._id }}>
                  <p><a>生活偏好</a></p>
                </ChartPopover>}
              {val.cate && val.cate.length > 0 &&
                <ChartPopover data={{ list: val.cate, field: 'cate', title: '类目偏好', _id: record._id }}>
                  <p><a>类目偏好</a></p>
                </ChartPopover>}
              {val.women && val.women.length > 0 &&
                <ChartPopover data={{ list: val.women, field: 'women', title: '女装风格偏好', _id: record._id }}>
                  <p><a>女装风格偏好</a></p>
                </ChartPopover>}
              {val.area && val.area.length > 0 &&
                <ChartPopover data={{ list: val.area, field: 'area', title: '粉丝地域分布', _id: record._id }}>
                  <p><a>粉丝地域分布</a></p>
                </ChartPopover>}
            </div>
          );
        }
        return '';
      },
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
      dataIndex: 'read_data',
      render: (val) => {
        if (val && val[0]) return val[0].value;
        return '';
      },
    }, {
      title: '直播平均PV',
      width: 100,
      dataIndex: 'liveVideos',
      render: (val) => {
        if (val && val.length > 0) return Math.ceil(val.map(item => item.totalJoinCount).reduce((a, b) => a + b, 0) / val.length);
        return '';
      },
    }, {
      title: '合作商家数',
      dataIndex: 'darenMissionData.cooperateSellerCount',
      sorter: true,
      width: 100,
    }, {
      title: '累计任务数',
      dataIndex: 'darenMissionData.completeMission',
      sorter: true,
      width: 100,
    }, {
      title: '平均接单率',
      dataIndex: 'darenMissionData.receiveRate',
      sorter: true,
      width: 100,
      render: (val) => val ? `${val}%` : '',
    }, {
      title: '平均完成率',
      dataIndex: 'darenMissionData.completeRate',
      sorter: true,
      width: 100,
      render: (val) => val ? `${val}%` : '',
    }, {
      title: '合作渠道数',
      dataIndex: 'channelAbilitysLength',
      sorter: true,
      width: 100,
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
      <Card bordered={false} bodyStyle={{ padding: '5px 2px 2px 0px', height: '100%' }}>
        <div className={styles.tableList}>
          <div className={styles.tableListOperator} align="right">
            <Search
              style={{ width: 400}}
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
            scroll={{ y: this.state.y }}
          />
        </div>
      </Card>
    );
  }
}