import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, Checkbox, Modal, message, Radio } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { RIGHTS, APPROVE_ROLES, ROLES } from '../../constants';
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
  approve: state.approve,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    selectedRowKeys: [],
    formValues: {},
    user: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'approve/fetch',
      payload: {approve_status: -1}
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
      type: 'approve/fetch',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'approve/fetch',
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
          type: 'approve/remove',
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
  changeListWithStatus = (e) => {
    console.log(e.target.value);
    this.setState({
      value3: e.target.value,
    });
  }
  render() {
    const { approve: { loading: ruleLoading, data } } = this.props;
    const { selectedRows, modalVisible, user, selectedRowKeys } = this.state;

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );
    const columns = [
      {
        title: '稿子ID',
        dataIndex: 'id',
      },
      {
        title: '内容标题',
        dataIndex: 'title',
        render: (record) => (
          <Link to="">
            <span>{record}</span>
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
      {
        title: '操作',
        render: (record) => (
          <div>
            <Link to="http://120.27.215.205/">
                <span>审核</span>
            </Link>
            <span className={styles.splitLine} />
            <a onClick={() => this.handleShowModal(record)}>退回</a>
          </div>
        ),
      },
    ];


    return (
      <PageHeaderLayout title="">
	      <div style={{ background: '#fff' , marginBottom:'10px' }}>
          <RadioGroup defaultValue="0" onChange={this.changeListWithStatus}>
            <RadioButton value="0">待审核</RadioButton>
            <RadioButton value="1">已通过</RadioButton>
            <RadioButton value="2">未通过</RadioButton>
          </RadioGroup> 
        </div>
        <Card bordered={false} bodyStyle={{ padding: 0 }}>
        
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              
            </div>
            
            <Table
              loading={ruleLoading}
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
