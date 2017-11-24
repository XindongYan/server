import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, Checkbox, Modal, message, Radio  } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { RIGHTS, APPROVE_ROLES, ROLES, TASK_APPROVE_STATUS } from '../../constants';
import TaskTitleColumn from '../../components/TaskTitleColumn'
import moment from 'moment';
import styles from './TableList.less';

const FormItem = Form.Item;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@connect(state => ({
  takerTask: state.task.takerTask,
  loading: state.task.takerTaskLoading,
  currentUser: state.user.currentUser,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    selectedRowKeys: [],
    formValues: { approve_status: TASK_APPROVE_STATUS.waitingForApprove },
  };

  componentDidMount() {
    const { dispatch, currentUser } = this.props;
    dispatch({
      type: 'task/fetchTakerTasks',
      payload: { ...this.state.formValues, user_id: currentUser._id }
    });
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
      type: 'task/fetchTakerTasks',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch, currentUser } = this.props;
    form.resetFields();
    dispatch({
      type: 'task/fetchTakerTasks',
      payload: {},
    });
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
        type: 'task/fetchTakerTasks',
        payload: values,
      });
    });
  }

  handleRightsChange = (checkedValues) => {
    this.setState({
      user: { ...this.state.user, rights: checkedValues}
    });
  }
  handleApproveRolesChange = (checkedValues) => {
    this.setState({
      user: { ...this.state.user, approve_role: checkedValues}
    });
  }
  handleRolesChange = (checkedValues) => {
    this.setState({
      user: { ...this.state.user, role: checkedValues}
    });
  }

  handleChangeUser = () => {
    this.props.dispatch({
      type: 'task/update',
      payload: this.state.user,
    });

    message.success('修改成功');
    this.setState({
      modalVisible: false,
    });
  }

  handleShowModal = (user) => {
    this.setState({
      modalVisible: true,
      user,
    });
  }

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  changeApproveStatus = (e) => {
    const { dispatch, currentUser } = this.props;
    dispatch({
      type: 'task/fetchTakerTasks',
      payload: { user_id: currentUser._id, approve_status: e.target.value, }
    });
    this.setState({
      formValues: { ...this.state.formValues, user_id: currentUser._id, approve_status: e.target.value, }
    });
  }
  render() {
    const { takerTask, loading } = this.props;
    const { selectedRows, modalVisible, user, selectedRowKeys, formValues } = this.state;
    const columns = [
      {
        title: '稿子ID',
        dataIndex: 'id',
      },
      {
        title: '内容标题',
        dataIndex: 'title',
        render: (record) => (
          <Link to="http://120.27.215.205/">
            <TaskTitleColumn text={record} length={10}/>
          </Link>
        )
      },
      {
        title: '提交时间',
        dataIndex: 'last_update_time',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
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
    ];
    const approveStatus = {
      title: '审核状态',
      dataIndex: 'approve_status',
      render: value => {
        if (value===0) {
          return '审核中';
        } else if (value===1) {
          return '已通过';
        } else if (value===2) {
          return '未通过';
        }
      }
    }
    const approver = {
      title: '审核人',
      dataIndex: 'approver_id',
      render: value => value ? value.name : '',
    }
    const grade = {
      title: '审核分数',
      dataIndex: 'grade',
      render: value => value < 0 ? 0 : value,
    }
    const approveTime = {
      title: '审核时间',
      dataIndex: 'approve_time',
      render: value => <span>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</span>,
    }
    const opera = {
      title: '操作',
      render: (record) => {
        if (formValues.approve_status === 0 || formValues.approve_status === 1) {
          return (
            <div>
              <Link to="http://120.27.215.205/">
                  <span>详情</span>
              </Link>
            </div>
          )
        } else {
          return (
            <Link to="http://120.27.215.205/">
                <span>编辑</span>
            </Link>
          )
        }
      }
    }
    if (formValues.approve_status === -1){
      columns.push(opera)
    } else if (formValues.approve_status === 0) {
      columns.push( approveStatus, opera)
    } else {
      columns.push( approveStatus, approver, grade, approveTime, opera)
    }
    return (
      <PageHeaderLayout title="">
        <div style={{ marginBottom:'10px' }}>
          <RadioGroup value={formValues.approve_status} onChange={this.changeApproveStatus}>
            <RadioButton value={TASK_APPROVE_STATUS.taken}>已接单</RadioButton>
            <RadioButton value={TASK_APPROVE_STATUS.waitingForApprove}>待审核</RadioButton>
            <RadioButton value={TASK_APPROVE_STATUS.passed}>已通过</RadioButton>
            <RadioButton value={TASK_APPROVE_STATUS.rejected}>未通过</RadioButton>
          </RadioGroup> 
        </div>
        <Card bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              
            </div>
            <Table
              loading={loading}
              rowKey={record => record.key}
              dataSource={takerTask.list}
              columns={columns}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                ...takerTask.pagination,
              }}
              onChange={this.handleStandardTableChange}
              rowKey="_id"
            />
          </div>
        </Card>
        <Modal
          title="配置用户"
          visible={modalVisible}
          onOk={this.handleChangeUser}
          onCancel={() => this.handleModalVisible()}
        >
          
        </Modal>
      </PageHeaderLayout>
    );
  }
}