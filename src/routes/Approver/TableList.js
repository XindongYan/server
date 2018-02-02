import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Input, Select, Icon, Button, Menu, Checkbox, message, Radio, Popconfirm, DatePicker,
Tooltip, Divider, Form, Modal } from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';
import { RIGHTS, APPROVE_ROLES, ROLES, TASK_APPROVE_STATUS, CHANNEL_NAMES, ORIGIN, RIGHT } from '../../constants';
import TaskNameColumn from '../../components/TaskNameColumn';
import TaskStatusColumn from '../../components/TaskStatusColumn';
import PublisherChannelsPopover from '../../components/PublisherChannelsPopover';
import DockPanel from '../../components/DockPanel';
import Extension from '../../components/Extension';
import styles from './TableList.less';
import { queryConvertedTasks } from '../../services/task';

const { RangePicker } = DatePicker;
const Search = Input.Search;
const { Option } = Select;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
function onChange(date, dateString) {
  console.log(date, dateString);
}
@connect(state => ({
  data: state.task.approverTask,
  loading: state.task.approverTaskLoading,
  currentUser: state.user.currentUser,
  teamUser: state.user.teamUser,
  teamUsers: state.team.data.list,
  suggestionUsers: state.team.suggestionUsers,
}))
@Form.create()

export default class TableList extends PureComponent {
  state = {
    nicaiCrx: null,
    version: '',
    modalVisible: false,
    selectedRows: [],
    selectedRowKeys: [],
    user_id: '',
    darenModalVisible: false,
    extension: '',
    extensionVisible: false,
    percent: 0,
    queue: [],
    queueNumber: 0,
    channel_list: [],
  }

