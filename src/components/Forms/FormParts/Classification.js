import React, { PureComponent } from 'react';
import { connect } from 'dva';
import $ from 'jquery';
import { Input, Icon, message, Cascader, Checkbox, Row, Col, Tag, Tabs } from 'antd';
import { ORIGIN } from '../../../constants';
import styles from './index.less';

const CheckboxGroup = Checkbox.Group;
const TabPane = Tabs.TabPane;

@connect(state => ({

}))

export default class Classification extends PureComponent {
  state = {
    dataSource: [],
    chooseClass: [],
    chooseValue: [],
  }
  componentDidMount() {
    if (this.props.formData && this.props.formData.length > 0){
      this.handleChange(this.props.formData);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.formData.length <= 0 && nextProps.formData.length > 0){
      this.handleChange(nextProps.formData);
    }
  }
  componentWillUnmount() {
  }
  handleTaskChange = (e) => {

  }
  handleChange = (e) => {
    const { dataSource } = this.props;
    const arr = [];
    e.map((item, index) => {
      arr.push(dataSource.find((data) => { return data.value === item ? data : '' }));
    })
    this.setState({
      chooseValue: e,
      chooseClass: arr,
    })
    if (this.props.onChange) {this.props.onChange(e)}
  }
  render() {
    const { formData, dataSource } = this.props;
    const { chooseClass, chooseValue } = this.state;
    return (
      <div style={{ padding: '10px 30px 20px'}}>
        <p className={styles.lineTitleDefult}>
          分类
        </p>
        <Row>
        
            <div>
              <Tabs tabPosition="left">
                <TabPane tab="Tab 1" key="1">Content of Tab 1</TabPane>
                <TabPane tab="Tab 2" key="2">Content of Tab 2</TabPane>
                <TabPane tab="Tab 3" key="3">Content of Tab 3</TabPane>
              </Tabs>
              <a>潮流热点</a>
            </div>
          <Col span={4}>
          </Col>
          <Col span={16}>
            <div className={styles.classificatiomBox}>
              <Checkbox.Group onChange={this.handleChange} value={chooseValue}>
                <Row>
                  {//dataSource.map(item => <Col style={{ marginBottom: 10 }} key={item.value} span={12}><Checkbox value={item.value}>{item.label}</Checkbox></Col>)
                }
                </Row>
              </Checkbox.Group>
            </div> 
          </Col>
        </Row>
        <div style={{ marginTop: 10 }}>
          <p>已选 <a>{chooseValue.length}</a> 个项目</p>
          <div style={{ padding: '10px 0' }}>
            {chooseClass.map(item => <Tag style={{ padding: '0 8px'}} key={item.value}>{item.label}</Tag>)}
          </div>
          <p style={{ color: '#f00' }}>{chooseValue.length > 1 ? '只能选择一个项目' : ''}</p>
        </div>
      </div>
    );
  }
}
