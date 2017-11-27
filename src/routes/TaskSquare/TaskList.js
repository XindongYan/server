import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Dropdown, Menu, Modal, message, Col, Row } from 'antd';
import styles from './index.less';
import TaskCard from './TaskCard';

@connect(state => ({
  tasks: state.taskSquare.tasks,
  loading: state.taskSquare.projectsLoading,
}))

export default class TaskList extends PureComponent {
  state = {
   
  }

  componentDidMount() {
    
  }
  componentWillReceiveProps(nextProps) {
    
  }

  
  render() {
    const arr = [
      {title: "12345",desc: "asd",id: "0"},
      {title: "12345",desc: "asd",id: "1"},
      {title: "12345",desc: "asd",id: "2"},
      {title: "12345",desc: "asd",id: "3"},
    ];
    return (
      <Card bordered={false} bodyStyle={{ padding: "10px" }} className="myCard">
        <Row gutter={16}>
          {arr.map((item,index) => 
            <TaskCard item={item} key={index} />)
          }
        </Row>
      </Card>
    );
  }
}
