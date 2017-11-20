import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Input, Select, Icon, Button, Modal, Table, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './FlowList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  flow: state.flow,
  teamUser: state.user.teamUser,
}))
@Form.create()
export default class ApproveRoleList extends PureComponent {
  state = {
    id: 1,
    name: '',
    modalVisible: false,
  };

  componentDidMount() {
    const { dispatch, teamUser } = this.props;
    if (teamUser.team_id) {
      dispatch({
        type: 'flow/fetchApproveRoles',
        payload: {
          team_id: teamUser.team_id,
        },
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { approveRoles } = nextProps.flow;
    if (approveRoles.length > 0) {
      this.setState({ id: approveRoles[approveRoles.length - 1].id + 1 });
    }
    const { dispatch, teamUser } = nextProps;
    if (teamUser.team_id !== this.props.teamUser.team_id) {
      dispatch({
        type: 'flow/fetchApproveRoles',
        payload: {
          team_id: teamUser.team_id,
        },
      });
    }
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
        type: 'flow/fetchApproveRoles',
        payload: values,
      });
    });
  }

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  handleAdd = () => {
    this.props.dispatch({
      type: 'flow/addApproveRole',
      payload: {
        team_id: this.props.teamUser.team_id,
        id: this.state.id,
        name: this.state.name,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  }
  render() {
    const { flow: { approveRolesLoading, approveRoles } } = this.props;
    const { selectedRows, modalVisible, id, name, selectedRowKeys } = this.state;
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
      },
      {
        title: '操作',
        render: (record) => (
          <p>
            
          </p>
        ),
      },
    ];
    return (
      <PageHeaderLayout title="">
        <Card bordered={false} bodyStyle={{ padding: 14 }}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>新建</Button>
            </div>
            <Table
              loading={approveRolesLoading}
              dataSource={approveRoles}
              columns={columns}
              rowKey="_id"
            />
          </div>
        </Card>
        <Modal
          title="新建审批角色"
          visible={modalVisible}
          onOk={this.handleAdd}
          onCancel={() => this.handleModalVisible()}
        >
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="id"
          >
            <Input placeholder="请输入" type="number" value={id} onChange={e => this.setState({ id: Number(e.target.value) })}/>
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="名称"
          >
            <Input placeholder="请输入" onChange={e => this.setState({ name: e.target.value })} value={name} />
          </FormItem>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
