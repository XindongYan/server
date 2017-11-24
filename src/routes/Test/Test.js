import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Badge, Row, Col, Card, Icon, Button, Dropdown, Menu } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { RIGHTS, APPROVE_ROLES, ROLES } from '../../constants';
import styles from '../List/TableList.less';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  task: state.task,
}))
export default class taskTest extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    user: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'task/fetch',
      payload: {approve_status: -1}
    });
  }
  
  render() {
  	const columns = [{
    title: 'Name',
    dataIndex: 'name',
    render: text => <a href="#">{text}</a>,
  }, {
    title: 'Cash Assets',
    className: 'column-money',
    dataIndex: 'money',
  }, {
    title: 'Address',
    dataIndex: 'address',
  }];

  const data = [{
    key: '1',
    name: 'John Brown',
    money: '￥300,000.00',
    address: 'New York No. 1 Lake Park',
  }, {
    key: '2',
    name: 'Jim Green',
    money: '￥1,256,000.00',
    address: 'London No. 1 Lake Park',
  }, {
    key: '3',
    name: 'Joe Black',
    money: '￥120,000.00',
    address: 'Sidney No. 1 Lake Park',
  }];
    return (
      <PageHeaderLayout title="">
    		<Table
		    columns={columns}
		    dataSource={data}
		  />
      </PageHeaderLayout>
    );
  }
}
