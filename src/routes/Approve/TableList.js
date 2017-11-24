import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, Checkbox, Modal, message, Radio } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { RIGHTS, APPROVE_ROLES, ROLES, TASK_APPROVE_STATUS } from '../../constants';
import TaskTitleColumn from '../../components/TaskTitleColumn'
import { Link } from 'dva/router';
import moment from 'moment';
import styles from './TableList.less';

const FormItem = Form.Item;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@connect(state => ({
  data: state.approve.data,
  loading: state.approve.loading,
  currentUser: state.user.currentUser,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    selectedRowKeys: [],
    formValues: { approve_status: TASK_APPROVE_STATUS.waitingForApprove },
    user: {},
  };

  componentDidMount() {
    const { dispatch, data: { pagination }, currentUser } = this.props;
    dispatch({
      type: 'approve/fetch',
      payload: { ...pagination, ...this.state.formValues, user_id: currentUser._id }
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, currentUser } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      user_id: currentUser._id,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'approve/fetch',
      payload: params,
    });
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {

    this.setState({ selectedRowKeys, selectedRows });
  }
  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form, currentUser } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        user_id: currentUser._id,
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'approve/fetch',
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
      type: 'approve/update',
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
    const { data: { pagination }, dispatch, currentUser } = this.props;
    dispatch({
      type: 'approve/fetch',
      payload: { ...pagination, ...this.state.formValues, user_id: currentUser._id, approve_status: e.target.value, }
    });
    this.setState({
      formValues: { ...this.state.formValues, user_id: currentUser._id, approve_status: e.target.value, }
    });
  }
  render() {
    const { data, loading, } = this.props;
    const { selectedRows, modalVisible, formValues, selectedRowKeys } = this.state;
    const columns = [
      {
        title: '稿子ID',
        dataIndex: 'id',
      },
      {
        title: '内容标题',
        dataIndex: 'title',
        width: 200,
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
        title: '修改',
        dataIndex: 'update_times',
      },
      {
        title: '写手',
        dataIndex: 'publisher_id',
        sorter: true,
        render: val => val ? val.name : '',
      },
      {
        title: '发布渠道',
        dataIndex: 'channel_name',
        render: val => val[0] || '',
      },
      {
        title: '商家标签',
        dataIndex: 'merchant_tag',
        render: val => val ? val : '',
      },
      {
        title: '审核状态',
        dataIndex: 'approve_status',
        render: val => {
          if (!val) {
            return '待审核';
          } else if (val===1) {
            return '已通过';
          } else if (val===2) {
            return '未通过';
          }
        }
      },
    ];
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
        if (formValues.approve_status === 0) {
          return (
            <div>
              <Link to="http://120.27.215.205/">
                  <span>审核</span>
              </Link>
              <span className={styles.splitLine} />
              <a onClick={() => this.handleShowModal(record)}>退回</a>
            </div>
          )
        } else {
          return (
            <Link to="http://120.27.215.205/">
                <span>详情</span>
            </Link>
          )
        }
      },
    }
    if (formValues.approve_status === 0){
      columns.push(opera)
    } else {
      columns.push( approver, grade, approveTime, opera)
    }
    return (
      <PageHeaderLayout title="">
	      <div style={{ marginBottom:'10px' }}>
          <RadioGroup value={formValues.approve_status} onChange={this.changeApproveStatus}>
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
              dataSource={data.list}
              columns={columns}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                ...data.pagination,
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
