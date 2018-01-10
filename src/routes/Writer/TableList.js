import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Radio, Input, DatePicker, Tooltip, Divider, Popconfirm, message, Form, Select, Modal } from 'antd';
import moment from 'moment';
import querystring from 'querystring';
import { Link, routerRedux } from 'dva/router';
import $ from 'jquery';
import fetch from 'dva/fetch';
import { stringify } from 'qs';
import TaskNameColumn from '../../components/TaskNameColumn';
import TaskStatusColumn from '../../components/TaskStatusColumn';
import DockPanel from '../../components/DockPanel';
import Extension from '../../components/Extension';
import { TASK_APPROVE_STATUS, ORIGIN } from '../../constants';
import styles from './TableList.less';

import { queryConvertedTasks } from '../../services/task';

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
  }

  componentDidMount() {
    const { dispatch, currentUser, data: { pagination, approve_status } } = this.props;
    const query = querystring.parse(this.props.location.search.substr(1));
    if (currentUser._id) {
      dispatch({
        type: 'task/fetchTakerTasks',
        payload: {
          ...pagination,
          approve_status: query.approve_status ? Number(query.approve_status) : approve_status,
          user_id: currentUser._id
        },
      });
    }
    const nicaiCrx = document.getElementById('nicaiCrx');
    nicaiCrx.addEventListener('publishResult', this.publishResult);
    nicaiCrx.addEventListener('setVersion', this.setVersion);
    if (!this.state.nicaiCrx) {
      this.setState({ nicaiCrx }, () => {
        setTimeout(() => {
          this.handleGetVersion();
        }, 400);
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { dispatch, currentUser, data: { pagination, approve_status } } = nextProps;
    const query = querystring.parse(this.props.location.search.substr(1));
    if (currentUser._id !== this.props.currentUser._id) {
      dispatch({
        type: 'task/fetchTakerTasks',
        payload: {
          ...pagination,
          approve_status: query.approve_status ? Number(query.approve_status) : approve_status,
          user_id: currentUser._id,
        },
      });
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
      message.success(data.msg);
      this.handleFetch();
    }
  }
  setVersion = (e) => {
    const data = JSON.parse(e.target.innerText);
    this.setState({
      version: data,
    })
  }
  handleGetVersion = () => {
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getVersion', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  handleFetch = () => {
    const { dispatch, currentUser, data: { pagination, approve_status } } = this.props;
    dispatch({
      type: 'task/fetchTakerTasks',
      payload: { ...pagination, approve_status, user_id: currentUser._id, currentPage: 1, },
    });
  }
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, currentUser, data: { approve_status } } = this.props;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      user_id: currentUser._id,
      approve_status,
      ...filters,
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
    if (this.state.version) {
      const { currentUser } = this.props;
      const tasks = await queryConvertedTasks({
        _ids: JSON.stringify([record._id]),
      });
      this.state.nicaiCrx.innerText = JSON.stringify({...tasks, user: currentUser});
      const customEvent = document.createEvent('Event');
      customEvent.initEvent('publishToTaobao', true, true);
      this.state.nicaiCrx.dispatchEvent(customEvent);
      message.destroy();
      message.loading('发布中 ...', 60);
    } else {
      message.destroy();
      message.warn('请安装尼采创作平台插件并用淘宝授权登录！', 60 * 60);
    }
  }

  handleSearch = (value, name) => {
    const { dispatch, data: { pagination, approve_status }, currentUser } = this.props;
    const values = {
      user_id: currentUser._id,
      approve_status,
    };
    if(name === 'time') {
      values['take_time_start'] = value[0] ? value[0].format('YYYY-MM-DD 00:00:00') : '';
      values['take_time_end'] = value[1] ? value[1].format('YYYY-MM-DD 23:59:59') : '';
    } else {
      values[name] = value;
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
    this.setState({ selectedRowKeys, selectedRows });
  }
  changeApproveStatus = (e) => {
    const { dispatch, currentUser, data: { pagination } } = this.props;
    dispatch({
      type: 'task/fetchTakerTasks',
      payload: { ...pagination, user_id: currentUser._id, approve_status: e.target.value, currentPage: 1, }
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
    if (value) {
      this.props.dispatch({
        type: 'team/searchUsers',
        payload: {
          nickname: value
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

  handleCancel = () => {
    this.setState({ extensionVisible: false });
  }

  handleShowAddTeamUserModal = (record) => {
    if (this.validate(record)) {
      if (record.project_id) {
        this.handleEditSubmit(record);
      } else {
        this.setState({
          approveModalVisible: true,
          task_id: record._id,
        });
      }
    }
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
  handleEditSubmit = (record) => {
    const { currentUser, teamUser } = this.props;
    this.props.dispatch({
      type: 'task/handin',
      payload: { _id: record._id, user_id: currentUser._id },
      callback: (result1) => {
        if (result1.error) {
          message.error(result1.msg);
        } else {
          this.props.dispatch(routerRedux.push(`/writer/task/handin/success?_id=${record._id}`));
        }
      }
    });
  }
  
  handleApproveSearch = (value, key) => {
    const data = {};
    data[key] = '';
    this.setState({
      approver_id: { ...this.state.approver_id, ...data },
    })
    if (value) {
      this.props.dispatch({
        type: 'team/searchUsers',
        payload: {
          nickname: value
        },
        callback: (res) => {
          data[key] = res.users || [];
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
  validate = (record) => {
    const { haveGoods } = record;
    console.log(record)
    if (record.channel_name === '有好货') {
      let bOk = true;
      this.props.form.validateFields(['title','task_desc','industry_title','industry_introduction','brand_name','brand_introduction'], (err, val) => {
        if (!err) {
          if (!record.merchant_tag) {
            message.warn('请填写商家标签');
            bOk = false;
          } else if (!haveGoods.product_url) {
            message.warn('请选择商品宝贝');
            bOk = false;
          } else if (!haveGoods.cover_imgs || haveGoods.cover_imgs.length < 3) {
            message.warn('请选择至少三张封面图');
            bOk = false;
          } else if (!haveGoods.white_bg_img) {
            message.warn('请选择一张白底图');
            bOk = false;
          } else if (!haveGoods.long_advantage || haveGoods.long_advantage.length < 2) {
            message.warn('请输入至少2条长亮点');
            bOk = false;
          } else if (!haveGoods.short_advantage || haveGoods.short_advantage.length < 2) {
            message.warn('请输入至少2条短亮点');
            bOk = false;
          } else if (!haveGoods.industry_img) {
            message.warn('请选择一张行业配图');
            bOk = false;
          } else if (!haveGoods.brand_logo) {
            message.warn('请上传品牌logo');
            bOk = false;
          }
        } else {
          bOk = false;
        }
      })
      return bOk;
    } else {
      if (!record.merchant_tag) {
        message.warn('请填写商家标签');
        return false;
      } else if (!record.title || !record.title.replace(/\s+/g, '')) {
        message.warn('请填写标题');
        return false;
      } else if (record.title && record.title.length > 19) {
        message.warn('标题字数不符合要求');
        return false;
      } else if (!record.task_desc) {
        message.warn('请填写内容');
        return false;
      } else if (!record.cover_img && record.channel_name !== '直播脚本') {
        message.warn('请选择封面图');
        return false;
      } else {
        return true;
      }
    }
  }
  render() {
    const { data, loading, form: { getFieldDecorator }, suggestionUsers, currentUser } = this.props;
    const { modalVisible, selectedRowKeys, approveModalVisible, suggestionApproves } = this.state;
    const columns = [
      {
        title: '任务ID',
        dataIndex: 'id',
        render: (val, record) => <a onClick={() => this.handleShowDockPanel(record, 'OperationPane')}>{val}</a>,
      },
      {
        title: '名称',
        dataIndex: 'name',
        render: (record, task) => (
          <Link to={`/project/task/view?_id=${task._id}`}>
            <TaskNameColumn text={record} length={10} />
          </Link>
        ),
      },
      {
        title: '最后修改时间',
        dataIndex: 'last_update_time',
        render: (val) =>
          val ?
          <Tooltip placement="top" title={moment(val).format('YYYY-MM-DD HH:mm:ss')}>
            {moment(val).fromNow()}
          </Tooltip>
          : '',
        sorter: true,
      },
      {
        title: '截止时间',
        dataIndex: 'deadline',
        render: (val) =>
          val ?
          <Tooltip placement="top" title={moment(val).format('YYYY-MM-DD HH:mm:ss')}>
            {moment(val).format('MM/DD')}
          </Tooltip>
          : '',
        sorter: true,
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
          <TaskNameColumn text={record} length={10} />
        )
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
        val ?
        <Tooltip placement="top" title={moment(val).format('YYYY-MM-DD HH:mm:ss')}>
          {moment(val).fromNow()}
        </Tooltip> : ''
      ),
    };
    const pushStatusText = {
      title: '推送状态',
      dataIndex: 'taobao',
      render: val => {
        let pushStatusTextTags = '';
        if (val.pushStatusText) {
          pushStatusTextTags = val.pushStatusText.map((item, index) => <p key={index}>{item}</p>);
        }
        return <span>{pushStatusTextTags}</span>
      },
    };
    const opera = {
      title: '操作',
      render: (record) => {
        if (record.approve_status === TASK_APPROVE_STATUS.taken) {
          return (
            <div>
              <a target="_blank" href={`${ORIGIN}/public/task/details?id=${record._id}&channel_name=${record.channel_name}`}>
                外链
              </a>
              <Divider type="vertical" />
              { !record.project_id ?
                <Link to={`/writer/task/create?_id=${record._id}&channel_name=${record.channel_name || '直播脚本'}&task_type=${record.task_type || 1}`}>
                  <span>编辑</span>
                </Link>
                : <Link to={`/writer/task/edit?_id=${record._id}`}>
                  <span>编辑</span>
                </Link>
              }
              { record.channel_name &&
                <span>
                  <Divider type="vertical" />
                  <Popconfirm placement="left" title={`确认发布至阿里创作平台?`} onConfirm={() => this.handlePublish(record)} okText="确认" cancelText="取消">
                    <a>发布</a>
                  </Popconfirm>
                </span>
              }
              {!record.project_id && <Divider type="vertical" />}
              {!record.project_id && <a onClick={() => this.handleShowPassModal(record)}>转交</a>}
              {!record.project_id && <Divider type="vertical" />}
              {!record.project_id &&
                <Popconfirm placement="left" title={`确认删除?`} onConfirm={() => this.handleRemove(record)} okText="确认" cancelText="取消">
                  <a>删除</a>
                </Popconfirm>
              }
            </div>
          );
        } else if (record.approve_status === TASK_APPROVE_STATUS.waitingForApprove) {
          return (
            <div>
              <a target="_blank" href={`${ORIGIN}/public/task/details?id=${record._id}&channel_name=${record.channel_name}`}>
                外链
              </a>
              <Divider type="vertical" />
              <Link to={`/writer/task/view?_id=${record._id}`}>
                <span>查看</span>
              </Link>
            </div>
          );
        } else if (record.approve_status === TASK_APPROVE_STATUS.passed) {
          return (
            <div>
              <a target="_blank" href={`${ORIGIN}/public/task/details?id=${record._id}&channel_name=${record.channel_name}`}>
                外链
              </a>
              <Divider type="vertical" />
              <Link to={`/writer/task/view?_id=${record._id}`}>
                <span>查看</span>
              </Link>
            </div>
          );
        } else if (record.approve_status === TASK_APPROVE_STATUS.rejected) {
          return (
            <div>
              <a target="_blank" href={`${ORIGIN}/public/task/details?id=${record._id}&channel_name=${record.channel_name}`}>
                外链
              </a>
              <Divider type="vertical" />
              <Link to={`/writer/task/edit?_id=${record._id}`}>
                <span>编辑</span>
              </Link>
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
                <a>发布</a>
              </Popconfirm>
            </div>
          );
        } else if (record.approve_status === TASK_APPROVE_STATUS.publishedToTaobao) {
          return (
            <div>
              <a onClick={() => {this.setState({ extension: record.taobao.url, extensionVisible: true })}}>
                推广
              </a>
              <Divider type="vertical" />
              <a onClick={() => this.handleShowDockPanel(record, 'AnalyzePane')}>
                分析
              </a>
              <Divider type="vertical" />
              <a target="_blank" href={record.taobao ? record.taobao.url : ''}>
                查看
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
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    if (data.approve_status === -1 || data.approve_status === 0) {
      columns.push(opera);
    } else if (data.approve_status === TASK_APPROVE_STATUS.publishedToTaobao || data.approve_status === TASK_APPROVE_STATUS.taobaoAccepted
      || data.approve_status === TASK_APPROVE_STATUS.taobaoRejected) {
      columns.push( pushStatusText, opera);
    } else {
      columns.push( approver, grade, approveTime, opera);
    }
    return (
      <div>
        <div className={styles.searchBox}>
          <RadioGroup value={data.approve_status} onChange={this.changeApproveStatus}>
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
              <RangePicker style={{ width: 240 }} onChange={(value) => this.handleSearch(value,'time')} />
              <Search
                style={{ width: 260, float: 'right' }}
                placeholder="ID／名称／商家标签"
                onSearch={(value) => this.handleSearch(value, 'search')}
                enterButton
              />
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
              rowSelection={rowSelection}
            />
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
        <Extension visible={this.state.extensionVisible} url={this.state.extension} onCancel={this.handleCancel} />
      </div>
    );
  }
}
