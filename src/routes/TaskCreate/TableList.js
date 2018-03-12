import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import querystring from 'querystring';
import G2 from '@antv/g2';
import { Table, Card, Button, Input, Form, Menu, Popconfirm, Modal, Select, Row, Col, Popover,
  Dropdown, Icon, message, Radio, Tooltip, DatePicker, Tabs } from 'antd';
import { Link } from 'dva/router';
import { TASK_APPROVE_STATUS, APPROVE_FLOWS, APPROVE_ROLES, RIGHT } from '../../constants';
import FinanceList from './FinanceList.js';
import styles from './TableList.less';
import TaskNameColumn from '../../components/TaskNameColumn';
import TrimSpan from '../../components/TrimSpan';
import TaskStatusColumn from '../../components/TaskStatusColumn';
import ProjectDetail from '../../components/ProjectDetail';
import DockPanel from '../../components/DockPanel';

import { queryTaskStatisticsByApproveStatus } from '../../services/project';

const { RangePicker } = DatePicker;
const Search = Input.Search;
const FormItem = Form.Item;
const { Option } = Select;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  projectTask: state.task.projectTask,
  loading: state.task.projectTaskLoading,
  formData: state.project.formData,
  currentUser: state.user.currentUser,
  suggestionUsers: state.team.suggestionUsers,
  teamUsers: state.team.teamUsers,
  teamUser: state.user.teamUser,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    darenModalVisible: false,
    selectedRows: [],
    selectedRowKeys: [],
    formValues: {},
    task: {},
    activeKey: 'table',
  }

  componentDidMount() {
    const { dispatch, teamUser, projectTask: { pagination, approve_status } } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    dispatch({
      type: 'task/fetchProjectTasks',
      payload: { ...pagination, approve_status, project_id: query.project_id },
    });
    dispatch({
      type: 'project/fetchProject',
      payload: { _id: query.project_id },
    });
    if (teamUser.team_id) {
      this.props.dispatch({
        type: 'team/fetchTeamUsers',
        payload: { team_id: teamUser.team_id },
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.teamUsers.length === 0 && nextProps.teamUser.team_id) {
      this.props.dispatch({
        type: 'team/fetchTeamUsers',
        payload: { team_id: nextProps.teamUser.team_id },
      });
    }
  }
  renderChart = async () => {
    const query = querystring.parse(this.props.location.search.substr(1));
    const chart = new G2.Chart({
      container: document.getElementById('chart'),
      forceFit: true,
      height: 500,
    });
    const data = await queryTaskStatisticsByApproveStatus({ project_id: query.project_id });
    // console.log(data);
    // const data = [
    //   { genre: 'Sports', sold: 275 },
    //   { genre: 'Strategy', sold: 115 },
    //   { genre: 'Action', sold: 120 },
    //   { genre: 'Shooter', sold: 350 },
    //   { genre: 'Other', sold: 150 }
    // ];
    chart.source(data.list);
    chart.legend('text', {
      offsetX: 30,
    });
    chart.axis('value', {
      title: null,
    });
    chart.axis('text', {
      title: null,
    });
    // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
    chart.interval().position('text*value').color('text')
    // Step 4: 渲染图表
    chart.render();
  }
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, projectTask: { approve_status } } = this.props;
    const { formValues } = this.state;
    const query = querystring.parse(this.props.location.search.substr(1));

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      project_id: query.project_id,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      approve_status,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    window.scrollTo(0, 0);
    dispatch({
      type: 'task/fetchProjectTasks',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'task/fetchProjectTasks',
      payload: {},
    });
  }

  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'task/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
              selectedRowKeys: [],
            });
          },
        });
        break;
      default:
        break;
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  }
  handleSearch = (value, name) => {
    const { dispatch, projectTask: { pagination, approve_status }, } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    const values = {
      project_id: query.project_id,
      ...pagination,
      approve_status,
    };
    if(name === 'time') {
      values['create_time_start'] = value[0] ? value[0].format('YYYY-MM-DD 00:00:00') : '';
      values['create_time_end'] = value[1] ? value[1].format('YYYY-MM-DD 23:59:59') : '';
    } else {
      values[name] = value;
    }
    dispatch({
      type: 'task/fetchProjectTasks',
      payload: {
        currentPage: 1,
        ...values, 
      }
    });
  }

  handleAdd = () => {
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch(routerRedux.push(`/project/task/create?project_id=${query.project_id}`));
  }
  publishTasks = () => {
    const { dispatch, currentUser, projectTask: { pagination, approve_status } } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    dispatch({
      type: 'project/publishTasks',
      payload: {
        task_ids: this.state.selectedRowKeys,
        user_id: currentUser._id,
      },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          message.success(result.msg);
          dispatch({
            type: 'task/fetchProjectTasks',
            payload: { ...pagination, approve_status, project_id: query.project_id },
          });
          this.handleRowSelectChange([], []);
        }
      },
    });
  }
  handleSpecifyDaren = () => {
    const { dispatch, currentUser, projectTask: { pagination, approve_status } } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
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
                type: 'task/fetchProjectTasks',
                payload: { ...pagination, approve_status, project_id: query.project_id },
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
  handleUnSpecifyDaren = (record) => {
    const { dispatch, currentUser, projectTask: { pagination, approve_status } } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    dispatch({
      type: 'task/undaren',
      payload: {
        _id: record._id,
        user_id: currentUser._id,
      },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          message.success(result.msg);
          dispatch({
            type: 'task/fetchProjectTasks',
            payload: { ...pagination, approve_status, project_id: query.project_id },
          });
        }
      },
    });
  }
  handleEdit = (record) => {
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch(routerRedux.push(`/project/task/edit?project_id=${query.project_id}&_id=${record._id}`));
  }
  handlePublish = (record) => {
    const { dispatch, currentUser, projectTask: { pagination, approve_status } } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    dispatch({
      type: 'task/publish',
      payload: {
        _id: record._id,
        user_id: currentUser._id,
      },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          message.success(result.msg);
          dispatch({
            type: 'task/fetchProjectTasks',
            payload: { ...pagination, approve_status, project_id: query.project_id },
          });
        }
      },
    });
  }
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }
  handleShowSpecifyModal = (record) => {
    this.handleModalVisible(true);
    this.setState({ task: record });
  }
  handleDarenModalVisible = (flag) => {
    this.setState({
      darenModalVisible: !!flag,
    });
  }
  handleSpecify = () => {
    const { dispatch, currentUser, projectTask: { pagination, approve_status } } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.form.validateFields((err, values) => {
      if (!err && values.target_user_id) {
        dispatch({
          type: 'task/specify',
          payload: {
            _id: this.state.task._id,
            user_id: currentUser._id,
            target_user_id: values.target_user_id,
          },
          callback: (result) => {
            if (result.error) {
              message.error(result.msg);
            } else {
              message.success(result.msg);
              this.handleModalVisible(false);
              dispatch({
                type: 'task/fetchProjectTasks',
                payload: { ...pagination, project_id: query.project_id, approve_status },
              });
            }
          },
        });
      } else {
        message.warn('请选择写手！');
      }
    });
  }
  handleWithdraw = (record) => {
    const { dispatch, currentUser, projectTask: { pagination, approve_status } } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    dispatch({
      type: 'task/withdraw',
      payload: {
        _id: record._id,
        user_id: currentUser._id,
      },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          message.success(result.msg);
          dispatch({
            type: 'task/fetchProjectTasks',
            payload: { ...pagination, project_id: query.project_id, approve_status },
          });
        }
      },
    });
  }
  handleRemove = (record) => {
    const { dispatch, currentUser, projectTask: { pagination, approve_status } } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
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
          dispatch({
            type: 'task/fetchProjectTasks',
            payload: {  ...pagination, project_id: query.project_id, approve_status },
          });
        }
      },
    });
  }
  onSearch = (value) => {
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
  changeApproveStatus = (e) => {
    const { dispatch } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    dispatch({
      type: 'task/fetchProjectTasks',
      payload: { project_id: query.project_id, approve_status: e.target.value, },
    });
    this.handleRowSelectChange([], []);
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
  handleActiveKeyChange = (activeKey) => {
    this.setState({ activeKey }, () => {
      if (activeKey === 'chart' && !document.getElementById('chart').innerHTML) {
        this.renderChart();
      }
    });
  }
  render() {
    const { projectTask, loading, formData, form: { getFieldDecorator }, suggestionUsers, teamUsers, currentUser } = this.props;
    const { selectedRows, modalVisible, selectedRowKeys, darenModalVisible, activeKey } = this.state;
    const flow = APPROVE_FLOWS.find(item => item.value === formData.approve_flow);
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const columns = [
      {
        title: '任务ID',
        width: 80,
        dataIndex: 'id',
        render: (val, record) => <a onClick={() => this.handleShowDockPanel(record, 'DetailPane')}>{val}</a>,
      },
      {
        title: '任务标题',
        dataIndex: 'name',
        render: (record, task) => (
          <Link to={`/project/task/view?_id=${task._id}`}>
            <TaskNameColumn text={record} length={10} />
          </Link>
        )
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
      },
      {
        title: '渠道',
        dataIndex: 'channel_name',
      },
      {
        title: '商家标签',
        dataIndex: 'merchant_tag',
        render: (val) => (
          <TrimSpan text={val} length={10} />
        )
      },
      {
        title: '接单人',
        dataIndex: 'taker_id',
        render: (val) => val ? val.nickname : '',
      },
      {
        title: '接单时间',
        dataIndex: 'take_time',
        render: val => val ? <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span> : '',
      },
      {
        title: '状态',
        dataIndex: 'approve_status',
        render: val => (<TaskStatusColumn status={val}/>),
      },
    ];
    const opera = {
      title: '操作',
      render: (record) => {
        if (record.approve_status === TASK_APPROVE_STATUS.created) {
          return (
            <p>
              <a onClick={() => this.handleEdit(record)}>修改</a>
              { formData.type !== 3 &&
                <span className={styles.splitLine} />
              }
              { formData.type !== 3 &&
                <Popconfirm placement="left" title={`确认上架?`} onConfirm={() => this.handlePublish(record)} okText="确认" cancelText="取消">
                  <a>上架</a>
                </Popconfirm>
              }
              <span className={styles.splitLine} />
              <Popconfirm placement="left" title={`确认删除?`} onConfirm={() => this.handleRemove(record)} okText="确认" cancelText="取消">
                <a>删除</a>
              </Popconfirm>
              <span className={styles.splitLine} />
              <a onClick={() => this.handleShowSpecifyModal(record)}>指定</a>
            </p>
          );
        } else if (record.approve_status === TASK_APPROVE_STATUS.published) {
          return (
            <p>
              <a onClick={() => this.handleEdit(record)}>修改</a>
              <span className={styles.splitLine} />
              <Popconfirm placement="left" title={`确认撤回?`} onConfirm={() => this.handleWithdraw(record)} okText="确认" cancelText="取消">
                <Tooltip placement="top" title="撤回到已创建">
                  <a>撤回</a>
                </Tooltip>
              </Popconfirm>
            </p>
          );
        } else if (record.approve_status === TASK_APPROVE_STATUS.taken) {
          return (
            <p>
              <Popconfirm placement="left" title={`确认撤回?`} onConfirm={() => this.handleWithdraw(record)} okText="确认" cancelText="取消">
                <Tooltip placement="top" title="撤回到已创建">
                  <a>撤回</a>
                </Tooltip>
              </Popconfirm>
            </p>
          );
        } else if (record.approve_status === TASK_APPROVE_STATUS.waitingToTaobao) {
          return (
            <p>
              <Popconfirm placement="left" title={`确认撤回?`} onConfirm={() => this.handleUnSpecifyDaren(record)} okText="确认" cancelText="取消">
                <Tooltip placement="top" title="撤回到已通过">
                  <a>撤回</a>
                </Tooltip>
              </Popconfirm>
            </p>
          );
        } else {
          return (
            <div>
              <a onClick={() => this.handleShowDockPanel(record, 'AnalyzePane')}>
                分析
              </a>
            </div>
          );
        }
      },
    };
    const daren_nickname = {
      title: '发布人',
      dataIndex: 'daren_id',
      width: 80,
      render: val => val ? val.nickname : '',
    };
    const pushTime = {
      title: '发布时间',
      dataIndex: 'publish_taobao_time',
      render: val => ( 
        val ?
        <Tooltip placement="top" title={moment(val).format('YYYY-MM-DD HH:mm:ss')}>
          {moment(val).fromNow()}
        </Tooltip> : ''
      ),
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
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    if (projectTask.approve_status === TASK_APPROVE_STATUS.publishedToTaobao || projectTask.approve_status === TASK_APPROVE_STATUS.taobaoRejected || projectTask.approve_status === TASK_APPROVE_STATUS.taobaoAccepted) {
      columns.push(daren_nickname, pushTime, pushStatusText, recruitColumn, opera);
    } else {
      columns.push(opera);
    }
    return (
      <div>
        <ProjectDetail project={formData} />
        <Card style={{ marginBottom: 12 }}>
          {
            (flow ? flow.texts : []).map((item, index) => {
              const label = APPROVE_ROLES.find(item1 => item1.value === item).label;
              return (
                <Row key={index}>
                <Col span={2}>{label}:</Col>
                <Col span={22}>
                  {formData.approvers[index].map(item1 => {
                    const teamUser = teamUsers.find(item2 => item2.user_id && item2.user_id._id === item1);
                    if (teamUser && teamUser.user_id) {
                      return teamUser.user_id.nickname;
                    } else {
                      return '';
                    }
                  }).join(',')}
                </Col>
                </Row>
              );
            })
          }
        </Card>
        
        <Tabs activeKey={activeKey} onChange={this.handleActiveKeyChange}>
          <TabPane tab="任务" key="table">
            <div style={{ marginBottom: 12 }}>
            { formData.type !== 2 &&
              <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>新建任务</Button>
            }
            </div>
            <RadioGroup value={projectTask.approve_status} style={{ marginBottom: 12 }} onChange={this.changeApproveStatus}>
              <RadioButton value={TASK_APPROVE_STATUS.all}>全部</RadioButton>
              <RadioButton value={TASK_APPROVE_STATUS.created}>已创建</RadioButton>
              <RadioButton value={TASK_APPROVE_STATUS.published}>已上架</RadioButton>
              <RadioButton value={TASK_APPROVE_STATUS.taken}>待完成</RadioButton>
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
            <Card bordered={false} bodyStyle={{ padding: 14 }}>
              <div className={styles.tableList}>
                <div className={styles.tableListOperator}>
                  {selectedRows.length === 0 && (
                    <span>
                      <RangePicker style={{ width: 240 }} onChange={(value) => this.handleSearch(value,'time')} />
                      <Tooltip placement="top" title="创建时间">
                        <Icon type="question-circle-o" style={{ marginLeft: 8 }} />
                      </Tooltip>
                      <Search
                        style={{ width: 260, float: 'right' }}
                        placeholder="ID／名称／商家标签"
                        onChange={this.handleSearchClear}
                        onSearch={(value) => this.handleSearch(value, 'search')}
                        enterButton
                      />
                    </span>)
                  }
                  {
                    selectedRows.length > 0 && (
                      <span>
                        { formData.type === 1 &&
                          <Button icon="flag" type="default" onClick={() => this.publishTasks()}>批量上架</Button>
                        }
                        <Button icon="user-add" type="default"
                        onClick={() => this.handleDarenModalVisible(true)} style={{ marginLeft: 10 }}>指定达人</Button>
                        {/*<Dropdown overlay={menu}>
                          <Button>
                            更多操作 <Icon type="down" />
                          </Button>
                        </Dropdown> */}
                      </span>
                    )
                  }
                </div>
                <Table
                  loading={loading}
                  dataSource={projectTask.list}
                  columns={columns}
                  pagination={{
                    showSizeChanger: true,
                    showQuickJumper: true,
                    ...projectTask.pagination,
                  }}
                  rowSelection={rowSelection}
                  onChange={this.handleStandardTableChange}
                  rowKey="_id"
                />
                <DockPanel />
              </div>
              {modalVisible && <Modal
                title="指定写手"
                visible={modalVisible}
                onOk={this.handleSpecify}
                onCancel={() => this.handleModalVisible(false)}
              >
                <FormItem
                  label="写手"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                >
                  {getFieldDecorator('target_user_id', {
                    initialValue: '',
                    rules: [{ required: true, message: '请选择写手！' }],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      mode="combobox"
                      optionLabelProp="children"
                      placeholder="搜索昵称指定写手"
                      notFoundContent=""
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      filterOption={false}
                      onSearch={this.onSearch}
                    >
                      {suggestionUsers.map(item => <Option value={item._id} key={item._id}>{item.nickname}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Modal>}
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
                      onSearch={this.onSearch}
                    >
                      {suggestionUsers.map(item => <Option value={item._id} key={item._id}>{item.nickname}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Modal>}
            </Card>
          </TabPane>
          <TabPane tab="统计" key="chart">
            <Card bodyStyle={{ padding: '30px 10px 0 0' }}>
              <div id="chart"></div>
            </Card>
          </TabPane>
           { currentUser.rights && currentUser.rights.indexOf(RIGHT.finance) >= 0 && <TabPane tab="财务" key="finance">
            <FinanceList location={this.props.location} />
          </TabPane>}
        </Tabs>
        
      </div>
    );
  }
}
