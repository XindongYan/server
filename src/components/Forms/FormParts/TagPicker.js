import React, { PureComponent } from 'react';
import { connect } from 'dva';
import $ from 'jquery';
import { Input, Icon, message, Cascader, Checkbox, Row, Col, Tag, Tabs } from 'antd';
import styles from './index.less';

const CheckboxGroup = Checkbox.Group;
const TabPane = Tabs.TabPane;

@connect(state => ({

}))

export default class TagPicker extends PureComponent {
  state = {
    tabsKey: '',
    checkData: [],
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
    const { checkData } = this.state;
    if (this.props.onChange) {this.props.onChange(e)}
  }
  handleCheckbox = () => {
    return (<div>
      <CheckboxGroup disabled={this.props.disabled} options={this.state.checkData} onChange={this.handleChange} value={this.props.formData} className={styles.ificationCheck} />
    </div>)
  }
  handleCloseTags = (chooseItem) => {
    const { checkData } = this.state;
    var arr = this.props.formData;
    const index = arr.findIndex((item) => {return item === chooseItem});
    arr.splice(index, 1);
    if (this.props.onChange) {this.props.onChange([...arr])}
  }
  renderTags = (item) => {
    const { dataSource, disabled } = this.props;
    const closable = !disabled ? 'closable' : '';
    let label = '';
    Object.keys(dataSource).forEach(key => {
      const result = dataSource[key].find(item1 => item1.value === item);
      if (result) label = result.label;
    });
    if (disabled) {
      return (<Tag onClose={() => this.handleCloseTags(item)} style={{ padding: '0 8px'}} key={item}>{label}</Tag>);
    } else {
      return (<Tag closable onClose={() => this.handleCloseTags(item)} style={{ padding: '0 8px'}} key={item}>{label}</Tag>)
    }
    
  }
  render() {
    const { formData } = this.props;
    const { tabsKey } = this.state;
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
          <p>已选 <a>{formData.length}</a> 个项目</p>
          <div style={{ padding: '10px 0' }}>
            {formData.map(item => this.renderTags(item))}
          </div>
          <p style={{ color: '#f00' }}>{formData.length > 1 ? '只能选择一个项目' : ''}</p>
        </div>
      </div>
    );
  }
}
