import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Radio, Input, DatePicker, Tooltip, Divider, Popconfirm, message, Form, Select, Modal, Button, Progress, Icon, Popover } from 'antd';
import querystring from 'querystring';
import moment from 'moment';
import { Link, routerRedux } from 'dva/router';
import TaskNameColumn from '../../components/TaskNameColumn';
import TrimSpan from '../../components/TrimSpan';
import TaskStatusColumn from '../../components/TaskStatusColumn';
import TaskIdColumn from '../../components/TaskIdColumn';
import DateTimeColumn from '../../components/DateTimeColumn';
import PublisherChannelsPopover from '../../components/PublisherChannelsPopover';
import DockPanel from '../../components/DockPanel';
import Extension from '../../components/Extension';
import { TASK_APPROVE_STATUS, SOURCE } from '../../constants';
import styles from './TableList.less';
import { queryTask } from '../../services/task';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const Search = Input.Search;

@connect(state => ({
  data: state.task.takerTask,
  loading: state.task.takerTaskLoading,
  currentUser: state.user.currentUser,
  teamUser: state.user.teamUser,
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
    modalLoading: false,
    extension: '',
    extensionVisible: false,
    publishVisible: false,
    percent: 0,
    queue: [],
    queueNumber: 0,
    channel_list: [],
    take_time_start: null,
    take_time_end: null,
    search: '',
  }

  componentDidMount() {
    const { dispatch, currentUser, teamUser, data: { pagination, approve_status } } = this.props;
    const { search, take_time_start, take_time_end } = this.state;
    const query = querystring.parse(this.props.location.search.substr(1));
    if (currentUser._id) {
      dispatch({
        type: 'task/fetchTakerTasks',
        payload: {
          ...pagination,
          team_id: teamUser.team_id,
          approve_status: query.approve_status ? Number(query.approve_status) : approve_status,
          user_id: currentUser._id,
          take_time_start,
          take_time_end,
          search,
        },
      });
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
    const { dispatch, currentUser, teamUser, data: { pagination, approve_status } } = nextProps;
    const { search, take_time_start, take_time_end } = this.state;
    const query = querystring.parse(this.props.location.search.substr(1));
    if (currentUser._id !== this.props.currentUser._id) {
      dispatch({
        type: 'task/fetchTakerTasks',
        payload: {
          ...pagination,
          team_id: teamUser.team_id,
          approve_status: query.approve_status ? Number(query.approve_status) : approve_status,
          user_id: currentUser._id,
          take_time_start,
          take_time_end,
          search,
        },
      });
    }
  }
  componentWillUnmount() {
    const nicaiCrx = document.getElementById('nicaiCrx');
    nicaiCrx.removeEventListener('setChannel', this.setChannel);
    nicaiCrx.removeEventListener('setVersion', this.setVersion);
    nicaiCrx.removeEventListener('publishResult', this.publishResult);
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
        this.handleGetChannel();
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
    const { dispatch, currentUser, teamUser, data: { pagination, approve_status } } = this.props;
    const { search, take_time_start, take_time_end } = this.state;
    dispatch({
      type: 'task/fetchTakerTasks',
      payload: { ...pagination, approve_status, user_id: currentUser._id, currentPage: 1, team_id: teamUser.team_id, take_time_start, take_time_end, search },
    });
  }
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, currentUser, teamUser, data: { approve_status } } = this.props;
    const { search, take_time_start, take_time_end } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      user_id: currentUser._id,
      team_id: teamUser.team_id,
      approve_status,
      ...filters,
      take_time_start,
      take_time_end,
      search,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'task/fetchTakerTasks',
      payload: params,
    });
  }

  handlePublish = async (record) => {
    const { version } = this.state;
    if (version && version.length > 0) {
      const arr = version.split('.');
      const versionNumber = Number(arr[0]) * 100 + Number(arr[1]) * 10 + Number(arr[2]);
      if (versionNumber < 120) { // 1.0.4
        message.destroy();
        message.warn('请更新插件！');
      } else {
        const result = await queryTask({
          _id: record._id,
        });
        const activityId = result.task.formData.activityId;
        if (activityId === 1331 && versionNumber < 122) { //每日好店
          message.destroy();
          message.warn('请更新插件！');
        } else if ((result.task.formData.template === 'magiccollocation' || activityId === 1437 || activityId === 1413
          || activityId === 1377) && versionNumber < 123) {
          message.destroy();
          message.warn('请更新插件！');
        } else {
          this.handlePublishToTaobao(result.task);
          message.destroy();
          message.loading('发布中 ...', 60);
        }
      }
    } else {
      message.destroy();
      message.warn('请安装尼采创作平台插件！', 60 * 60);
    }
  }
  handlePublishAll = async () => {
    const { selectedRows } = this.state;
    const _ids = [];
    selectedRows.filter(val => { _ids.push(val._id) });
    if (this.state.version) {
      const result = await queryTask({
        _id: record._id,
      });
      this.handlePublishToTaobao(result.task);
      const arr = tasks.list.splice(1);
      this.setState({
        queueNumber: tasks.list.length + 1,
        queue: [ ...arr ],
        publishVisible: true,
        percent: 0,
      })
    } else {
      message.destroy();
      message.warn('请安装尼采创作平台插件！', 60 * 60);
    }
  }
  handlePublishToTaobao = (task) => {
    const { currentUser } = this.props;
    this.state.nicaiCrx.innerText = JSON.stringify({ task: task, user: currentUser, channel_name: task.channel_name });
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('publishToTaobao', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  handleSearch = (value, name) => {
    const { dispatch, data: { pagination, approve_status }, currentUser, teamUser } = this.props;
    const { search, take_time_start, take_time_end } = this.state;
    const values = {
      team_id: teamUser.team_id,
      user_id: currentUser._id,
      approve_status,
      take_time_start,
      take_time_end,
      search,
    };
    if(name === 'time') {
      values['take_time_start'] = value[0] ? value[0].format('YYYY-MM-DD 00:00:00') : '';
      values['take_time_end'] = value[1] ? value[1].format('YYYY-MM-DD 23:59:59') : '';
      if (value && value[0]) {
        this.setState({ take_time_start: value[0].toDate(), take_time_end: value[1].toDate() });
      } else {
        this.setState({ take_time_start: null, take_time_end: null });
      }
    } else {
      values[name] = value;
      this.setState({ [name]: value });
    }
    dispatch({
      type: 'task/fetchTakerTasks',
      payload: {
        currentPage: 1,
        pageSize: pagination.pageSize,
        ...values, 
      }
    });
  }
  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    if (selectedRowKeys && selectedRowKeys.length <= 3) {
      this.setState({ selectedRowKeys, selectedRows });
    } else {
      message.warn('一次最多发布3条');
    }
  }
  changeApproveStatus = (e) => {
    const { dispatch, currentUser, teamUser, data: { pagination } } = this.props;
    const { search, take_time_start, take_time_end } = this.state;
    dispatch({
      type: 'task/fetchTakerTasks',
      payload: { ...pagination, user_id: currentUser._id, team_id: teamUser.team_id, approve_status: e.target.value, currentPage: 1, take_time_start, take_time_end, search }
    });
  }

  handleShowPassModal = (record) => {
    this.setState({
      selectedRowKeys: [record._id],
      selectedRows: [record],
      modalVisible: true
    })
  }
  handlePassSearch = (value) => {
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
  handlePass = () => {
    const { dispatch, currentUser, data: { pagination } } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          modalLoading: true,
        })
        dispatch({
          type: 'task/pass',
          payload: {
            target_user_id: values.target_user_id,
            user_id: currentUser._id,
            _id: this.state.selectedRowKeys[0],
          },
          callback: (result) => {
            if (result.error) {
              message.error(result.msg);
              this.setState({
                modalLoading: false,
              })
            } else {
              message.success(result.msg);
              this.handleRowSelectChange([], []);
              this.setState({
                modalVisible: false,
                modalLoading: false,
              })
            }
          }
        });
      }
    });
  }

  handleSpecifyApprover = () => {
    const { dispatch } = this.props;
    const { approver_id } = this.state;
    this.props.form.validateFields(['approver', 'approver2'], (err, values) => {
      if (!err) {
        const approvers = [ [approver_id.first] ];
        if(approver_id.second){
          approvers.push([approver_id.second]);
        }
        this.setState({ modalVisible: false });
        this.handleSubmit(approvers);
      }
    });
  }
  handleReturnToTakenAndEdit = (record) => {
    const { currentUser } = this.props;
    this.props.dispatch({
      type: 'task/update',
      payload: { _id: record._id, approve_status: TASK_APPROVE_STATUS.taken },
      callback: (result1) => {
        if (result1.error) {
          message.error(result1.msg);
        } else {
          this.props.dispatch(routerRedux.push(`/writer/task/edit?_id=${record._id}`));
        }
      }
    });
  }
  
  handleApproveSearch = (value, key) => {
    const { teamUser } = this.props;
    const data = {};
    data[key] = '';
    this.setState({
      approver_id: { ...this.state.approver_id, ...data },
    })
    if (value) {
      this.props.dispatch({
        type: 'team/searchTeamUsers',
        payload: {
          team_id: teamUser.team_id,
          nickname: value,
        },
        callback: (res) => {
          data[key] = res.list || [];
          this.setState({
            suggestionApproves: { ...this.state.suggestionApproves, ...data },
          })
        }
      });
    }
  }
  handelApproveSelect = (value, key) => {
    const data = {};
    data[key] = value;
    this.setState({
      approver_id: { ...this.state.approver_id, ...data },
    })
  }
  handleRemove = (record) => {
    const { dispatch, currentUser } = this.props;
    dispatch({
      type: 'task/remove',
      payload: {
        _id: record._id,
        user_id: currentUser._id,
      },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          message.success(result.msg);
          this.handleFetch();
        }
      },
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
  handleReject = (record) => {
    const { dispatch, currentUser } = this.props;
    dispatch({
      type: 'task/reject',
      payload: { _id: record._id, approver_id: currentUser._id },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          message.success(result.msg);
          this.handleFetch();
        }
      },
    });
  }
  handleChange = (e) => {
    if (!e.target.value) {
      this.handleSearch(e.target.value, 'search')
    }
    this.setState({ search: e.target.value });
  }
  render() {
    const { data, loading, form: { getFieldDecorator }, suggestionUsers, currentUser } = this.props;
    const { modalVisible, publishVisible, selectedRowKeys, approveModalVisible, suggestionApproves, selectedRows, percent, channel_list, take_time_start, take_time_end } = this.state;
    const columns = [
      {
        title: '任务ID',
        width: 100,
        dataIndex: 'id',
        render: (val, record) => <TaskIdColumn source={record.source} text={<a onClick={() => this.handleShowDockPanel(record, 'DetailPane')}>{val}</a>} />,
      },
      {
        title: '名称',
        dataIndex: 'name',
        render: (val, record) => (
          <a target="_blank" href={record.taobao && record.taobao.url ? record.taobao.url : `/task/detail.html?_id=${record._id}`}>
            <TaskNameColumn text={val} length={10} />
          </a>
        ),
      },
      {
        title: '发布渠道',
        dataIndex: 'channel_name',
        render: val => val || '',
      },
      {
        title: '商家标签',
        dataIndex: 'merchant_tag',
        render: (record) => (
          <TrimSpan text={record} length={10} />
        )
      },
    ];
    const times = [{
      title: '修改时间',
      dataIndex: 'last_update_time',
      render: (val) => <DateTimeColumn value={val} />,
      sorter: true,
    },
    {
      title: '截止时间',
      dataIndex: 'deadline',
      render: (val) => <DateTimeColumn value={val} />,
      sorter: true,
    }]
    const approver = {
      title: '审核人',
      dataIndex: 'approver_id',
      render: value => value ? value.nickname : '',
    };
    const approveTime = {
      title: '审核时间',
      dataIndex: 'approve_time',
      render: (val) => <DateTimeColumn value={val} />,
    };
    const pushStatusText = {
      title: '推送状态',
      dataIndex: 'taobao.pushStatusText',
      render: val => {
        let pushStatusTextTags = '';
        if (val) {
          pushStatusTextTags = val.map((item, index) => <p key={index}>{item}</p>);
        }
        return <span>{pushStatusTextTags}</span>
      },
    };
    const recruitColumn = {
      title: '投稿状态',
      dataIndex: 'taobao.recruitFail',
      render: (val, record) => {
        if (record.taobao.recruitStatusDesc) {
          let color = '';
          if (record.taobao.recruitStatusDesc === '审核中') {
            color = 'rgb(252, 166, 28)';
          } else if (record.taobao.recruitStatusDesc === '审核通过') {
            color = 'rgb(74, 190, 90)';
          } else if (record.taobao.recruitStatusDesc === '审核不通过') {
            color = 'rgb(248, 109, 109)';
          }
          return (
            <div>
              <div>{record.taobao.recruitTitle ? `已投${record.taobao.recruitTitle}` : ''}</div>
              <div><span style={{ color, marginRight: 5 }}>{record.taobao.recruitStatusDesc}</span>
              {record.taobao.recruitStatusDesc === '审核不通过' ?
                <Popover placement="top" content={record.taobao.recruitFailMessage} trigger="hover">
                  <Icon type="question-circle-o" />
                </Popover>: ''}
              </div>
            </div>
          );
        } else {
          return '';
        }
      },
    };
    const daren_nickname = {
      title: '发布人',
      dataIndex: 'daren_id',
      render: val => val ? val.nickname : '',
    };
    const pushTime = {
      title: '发布时间',
      dataIndex: 'publish_taobao_time',
      render: (val) => <DateTimeColumn value={val} />,
    };
    const status = {
      title: '状态',
      dataIndex: 'approve_status',
      render: val => (<TaskStatusColumn status={val}/>),
    };
    const opera = {
      title: '操作',
      render: (record) => {
        if (record.approve_status === TASK_APPROVE_STATUS.taken) {
          return (
            <div>
              <Link to={`/writer/task/edit?_id=${record._id}`}>
                <span>编辑</span>
              </Link>
              { record.channel_name &&
                <span>
                  <Divider type="vertical" />
                  <Popconfirm placement="left" title={`确认发布至阿里创作平台?`} onConfirm={() => this.handlePublish(record)} okText="确认" cancelText="取消">
                    <a><PublisherChannelsPopover channel_list={channel_list} >发布</PublisherChannelsPopover></a>
                  </Popconfirm>
                </span>
              }
              {!record.project_id && <Divider type="vertical" />}
              {!record.project_id && <a onClick={() => this.handleShowPassModal(record)}>转交</a>}
              {(record.source === SOURCE.deliver || record.source === SOURCE.create || record.source === SOURCE.pass) && <Divider type="vertical" />}
              {(record.source === SOURCE.deliver || record.source === SOURCE.create || record.source === SOURCE.pass) &&
                <Popconfirm placement="left" title={`确认删除?`} onConfirm={() => this.handleRemove(record)} okText="确认" cancelText="取消">
                  <a>删除</a>
                </Popconfirm>
              }
            </div>
          );
        } else if (record.approve_status === TASK_APPROVE_STATUS.waitingForApprove) {
          return (
            <div>
              <Link to={`/writer/task/view?_id=${record._id}`}>
                查看
              </Link>
            </div>
          );
        } else if (record.approve_status === TASK_APPROVE_STATUS.rejected) {
          return (
            <div>
              <Link to={`/writer/task/edit?_id=${record._id}`}>
                <span>编辑</span>
              </Link>
              {(record.source === SOURCE.deliver || record.source === SOURCE.create || record.source === SOURCE.pass) && <Divider type="vertical" />}
              {(record.source === SOURCE.deliver || record.source === SOURCE.create || record.source === SOURCE.pass) &&
                <Popconfirm placement="left" title={`确认删除?`} onConfirm={() => this.handleRemove(record)} okText="确认" cancelText="取消">
                  <a>删除</a>
                </Popconfirm>
              }
            </div>
          );
        } else if (record.approve_status === TASK_APPROVE_STATUS.passed) {
          return (
            <div>
              <Popconfirm placement="left" title={`确认发布至阿里创作平台?`} onConfirm={() => this.handlePublish(record)} okText="确认" cancelText="取消">
                <a><PublisherChannelsPopover channel_list={channel_list} >发布</PublisherChannelsPopover></a>
              </Popconfirm>
              <Divider type="vertical" />
              <Link to={`/writer/task/view?_id=${record._id}`}>
                查看
              </Link>
            </div>
          );
        } else if (record.approve_status === TASK_APPROVE_STATUS.waitingToTaobao) {
          return (
            <div>
              <Link to={`/approver/task/edit?_id=${record._id}`}>
                <span>编辑</span>
              </Link>
              <Divider type="vertical" />
              <Popconfirm placement="left" title={`确认发布至阿里创作平台?`} onConfirm={() => this.handlePublish(record)} okText="确认" cancelText="取消">
                <a><PublisherChannelsPopover channel_list={channel_list} >发布</PublisherChannelsPopover></a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm placement="left" title={`确认退回?`} onConfirm={() => this.handleReject(record)} okText="确认" cancelText="取消">
                <Tooltip placement="top" title="退回给写手">
                  <a>退回</a>
                </Tooltip>
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
            </div>
          );
        } else if (record.approve_status === TASK_APPROVE_STATUS.taobaoRejected) {
          return (
            <div>
              { !record.approver_id &&
                <Popconfirm placement="left" title="当前稿子将转移到待完成列表中，编辑后请到待完成中查找。" onConfirm={() => this.handleReturnToTakenAndEdit(record)} okText="确认" cancelText="取消">
                  <a>
                    编辑
                  </a>
                </Popconfirm>
              }
              { !record.approver_id && <Divider type="vertical" />}
              { record.approver_id && record.daren_id && record.daren_id._id === currentUser._id &&
                <Popconfirm placement="left" title={`确认退回给写手?`} onConfirm={() => this.handleReject(record)} okText="确认" cancelText="取消">
                <a>退回</a>
              </Popconfirm>}
              { record.approver_id && record.daren_id && record.daren_id._id === currentUser._id && <Divider type="vertical" />}
              { record.taobao && record.taobao.url &&
                <a onClick={() => {this.setState({ extension: record.taobao.url, extensionVisible: true })}}>
                  推广
                </a>
              }
              { record.taobao && record.taobao.url && <Divider type="vertical" /> }
              <a onClick={() => this.handleShowDockPanel(record, 'AnalyzePane')}>
                分析
              </a>
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
      }
    };
    const rowSelection = (data.approve_status === TASK_APPROVE_STATUS.passed || data.approve_status === TASK_APPROVE_STATUS.waitingToTaobao) ? {
      selectedRowKeys,
      hideDefaultSelections: true,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    } : null;
    if (data.approve_status === -1 || data.approve_status === 0) {
      columns.push(...times, opera);
    } else if (data.approve_status === TASK_APPROVE_STATUS.publishedToTaobao || data.approve_status === TASK_APPROVE_STATUS.taobaoAccepted || data.approve_status === TASK_APPROVE_STATUS.taobaoRejected) {
      columns.push( pushStatusText, recruitColumn, daren_nickname, pushTime, opera);
    } else if (data.approve_status === TASK_APPROVE_STATUS.all) {
      columns.push(...times, status, opera);
    } else {
      columns.push(...times, approveTime, opera);
    }
    return (
      <div>
        <div className={styles.searchBox}>
          <RadioGroup value={data.approve_status} onChange={this.changeApproveStatus}>
            <RadioButton value={TASK_APPROVE_STATUS.all}>全部</RadioButton>
            <Tooltip placement="top" title="待完成/草稿箱">
              <RadioButton value={TASK_APPROVE_STATUS.taken}>待完成</RadioButton>
            </Tooltip>
            <RadioButton value={TASK_APPROVE_STATUS.waitingForApprove}>待审核</RadioButton>
            <RadioButton value={TASK_APPROVE_STATUS.rejected}>未通过</RadioButton>
            <RadioButton value={TASK_APPROVE_STATUS.passed}>已通过</RadioButton>
            <Tooltip placement="top" title="待发布至阿里创作平台">
              <RadioButton value={TASK_APPROVE_STATUS.waitingToTaobao}>
                待发布
              </RadioButton>
            </Tooltip>
            <Tooltip placement="top" title="已发布至阿里创作平台">
              <RadioButton value={TASK_APPROVE_STATUS.publishedToTaobao}>
                已发布
              </RadioButton>
            </Tooltip>
            <Tooltip placement="top" title="阿里创作平台不通过">
              <RadioButton value={TASK_APPROVE_STATUS.taobaoRejected}>
                淘宝不通过
              </RadioButton>
            </Tooltip>
            <Tooltip placement="top" title="阿里创作平台通过">
              <RadioButton value={TASK_APPROVE_STATUS.taobaoAccepted}>
                淘宝通过
              </RadioButton>
            </Tooltip>
          </RadioGroup>
        </div>
        <Card bordered={false} bodyStyle={{ padding: 14 }}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <RangePicker style={{ width: 240 }} onChange={(value) => this.handleSearch(value,'time')}
                value={take_time_start ? [ moment(take_time_start), moment(take_time_end) ] : []}/>
              <Tooltip placement="top" title="接单／创建时间">
                <Icon type="question-circle-o" />
              </Tooltip>
              <Search
                style={{ width: 260, float: 'right' }}
                placeholder="ID／名称／商家标签"
                onSearch={(value) => this.handleSearch(value, 'search')}
                onChange={this.handleChange}
                value={this.state.search}
                enterButton
              />
              {/* selectedRows.length > 0 && (
                <span>
                  <Popconfirm placement="left" title={`确认发布至阿里创作平台?`} onConfirm={this.handlePublishAll} okText="确认" cancelText="取消">
                    <Button icon="user-add" type="default">批量发布</Button>
                  </Popconfirm>
                </span>
                )
              */}
            </div>
            <Table
              loading={loading}
              dataSource={data.list}
              columns={columns}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                ...data.pagination,
              }}
              onChange={this.handleStandardTableChange}
              rowKey="_id"
              // rowSelection={rowSelection}
            />
            {
              <Modal
                visible={publishVisible}
                title="发布中"
                onCancel={() => this.setState({ publishVisible: false })}
                footer={null}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: 20 }}>正在发布，请勿关闭窗口</div>
                  <Progress style={{ margin: 'auto'}} type="circle" percent={percent} />
                </div>
              </Modal>
            }
            <DockPanel />
          </div>
        </Card>

        {modalVisible && <Modal
          title="选择转交对象"
          visible={modalVisible}
          onOk={this.handlePass}
          onCancel={() => {this.setState({ modalVisible: false })}}
          confirmLoading={this.state.modalLoading}
        >
          <FormItem
            label="用户"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            {getFieldDecorator('target_user_id', {
              initialValue: '',
              rules: [{ required: true, message: '请选择转交用户！' }],
            })(
              <Select
                style={{ width: '100%' }}
                mode="combobox"
                optionLabelProp="children"
                placeholder="搜索昵称指定转交用户"
                notFoundContent=""
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={this.handlePassSearch}
              >
                {suggestionUsers.filter(item => item._id !== currentUser._id).map(item => <Option value={item._id} key={item._id}>{item.nickname}</Option>)}
              </Select>
            )}
          </FormItem>
        </Modal>}
        <Extension visible={this.state.extensionVisible} url={this.state.extension} onCancel={() => this.setState({ extensionVisible: false })} />
      </div>
    );
  }
}