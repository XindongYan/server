import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Button, Tag, Card, Input, message, Avatar, Row, Col, Divider, Radio } from 'antd';
import styles from './DarenList.less';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const Search = Input.Search;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@connect(state => ({
  darenLives: state.daren.darenLives,
  loading: state.daren.darenLivesLoading,
  currentUser: state.user.currentUser,
}))

export default class DarenLiveList extends PureComponent {
  state = {
    searchValue: '',
    y: document.body.clientHeight - 210,
    cycle: 'day',
  }
  componentDidMount() {
    const { darenLives: { pagination } } = this.props;
    this.props.dispatch({
      type: 'daren/fetchDarenLives',
      payload: { ...pagination },
    });
    document.body.onresize = () => {
      this.setState({ y: document.body.clientHeight - 210 });
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ y: document.body.clientHeight - 210 });
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
      type: 'daren/fetchDarenLives',
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
    this.setState({ searchValue: e.target.value });
  }
  handleSearch = (value, name) => {
    const { dispatch, currentUser, darenLives: { pagination } } = this.props;
    const values = {
      currentPage: 1,
      pageSize: pagination.pageSize,
      search: this.state.searchValue,
    };

    values[name] = value;
    dispatch({
      type: 'daren/fetchDarenLives',
      payload: values,
    });
  }
  changeCycleStatus = (e) => {
    this.setState({ cycle: e.target.value });
  }
  render() {
    const { darenLives, loading,  } = this.props;
    const { cycle } = this.state;
    const columns = [{
      title: '达人账号',
      dataIndex: 'attributes',
      width: 160,
      render: (val, record) =>
        <Row>
          <Col span={8}>
            <Avatar size="large" shape="square" style={{ backgroundColor: '#87d068' }} icon="user" src={record.headFullUrl}/>
          </Col>
          <Col span={16}>
            <Row><strong>{record.nick}</strong></Row>
            <Row>{record.area}</Row>
            { val && <Row>{val.creator_type}</Row> }
          </Col>
        </Row>
      ,
    }, {
      title: '粉丝数',
      dataIndex: 'darenMissionData.fansCount',
      sorter: true,
      width: 70,
    }, {
      title: '人气',
      dataIndex: 'hongbei.hotsnum',
      sorter: true,
      width: 70,
    }, {
      title: '观看人数/小时',
      dataIndex: `hongbei.${cycle}.base.watches_avg_hour`,
      sorter: true,
      width: 70,
    }, {
      title: '评论数/小时',
      dataIndex: `hongbei.${cycle}.base.cmt_avg_hour`,
      sorter: true,
      width: 70,
    }, {
      title: '评论人数/小时',
      dataIndex: `hongbei.${cycle}.base.cmt_user_avg_hour`,
      sorter: true,
      width: 70,
    }, {
      title: '商品点击次数/小时',
      dataIndex: `hongbei.${cycle}.base.trade_show_avg_hour`,
      sorter: true,
      width: 70,
    }, {
      title: '商品点击人数/小时',
      dataIndex: `hongbei.${cycle}.base.trade_show_uv_avg_hour`,
      sorter: true,
      width: 70,
    }, {
      title: '关注人数/小时',
      dataIndex: `hongbei.${cycle}.base.followers_avg_hour`,
      sorter: true,
      width: 70,
    }];
    return (
      <Card bordered={false} bodyStyle={{ padding: '10px 2px 2px 0px', height: '100%' }}>
        <div className={styles.tableList}>
          <div className={styles.tableListOperator}>
            <RadioGroup value={cycle} style={{ marginLeft: 8 }} onChange={this.changeCycleStatus}>
              <RadioButton value="day">昨日</RadioButton>
              <RadioButton value="week">上周</RadioButton>
            </RadioGroup>
            <Search
              style={{ width: 400, float: 'right' }}
              placeholder="昵称"
              value={this.state.searchValue}
              onChange={this.handleChange}
              onSearch={(value) => this.handleSearch(value, 'search')}
              enterButton
            />
          </div>
          <Table
            loading={loading}
            dataSource={darenLives.list}
            columns={columns}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              ...darenLives.pagination,
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