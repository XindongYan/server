import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import querystring from 'querystring';
import { Table, Card, Button, Form, Menu, Checkbox, Popconfirm, Modal, Select, Row, Col, message } from 'antd';
import { TASK_APPROVE_STATUS, APPROVE_FLOWS, APPROVE_ROLES } from '../../constants';
import styles from './TableList.less';
import TaskNameColumn from '../../components/TaskNameColumn';
import TaskStatusColumn from '../../components/TaskStatusColumn';
import ProjectDetail from '../../components/ProjectDetail';

const FormItem = Form.Item;
const { Option } = Select;
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
    selectedRows: [],
    selectedRowKeys: [],
    formValues: {},
    task: {},
  };

  componentDidMount() {
    const { dispatch, teamUser } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    dispatch({
      type: 'task/fetchProjectTasks',
      payload: { project_id: query.project_id },
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
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
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
  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'task/fetch',
        payload: values,
      });
    });
  }

  handleAdd = () => {
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch(routerRedux.push(`/project/task/create?project_id=${query.project_id}`));
  }
  handleEdit = (record) => {
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch(routerRedux.push(`/project/task/edit?project_id=${query.project_id}&_id=${record._id}`));
  }
  handlePublish = (record) => {
    const { dispatch, currentUser } = this.props;
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
            payload: { project_id: query.project_id },
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
  handleSpecify = () => {
    const { dispatch, currentUser } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'task/specify',
          payload: {
            _id: this.state.task._id,
            user_id: currentUser._id,
            phone: values.phone,
          },
          callback: (result) => {
            if (result.error) {
              message.error(result.msg);
            } else {
              message.success(result.msg);
              this.handleModalVisible(false);
              dispatch({
                type: 'task/fetchProjectTasks',
                payload: { project_id: query.project_id },
              });
            }
          },
        });
      }
    });
  }
  handleWithdraw = (record) => {
    const { dispatch } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    dispatch({
      type: 'task/withdraw',
      payload: {
        _id: record._id,
      },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          message.success(result.msg);
          dispatch({
            type: 'task/fetchProjectTasks',
            payload: { project_id: query.project_id },
          });
        }
      },
    });
  }
  onSearch = (value) => {
    if (value.length == 11) {
      this.props.dispatch({
        type: 'team/fetchUsersByPhone',
        payload: {
          phone: value
        },
      });
    }
  }
  render() {
    const { projectTask, loading, formData, form: { getFieldDecorator }, suggestionUsers, teamUsers } = this.props;
    const { selectedRows, modalVisible, selectedRowKeys } = this.state;
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
        dataIndex: 'id',
      },
      {
        title: '内容标题',
        dataIndex: 'name',
        render: (record) => (
          <TaskNameColumn text={record} length={10}/>
        )
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
      },
      {
        title: '渠道',
        dataIndex: 'channel_name',
      },
      {
        title: '商家标签',
        dataIndex: 'merchant_tag',
      },
      {
        title: '接单人',
        dataIndex: 'taker_id',
        render: (val) => val ? val.name : '',
      },
      {
        title: '接单时间',
        dataIndex: 'take_time',
        sorter: true,
        render: val => val ? <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span> : '',
      },
      {
        title: '状态',
        dataIndex: 'approve_status',
        render: val => (<TaskStatusColumn status={val}/>),
      },
      {
        title: '操作',
        render: (record) => {
          if (record.approve_status === TASK_APPROVE_STATUS.created) {
            return (
              <p>
                <a onClick={() => this.handleEdit(record)}>修改</a>
                <span className={styles.splitLine} />
                <Popconfirm placement="left" title={`确认发布?`} onConfirm={() => this.handlePublish(record)} okText="确认" cancelText="取消">
                  <a>发布</a>
                </Popconfirm>
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
                  <a>撤回</a>
                </Popconfirm>
              </p>
            );
          } else if (record.approve_status === TASK_APPROVE_STATUS.taken) {
            return (
              <p>
              <Popconfirm placement="left" title={`确认撤回?`} onConfirm={() => this.handleWithdraw(record)} okText="确认" cancelText="取消">
                  <a>撤回</a>
                </Popconfirm>
                
              </p>
            );
          } else {
            return '';
          }
        },
      },
    ];
    const gridStyle = {
      width: '32%',
      margin: '5px',
      padding: '10px',
    };
    return (
      <div>
        <ProjectDetail project={formData} />
        <Card style={{ marginBottom: 14 }}>
          {
            (flow ? flow.texts : []).map((item, index) => {
              const label = APPROVE_ROLES.find(item1 => item1.value === item).label;
              return (
                <Row>
                <Col span={2}>{label}:</Col>
                <Col span={22} style={{ testAlign: 'left' }}>
                  {formData.approvers[index].map(item1 => {
                    const teamUser = teamUsers.find(item2 => item2.user_id._id === item1);
                    if (teamUser && teamUser.user_id) {
                      return teamUser.user_id.name;
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
        <Card bordered={false} bodyStyle={{ padding: 14 }}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>新建任务</Button>
              {
                selectedRows.length > 0 && (
                  <span>
                    <Button>批量操作</Button>
                    <Dropdown overlay={menu}>
                      <Button>
                        更多操作 <Icon type="down" />
                      </Button>
                    </Dropdown>
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
              onChange={this.handleStandardTableChange}
              rowKey="_id"
            />
          </div>
          <Modal
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
              {getFieldDecorator('phone', {
                initialValue: '',
                rules: [{ required: true, message: '请选择写手！' }],
              })(
                <Select
                  style={{ width: '100%' }}
                  mode="combobox"
                  optionLabelProp="children"
                  placeholder="搜索电话指定写手"
                  notFoundContent=""
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  onSearch={this.onSearch}
                >
                  {suggestionUsers.map(item => <Option value={item.phone} key={item.phone}>{item.name}</Option>)}
                </Select>
              )}
            </FormItem>
          </Modal>
        </Card>
      </div>
    );
  }
}
