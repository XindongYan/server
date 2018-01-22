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
    tabsKey: '',
    checkData: [],
    chooseClass: [],
    chooseValue: [],
  }
  componentDidMount() {
    if (this.props.formData && this.props.formData.length > 0){
      this.handleChange(this.props.formData);
    }

    if (this.props.dataSource && this.props.dataSource[this.props.dataParent[0]]) {
      const { dataSource, dataParent } = this.props;
      this.setState({
        tabsKey: dataParent[0],
        checkData: dataSource[dataParent[0]],
      })
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.formData.length <= 0 && nextProps.formData.length > 0){
      this.handleChange(nextProps.formData);
    }
    if (!this.props.dataSource[this.props.dataParent[0]] && nextProps.dataSource[nextProps.dataParent[0]]) {
      const { dataSource, dataParent } = nextProps;
      this.setState({
        tabsKey: dataParent[0],
        checkData: dataSource[dataParent[0]],
      })
    }
  }
  componentWillUnmount() {
  }

  handleChangeTabs = (e) => {
    this.setState({
      tabsKey: e,
      checkData: this.props.dataSource[e],
    })
  }
  handleChange = (e) => {
    const { checkData, chooseValue, chooseClass } = this.state;
    const arr = [];
    chooseClass.map((item) => {
      if (item.parent !== this.state.tabsKey) {
        arr.push(item);
      }
    })
    e.map((item) => {
      arr.push(checkData.find((data) => { return data.value === item ? data : '' }));
    })
    this.setState({
      chooseValue: e,
      chooseClass: arr,
    })
    console.log(arr);
    if (this.props.onChange) {this.props.onChange(e)}
  }
  handleCheckbox = () => {
    return (<div>
      <CheckboxGroup options={this.state.checkData} onChange={this.handleChange} className={styles.ificationCheck} />
    </div>)
  }
  handleClose = (item) => {
    console.log(item);
    const { checkData, chooseValue, chooseClass } = this.state;
    var arr = chooseClass;
    arr.findIndex()
  }
  render() {
    const { formData } = this.props;
    const { chooseClass, chooseValue, tabsKey } = this.state;
    return (
      <div style={{ padding: '10px 30px 20px'}}>
        <p className={styles.lineTitleDefult}>
          分类
        </p>
        <div>
          { this.props.dataParent && this.props.dataParent.length > 0 &&
            <Tabs className={styles.ificationTabs} type="card" tabPosition="left" activeKey={tabsKey} onChange={this.handleChangeTabs}>
              {this.props.dataParent.map((item) => <TabPane tab={item} key={item}>{this.handleCheckbox()}</TabPane>)}
            </Tabs>
          }
        </div>

        <div style={{ marginTop: 10 }}>
          <p>已选 <a>{chooseClass.length}</a> 个项目</p>
          <div style={{ padding: '10px 0' }}>
            {chooseClass.map(item => <Tag closable onClose={() => this.handleClose(item)} style={{ padding: '0 8px'}} key={item.value}>{item.label}</Tag>)}
          </div>
          <p style={{ color: '#f00' }}>{chooseClass.length > 1 ? '只能选择一个项目' : ''}</p>
        </div>
      </div>
    );
  }
}