  componentDidMount() {
    const { dispatch, data: { pagination, approve_status }, currentUser, teamUser } = this.props;
    if (currentUser._id) {
      dispatch({
        type: 'task/fetchApproverTasks',
        payload: { ...pagination, approve_status, user_id: currentUser._id, team_id: teamUser.team_id, }
      });
    }
    if (teamUser.team_id) {
      if (currentUser.rights.indexOf(RIGHT.teamAdmin) >= 0) {
        dispatch({
          type: 'team/fetch',
          payload: {
            team_id: teamUser.team_id,
            currentPage: 1,
            pageSize: 99999999,
          },
        });
      }
    }
    const nicaiCrx = document.getElementById('nicaiCrx');
    nicaiCrx.addEventListener('publishResult', this.publishResult);
    nicaiCrx.addEventListener('setVersion', this.setVersion);
    nicaiCrx.addEventListener('setChannel', this.setChannel);
    if (!this.state.nicaiCrx) {
      this.setState({ nicaiCrx }, () => {
        setTimeout(() => {
          this.handleGetVersion();
        }, 1000);
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, data: { pagination, approve_status }, currentUser, teamUser } = nextProps;
    if (currentUser._id !== this.props.currentUser._id) {
      dispatch({
        type: 'task/fetchApproverTasks',
        payload: { ...pagination, approve_status, user_id: currentUser._id, team_id: teamUser.team_id, }
      });
    }
    if (teamUser.team_id !== this.props.teamUser.team_id) {
      if (currentUser.rights.indexOf(RIGHT.teamAdmin) >= 0) {
        dispatch({
          type: 'team/fetch',
          payload: {
            team_id: teamUser.team_id,
            currentPage: 1,
            pageSize: 99999999,
          },
        });
      }
    }
  }
  componentWillUnmount() {
    const nicaiCrx = document.getElementById('nicaiCrx');
    nicaiCrx.removeEventListener('publishResult', this.publishResult);
    nicaiCrx.removeEventListener('setVersion', this.setVersion);
  }
  publishResult = (e) => {
    const data = JSON.parse(e.target.innerText);
    message.destroy();
    if (data.error) {
      message.error(data.msg);
    } else {
      if (this.state.queue && this.state.queue.length > 0) {
        const n = ((this.state.queueNumber - this.state.queue.length) / this.state.queueNumber) * 100;
        setTimeout(() => {
          this.handlePublishToTaobao(this.state.queue[0]);
          const arr = this.state.queue;
          arr.splice(0, 1);
          this.setState({
            queue: [ ...arr ],
            percent: n,
          })
        },1000)
      } else {
        this.setState({
          publishVisible: false,
        });
        this.handleRowSelectChange([], []);
        message.success(data.msg);
        this.handleFetch();
      }
    }
  }
  setVersion = (e) => {
    const data = JSON.parse(e.target.innerText);
    if (data.version) {
      this.setState({
        version: data.version,
      })
    }
    if (data.error) {
      message.destroy();
      message.warn(data.msg, 60 * 60);
      this.setState({
        actsLoading: false,
      });
    } else {
      this.handleGetChannel();
    }
  }
  setChannel = (e) => {
    const data = JSON.parse(e.target.innerText);
    if (data.itemList) {
      this.setState({
        channel_list: data.itemList,
      });
      this.state.nicaiCrx.removeEventListener('setChannel', this.setChannel);
    }
  }
  handleGetVersion = () => {
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getVersion', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  handleGetChannel = () => {
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getChannel', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  handleFetch = () => {
    const { data: { pagination, approve_status }, dispatch, currentUser, teamUser } = this.props;
    dispatch({
      type: 'task/fetchApproverTasks',
      payload: { ...pagination, user_id: this.state.user_id || currentUser._id, approve_status, team_id: teamUser.team_id, }
    });
  }
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, currentUser, teamUser, data: { approve_status } } = this.props;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      team_id: teamUser.team_id,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      user_id: this.state.user_id || currentUser._id,
      approve_status,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'task/fetchApproverTasks',
      payload: params,
    });
  }
  handlePublish = async (record) => {
    const { version } = this.state;
    if (version && version.length > 0) {
      const arr = version.split('.');
      const versionNumber = Number(arr[0]) * 100 + Number(arr[1]) * 10 + Number(arr[2]);
      if (versionNumber < 108) { // 1.0.4
        message.warn('请更新插件！');
      } else {
        const tasks = await queryConvertedTasks({
          _ids: JSON.stringify([record._id]),
        });
        if (tasks.list[0].channel_name === '微淘') {
          this.handlePublishToTaobao({ ...tasks.list[0].weitao, _id: tasks.list[0]._id, channel_name: tasks.list[0].channel_name});
        } else if (tasks.list[0].channel_name === '淘宝头条') {
          this.handlePublishToTaobao({ ...tasks.list[0].toutiao, _id: tasks.list[0]._id, channel_name: tasks.list[0].channel_name});
        }
        message.destroy();
        message.loading('发布中 ...', 60);
      }
    } else {
      message.destroy();
      message.warn('请安装尼采创作平台插件并用淘宝授权登录！', 60 * 60);
    }
  }
  handlePublishToTaobao = (task) => {
    const { currentUser } = this.props;
    this.state.nicaiCrx.innerText = JSON.stringify({ task: task, user: currentUser, channel_name: task.channel_name });
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('publishToTaobao', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  handleSelectTeamUser = (value) => {
    this.setState({ user_id: value });
    const { data: { pagination, approve_status }, dispatch, teamUser } = this.props;
    dispatch({
      type: 'task/fetchApproverTasks',
      payload: { ...pagination, user_id: value, approve_status, team_id: teamUser.team_id, }
    });
  }
  handleChangeTeamUser = (value) => {
    if (!value) {
      this.setState({ user_id: '' });
      const { data: { pagination, approve_status }, dispatch, currentUser, teamUser } = this.props;
      dispatch({
        type: 'task/fetchApproverTasks',
        payload: { ...pagination, user_id: currentUser._id, approve_status, team_id: teamUser.team_id, }
      });
    }
  }
  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  }
  handleSearch = (value, name) => {
    const { dispatch, data: { pagination, approve_status }, currentUser, teamUser } = this.props;
    const values = {
      user_id: this.state.user_id || currentUser._id,
      approve_status,
    };
    if(name === 'time') {
      values['handin_time_start'] = value[0] ? value[0].format('YYYY-MM-DD 00:00:00') : '';
      values['handin_time_end'] = value[1] ? value[1].format('YYYY-MM-DD 23:59:59') : '';
    } else {
      values[name] = value;
    }
    dispatch({
      type: 'task/fetchApproverTasks',
      payload: { 
        team_id: teamUser.team_id,
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
        ...values, 
      }
    });
  }

  handleReject = (record) => {
    const { dispatch, data: { pagination, approve_status }, currentUser, teamUser } = this.props;
    dispatch({
      type: 'task/reject',
      payload: { _id: record._id, approver_id: currentUser._id },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          message.success(result.msg);
          dispatch({
            type: 'task/fetchApproverTasks',
            payload: { ...pagination, approve_status, team_id: teamUser.team_id, user_id: this.state.user_id || currentUser._id }
          });
        }
      },
    }); 
  }
  changeApproveStatus = (e) => {
    const { data: { pagination }, dispatch, currentUser, teamUser } = this.props;
    dispatch({
      type: 'task/fetchApproverTasks',
      payload: { ...pagination, team_id: teamUser.team_id, user_id: this.state.user_id || currentUser._id, approve_status: e.target.value, }
    });
  }
  handleShowDockPanel = (record, activeKey) => {
    this.props.dispatch({
      type: 'task/showDockPanel',
      payload: {
        _id: record._id,
        activeKey,
      },
    });
  }

  handleDarenModalVisible = (flag) => {
    this.setState({
      darenModalVisible: !!flag,
    });
  }
  handleSpecifyDaren = () => {
    const { dispatch, currentUser, teamUser, data: { pagination, approve_status } } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err && values.target_user_id.length >= 24) {
        dispatch({
          type: 'project/darenTasks',
          payload: {
            task_ids: this.state.selectedRowKeys,
            user_id: currentUser._id,
            target_user_id: values.target_user_id,
          },
          callback: (result) => {
            if (result.error) {
              message.error(result.msg);
            } else {
              message.success(result.msg);
              this.handleDarenModalVisible(false);
              dispatch({
                type: 'task/fetchApproverTasks',
                payload: { ...pagination, approve_status, team_id: teamUser.team_id, user_id: currentUser._id }
              });
              this.handleRowSelectChange([], []);
            }
          },
        });
      } else {
        message.warn('请选择达人！');
      }
    });
  }
  handleSearchDaren = (value) => {
    const { teamUser } = this.props;
    if (value) {
      this.props.dispatch({
        type: 'team/searchTeamUsers',
        payload: {
          team_id: teamUser.team_id,
          nickname: value,
        }
      });
    }
  }
  render() {
    const { data, loading, currentUser, teamUsers, form: { getFieldDecorator }, suggestionUsers } = this.props;
    const { selectedRows, modalVisible, selectedRowKeys, darenModalVisible, channel_list } = this.state;
    const columns = [
      {
        title: '任务ID',
        width: 80,
        dataIndex: 'id',
        render: (val, record) => <a onClick={() => this.handleShowDockPanel(record, 'DetailPane')}>{val}</a>,
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: 200,
        render: (record, task) => (
          <Link to={`/project/task/view?_id=${task._id}`}>
            <TaskNameColumn text={record} length={10} />
          </Link>
        )
      },
      {
        title: '提交时间',
        dataIndex: 'handin_time',
        render: val => ( 
          val ?
          <Tooltip placement="top" title={moment(val).format('YYYY-MM-DD HH:mm:ss')}>
            {moment(val).fromNow()}
          </Tooltip> : ''
        ),
      },
      {
        title: '修改',
        dataIndex: 'update_times',
      },
      {
        title: '写手',
        dataIndex: 'taker_id',
        render: val => val ? val.nickname : '',
      },
      {
        title: '发布渠道',
        dataIndex: 'channel_name',
        render: val => val || '',
      },
      {
        title: '商家标签',
        dataIndex: 'merchant_tag',
        render: val => val ? <TaskNameColumn text={val} length={10}/> : '',
      },
    ];
    const approver = {
      title: '审核人',
      dataIndex: 'approver_id',
      render: value => value ? value.nickname : '',
    };
    const grade = {
      title: '审核分数',
      dataIndex: 'grade',
      render: value => value < 0 ? 0 : value,
    };
    const approveTime = {
      title: '审核时间',
      dataIndex: 'approve_time',
      render: val => (
        <Tooltip placement="top" title={moment(val).format('YYYY-MM-DD HH:mm:ss')}>
          {moment(val).format('MM/DD')}
        </Tooltip>
      ),
    };
    const status = {
      title: '状态',
      dataIndex: 'approve_status',
      render: val => (<TaskStatusColumn status={val}/>),
    };
    const opera = {
      title: '操作',
      render: (record) => {
        if (record.approve_status === TASK_APPROVE_STATUS.waitingForApprove) {
          if (!record.current_approvers || record.current_approvers.length === 0 || record.current_approvers.indexOf(currentUser._id) >= 0) {
            return (
              <div>
                <a target="_blank" href={`${ORIGIN}/public/task/details?id=${record._id}&channel_name=${record.channel_name}`}>
                  外链
                </a>
                <Divider type="vertical" />
                <Link to={`/approver/task/edit?_id=${record._id}`}>
                  <span>审核</span>
                </Link>
                { record.approve_step === 0 && <span className={styles.splitLine} /> }
                { record.approve_step === 0 && <Popconfirm placement="left" title={`确认退回?`} onConfirm={() => this.handleReject(record)} okText="确认" cancelText="取消">
                  <a>退回</a>
                </Popconfirm> }
              </div>
            );
          } else {
            return (
              <div>
                <a target="_blank" href={`${ORIGIN}/public/task/details?id=${record._id}&channel_name=${record.channel_name}`}>
                  外链
                </a>
                <Divider type="vertical" />
                <Link to={`/approver/task/view?_id=${record._id}`}>
                  <span>详情</span>
                </Link>
              </div>
            );
          }
        } else if(record.approve_status === TASK_APPROVE_STATUS.rejected) {
          return (
            <div>
              <a target="_blank" href={`${ORIGIN}/public/task/details?id=${record._id}&channel_name=${record.channel_name}`}>
                外链
              </a>
              <Divider type="vertical" />
              <Link to={`/approver/task/view?_id=${record._id}`}>
                <span>详情</span>
              </Link>
            </div>
          );
        } else if(record.approve_status === TASK_APPROVE_STATUS.passed) {
          return (
            <div>
              <a target="_blank" href={`${ORIGIN}/public/task/details?id=${record._id}&channel_name=${record.channel_name}`}>
                外链
              </a>
              <Divider type="vertical" />
              <Link to={`/approver/task/edit?_id=${record._id}`}>
                <span>详情</span>
              </Link>
              <Divider type="vertical" />
              <Popconfirm placement="left" title={`确认发布至阿里创作平台?`} onConfirm={() => this.handlePublish(record)} okText="确认" cancelText="取消">
                <a><PublisherChannelsPopover channel_list={channel_list} >发布</PublisherChannelsPopover></a>
              </Popconfirm>
            </div>
          );
        } else if (record.approve_status === TASK_APPROVE_STATUS.waitingToTaobao) {
          return (
            <div>
              <a target="_blank" href={`${ORIGIN}/public/task/details?id=${record._id}&channel_name=${record.channel_name}`}>
                外链
              </a>
              <Divider type="vertical" />
              <Popconfirm placement="left" title={`确认发布至阿里创作平台?`} onConfirm={() => this.handlePublish(record)} okText="确认" cancelText="取消">
                <a><PublisherChannelsPopover channel_list={channel_list} >发布</PublisherChannelsPopover></a>
              </Popconfirm>
            </div>
          );
        } else if (record.approve_status === TASK_APPROVE_STATUS.publishedToTaobao) {
          return (
            <div>
              { record.taobao && record.taobao.url &&
                <a onClick={() => {this.setState({ extension: record.taobao.url, extensionVisible: true })}}>
                  推广
                </a>
              }
              { record.taobao && record.taobao.url &&
                <Divider type="vertical" />
              }
              <a onClick={() => this.handleShowDockPanel(record, 'AnalyzePane')}>
                分析
              </a>
              { record.taobao && record.taobao.url &&
                <Divider type="vertical" />
              }
              {record.taobao && record.taobao.url &&
                <a target="_blank" href={record.taobao ? record.taobao.url : ''}>
                  查看
                </a>
              }
            </div>
          );
        } else if (record.approve_status === TASK_APPROVE_STATUS.taobaoRejected) {
          return (
            <div>
              { record.taobao && record.taobao.url &&
                <a onClick={() => {this.setState({ extension: record.taobao.url, extensionVisible: true })}}>
                  推广
                </a>
              }
              { record.taobao && record.taobao.url &&
                <Divider type="vertical" />
              }
              <a onClick={() => this.handleShowDockPanel(record, 'AnalyzePane')}>
                分析
              </a>
              { record.taobao && record.taobao.url &&
                <Divider type="vertical" />
              }
              {record.taobao && record.taobao.url &&
                <a target="_blank" href={record.taobao ? record.taobao.url : ''}>
                  查看
                </a>
              }
              <Divider type="vertical" />
              <Popconfirm placement="left" title={`将退回给写手?`} onConfirm={() => this.handleReject(record)} okText="确认" cancelText="取消">
                <a>退回</a>
              </Popconfirm>
            </div>
          );
        } else {
          return (
            <div>
              <a onClick={() => {this.setState({ extension: record.taobao.url, extensionVisible: true })}}>
                推广
              </a>
              <Divider type="vertical" />
              <a onClick={() => this.handleShowDockPanel(record, 'AnalyzePane')}>
                分析
              </a>
            </div>
          );
        }
      },
    }
    if (data.approve_status === 'waitingForApprove') {
      columns.push(status, opera);
    } else if (data.approve_status === 'approving') {
      columns.push(status, opera);
    } else {
      columns.push(approver, grade, approveTime, status, opera);
    }
    
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    return (
      <div>
        <div className={styles.searchBox}>
          <RadioGroup value={data.approve_status} onChange={this.changeApproveStatus}>
            <RadioButton value="all">全部</RadioButton>
            <Tooltip placement="top" title="需要你审核的">
              <RadioButton value="waitingForApprove">待审核</RadioButton>
            </Tooltip>
            <Tooltip placement="top" title="多轮审核，当前在由他人审核">
              <RadioButton value="approving">审核中</RadioButton>
            </Tooltip>
            <RadioButton value="rejected">未通过</RadioButton>
            <RadioButton value="passed">已通过</RadioButton>
            <Tooltip placement="top" title="待发布至阿里创作平台">
              <RadioButton value="waitingToTaobao">
                待发布
              </RadioButton>
            </Tooltip>
            <Tooltip placement="top" title="已发布至阿里创作平台">
              <RadioButton value="publishedToTaobao">
                已发布
              </RadioButton>
            </Tooltip>
            <Tooltip placement="top" title="阿里创作平台不通过">
              <RadioButton value="taobaoRejected">
                淘宝不通过
              </RadioButton>
            </Tooltip>
            <Tooltip placement="top" title="阿里创作平台通过">
              <RadioButton value="taobaoAccepted">
                淘宝通过
              </RadioButton>
            </Tooltip>
          </RadioGroup>
          {currentUser.rights && currentUser.rights.indexOf(RIGHT.teamAdmin) >= 0 &&
            <Select
              style={{ width: '30%', marginLeft: 20 }}
              mode="combobox"
              optionLabelProp="children"
              placeholder="搜索审核人员"
              notFoundContent=""
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              allowClear
              onChange={this.handleChangeTeamUser}
              onSelect={this.handleSelectTeamUser}
            >
              {teamUsers.filter(item => item.user_id && item.user_id.rights.indexOf(RIGHT.approver) >= 0)
                .map(item => <Option value={item.user_id._id} key={item.user_id._id}>{item.user_id.nickname}</Option>)}
            </Select>
          }
        </div>
        <Card bordered={false} bodyStyle={{ padding: 14 }}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              { selectedRows.length === 0 && (
                <span>
                  <Select
                    allowClear
                    showSearch
                    style={{ width: 160, marginRight: 8 }}
                    placeholder="渠道"
                    onChange={(value) => this.handleSearch(value,'channel_name')}
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    { CHANNEL_NAMES.map(item => <Option key={item} value={item}>{item}</Option>) }
                  </Select>
                  <RangePicker style={{ width: 240 }} onChange={(value) => this.handleSearch(value,'time')} />
                  <Search
                    style={{ width: 260, float: 'right'}}
                    placeholder="ID／名称／商家标签"
                    onSearch={(value) => this.handleSearch(value, 'search')}
                    enterButton
                  />
                </span>)
              }
              { selectedRows.length > 0 && (
                  <span>
                    <Button icon="user-add" type="default" onClick={() => this.handleDarenModalVisible(true)}>指定达人</Button>
                  </span>
                )
              }
            </div>
            <Table
              loading={loading}
              rowKey={record => record.key}
              dataSource={data.list}
              columns={columns}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                ...data.pagination,
              }}
              onChange={this.handleStandardTableChange}
              rowKey="_id"
              rowSelection={rowSelection}
            />
            { darenModalVisible && <Modal
                title="指定达人"
                visible={darenModalVisible}
                onOk={this.handleSpecifyDaren}
                onCancel={() => this.handleDarenModalVisible(false)}
              >
                <FormItem
                  label="达人"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                >
                  {getFieldDecorator('target_user_id', {
                    initialValue: '',
                    rules: [{ required: true, message: '请选择达人！' }],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      mode="combobox"
                      optionLabelProp="children"
                      placeholder="搜索昵称指定达人"
                      notFoundContent=""
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      filterOption={false}
                      onSearch={this.handleSearchDaren}
                    >
                      {suggestionUsers.map(item => <Option value={item._id} key={item._id}>{item.nickname}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Modal>}
            <DockPanel />
            <Extension visible={this.state.extensionVisible} url={this.state.extension} onCancel={() => this.setState({ extensionVisible: false })} />
          </div>
        </Card>
      </div>
    );
  }
}
