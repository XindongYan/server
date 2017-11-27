import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Icon, Button, Dropdown, Menu, Modal, Col, Row } from 'antd';
import moment from 'moment';
import styles from './index.less';
import { routerRedux } from 'dva/router';

@connect(state => ({

}))

export default class ProjectCard extends PureComponent {
  state = {
   
  }

  componentDidMount() {
    
  }
  componentWillReceiveProps(nextProps) {
    
  }

  projectInto = () => {
    this.props.dispatch(routerRedux.push('/taskSquare/task/list'));
  }
  render() {
    const { item } = this.props;
    return (
      <Col span={8} onClick={() => this.projectInto()}>
        <Card title={item.title} className={styles.cardCol}>
          <p>商家标签：{ item.merchant_tag ? item.merchant_tag : '无' }</p>
          <p>项目描述：{ item.desc ? item.desc : '无' }</p>
          <p>截止日期：{ item.deadline ? moment(item.deadline).format('YYYY-MM-DD HH:mm:ss') : '无' }</p>
          <p>项目奖励：{ item.price ? item.price : '无' }</p>
        </Card>
      </Col>
    );
  }
}
