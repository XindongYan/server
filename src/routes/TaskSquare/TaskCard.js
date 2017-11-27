import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Dropdown, Menu, Modal, Col, Row } from 'antd';
import moment from 'moment';
import styles from './index.less';

@connect(state => ({

}))

export default class TaskCard extends PureComponent {
  state = {
   
  }

  componentDidMount() {
    
  }
  componentWillReceiveProps(nextProps) {
    
  }

  
  render() {
    const { item, index } = this.props;
    const colorArr = ['#6a6aff','#2894ff','#00ffff','#1afd9c','#ffa042','#ffd306','#ff8040','#cf9e9e','#c07ab8','#a6a6d2'];
    return (
      <Col span={4} key={index} style={{margin: "5px"}}>
        <Card style={{ width: "100%" }} bodyStyle={{ padding: 0 }}>
          <div className={styles.customImage} style={{ background: colorArr[item.id%8] }}>
          </div>
          <div className={styles.customCard}>
            <h3>{item.title}</h3>
            <p>商家标签:{item.desc}</p>
            <div className={styles.customBtn}>
              <Button size="small" type="primary">抢单</Button>
            </div>
          </div>
        </Card>
      </Col>
    );
  }
}
