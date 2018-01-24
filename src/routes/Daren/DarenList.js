import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Button, Tag, Card, Select, Input, message, Avatar, Row, Col, Divider } from 'antd';
import styles from './DarenList.less';
import ChartPopover from './ChartPopover';

const COLORS = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
const AREAS = [{
  "text": "全部领域", "value": ""
}, {
  "text": "时尚车主", "value": "时尚车主"
}, {
  "text": "居家巧匠", "value": "居家巧匠"
}, {
  "text": "户外行者", "value": "户外行者"
}, {
  "text": "数码极客", "value": "数码极客"
}, {
  "text": "文娱先锋", "value": "文娱先锋"
}, {
  "text": "潮女搭配师", "value": "潮女搭配师"
}, {
  "text": "型男塑造师", "value": "型男塑造师"
}, {
  "text": "美食专家", "value": "美食专家"
}, {
  "text": "美妆老师", "value": "美妆老师"
}, {
  "text": "母婴顾问", "value": "母婴顾问"
}, {
  "text": "其他", "value": "其他"
}];
const CREATOR_TYPES = [{
  "text": "全部身份",
  "value": ""
}, {
  "text": "明星",
  "value": "明星"
}, {
  "text": "红人",
  "value": "红人"
}, {
  "text": "二次元大神",
  "value": "二次元大神"
}, {
  "text": "网站App",
  "value": "网站App"
}, {
  "text": "文创先锋",
  "value": "文创先锋"
}, {
  "text": "数码极客",
  "value": "数码极客"
}, {
  "text": "媒体",
  "value": "媒体"
}, {
  "text": "美妆专家",
  "value": "美妆专家"
}, {
  "text": "居家美学家",
  "value": "居家美学家"
}, {
  "text": "淘女郎",
  "value": "淘女郎"
}, {
  "text": "美食家",
  "value": "美食家"
}, {
  "text": "时尚咖",
  "value": "时尚咖"
}, {
  "text": "母婴顾问",
  "value": "母婴顾问"
}, {
  "text": "汽车专家",
  "value": "汽车专家"
}, {
  "text": "自媒体",
  "value": "自媒体"
}, {
  "text": "户外运动玩家",
  "value": "户外运动玩家"
}, {
  "text": "其他",
  "value": "其他"
}];
const CHANNELS = [{
  "text": "全部渠道", "value": ""
}, {
  "text": "单身贵族", "value": "单身贵族"
}, {
  "text": "科技前沿", "value": "科技前沿"
}, {
  "text": "装备天地", "value": "装备天地"
}, {
  "text": "家有萌娃", "value": "家有萌娃"
}, {
  "text": "必买清单", "value": "必买清单"
}, {
  "text": "有好货", "value": "有好货"
}, {
  "text": "爱逛街", "value": "爱逛街"
}, {
  "text": "淘宝头条", "value": "淘宝头条"
}, {
  "text": "生活研究所", "value": "生活研究所"
}, {
  "text": "淘宝直播", "value": "淘宝直播"
}, {
  "text": "品质好物", "value": "品质好物"
}, {
  "text": "淘宝短视频", "value": "淘宝短视频"
}, {
  "text": "极有家", "value": "极有家"
}, {
  "text": "二人世界", "value": "二人世界"
}, {
  "text": "ifashion", "value": "ifashion"
}, {
  "text": "潮男养成", "value": "潮男养成"
}, {
  "text": "每日好店", "value": "每日好店"
}, {
  "text": "新选大赏", "value": "新选大赏"
}];

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const Search = Input.Search;
const { Option } = Select;

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
    const { darens: { pagination, creator_type, area, channel } } = this.props;
    this.props.dispatch({
      type: 'daren/fetchDarens',
      payload: { ...pagination, creator_type, area, channel },
    });
    document.body.onresize = () => {
      this.setState({ y: document.body.clientHeight - 196 });
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ y: document.body.clientHeight - 196 });
  }
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, darens: { creator_type, area, channel } } = this.props;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      creator_type, area, channel,
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
    this.setState({ searchValue: e.target.value });
  }
  handleSearch = (value, name) => {
    const { dispatch, currentUser, darens: { pagination, creator_type, area, channel } } = this.props;
    const values = {
      creator_type, area, channel,
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
      title: '粉丝分析',
      dataIndex: 'fans_data',
      width: 100,
      render: (val, record) => {
        if (val) {
          return (
            <div>
              <p>
              {val.gender && val.gender.length > 0 &&
                <ChartPopover data={{ list: val.gender, field: 'gender', title: '性别比例', _id: record._id }}>
                  <a>性别</a>
                </ChartPopover>}
              {val.gender && val.gender.length > 0 && val.age && val.age.length > 0 && <Divider type="vertical" />}
              {val.age && val.age.length > 0 &&
                <ChartPopover data={{ list: val.age, field: 'age', title: '年龄比例', _id: record._id }}>
                  <a>年龄</a>
                </ChartPopover>}
              </p>
              <p>
              {val.interest && val.interest.length > 0 &&
                <ChartPopover data={{ list: val.interest, field: 'interest', title: '生活偏好', _id: record._id }}>
                  <a>生活</a>
                </ChartPopover>}
              {val.interest && val.interest.length > 0 && val.cate && val.cate.length > 0 &&  <Divider type="vertical" />}
              {val.cate && val.cate.length > 0 &&
                <ChartPopover data={{ list: val.cate, field: 'cate', title: '类目偏好', _id: record._id }}>
                  <a>类目</a>
                </ChartPopover>}
              </p>
              <p>
              {val.women && val.women.length > 0 &&
                <ChartPopover data={{ list: val.women, field: 'women', title: '女装风格偏好', _id: record._id }}>
                  <a>风格</a>
                </ChartPopover>}
              {val.women && val.women.length > 0 && val.area && val.area.length > 0 &&  <Divider type="vertical" />}
              {val.area && val.area.length > 0 &&
                <ChartPopover data={{ list: val.area, field: 'area', title: '粉丝地域分布', _id: record._id }}>
                  <a>地域</a>
                </ChartPopover>}
                </p>
            </div>
          );
        }
        return '';
      },
    }, {
      title: '粉丝数',
      dataIndex: 'darenMissionData.fansCount',
      sorter: true,
      width: 70,
    }, {
      title: '粉丝月增长数',
      width: 70,
      sorter: true,
    }, {
      title: '最近7天PV',
      width: 70,
      dataIndex: 'read_data_num',
      sorter: true,
    }, {
      title: '直播平均PV',
      width: 70,
      dataIndex: 'liveVideosAvgTotalJoinCount',
      sorter: true,
    }, {
      title: '合作商家数',
      dataIndex: 'darenMissionData.cooperateSellerCount',
      sorter: true,
      width: 70,
    }, {
      title: '累计任务数',
      dataIndex: 'darenMissionData.completeMission',
      sorter: true,
      width: 70,
    }, {
      title: '平均接单率',
      dataIndex: 'darenMissionData.receiveRate',
      sorter: true,
      width: 70,
      render: (val) => val ? `${val}%` : '',
    }, {
      title: '平均完成率',
      dataIndex: 'darenMissionData.completeRate',
      sorter: true,
      width: 70,
      render: (val) => val ? `${val}%` : '',
    }, {
      title: '合作渠道数',
      dataIndex: 'channelAbilitysLength',
      sorter: true,
      width: 70,
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
          <div className={styles.tableListOperator}>
            <Select
              allowClear
              showSearch
              style={{ width: 160, marginLeft: 8 }}
              placeholder="身份"
              value={darens.creator_type}
              onChange={(value) => this.handleSearch(value,'creator_type')}
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              { CREATOR_TYPES.map(item => <Option key={item.value} value={item.value}>{item.text}</Option>) }
            </Select>
            <Select
              allowClear
              showSearch
              style={{ width: 160, marginLeft: 8 }}
              placeholder="领域"
              value={darens.area}
              onChange={(value) => this.handleSearch(value,'area')}
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              { AREAS.map(item => <Option key={item.value} value={item.value}>{item.text}</Option>) }
            </Select>
            <Select
              allowClear
              showSearch
              style={{ width: 160, marginLeft: 8 }}
              placeholder="渠道"
              value={darens.channel}
              onChange={(value) => this.handleSearch(value,'channel')}
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              { CHANNELS.map(item => <Option key={item.value} value={item.value}>{item.text}</Option>) }
            </Select>
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