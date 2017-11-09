import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, Checkbox, Modal, message } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { RIGHTS, APPROVE_ROLES, ROLES } from '../../constants';
import styles from './TableList.less';

const FormItem = Form.Item;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  rule: state.rule,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    user: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
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
      type: 'rule/fetch',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'rule/fetch',
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
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
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
        type: 'rule/fetch',
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
      type: 'rule/update',
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

  render() {
    const { rule: { loading: ruleLoading, data } } = this.props;
    const { selectedRows, modalVisible, user } = this.state;

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderLayout title="用户">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
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
            <StandardTable
              selectedRows={selectedRows}
              loading={ruleLoading}
              data={data}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              onUpdateUser={this.handleShowModal}
            />
          </div>
        </Card>
        <Modal
          title="配置用户"
          visible={modalVisible}
          onOk={this.handleChangeUser}
          onCancel={() => this.handleModalVisible()}
        >
          <FormItem
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            label="权限"
          >
            <CheckboxGroup options={RIGHTS} value={user.rights} onChange={this.handleRightsChange} />
          </FormItem>
          <FormItem
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            label="审批角色"
          >
            <CheckboxGroup options={APPROVE_ROLES} value={user.approve_role} onChange={this.handleApproveRolesChange} />
          </FormItem>
          <FormItem
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            label="角色"
          >
            <CheckboxGroup options={ROLES} value={user.role} onChange={this.handleRolesChange} />
          </FormItem>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
