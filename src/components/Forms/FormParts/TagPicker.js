import React, { PureComponent } from 'react';
import { Checkbox, Tag, Tabs } from 'antd';
import styles from './index.less';

const CheckboxGroup = Checkbox.Group;
const TabPane = Tabs.TabPane;

export default class TagPicker extends PureComponent {
  state = {
    tabsKey: '',
    checkData: [],
    dataParent: [],
  }
  componentDidMount() {
    if (this.props.props.dataSource) {
      const dataParent = Object.keys(this.props.props.dataSource);
      const { props } = this.props;
      this.setState({
        tabsKey: dataParent[0],
        checkData: props.dataSource[dataParent[0]],
        dataParent
      })
    }
  }
  componentWillUnmount() {
  }

  handleChangeTabs = (e) => {
    this.setState({
      tabsKey: e,
      checkData: this.props.props.dataSource[e],
    })
  }
  handleChange = (e) => {
    const { checkData } = this.state;
    if (this.props.onChange) {this.props.onChange(e)}
  }
  renderCheckbox = () => {
    return (<div>
      <CheckboxGroup disabled={this.props.disabled} options={this.state.checkData} onChange={this.handleChange}
      value={this.props.props.value} className={styles.ificationCheck} />
    </div>)
  }
  handleCloseTags = (chooseItem) => {
    const { checkData } = this.state;
    var arr = this.props.props.value;
    const index = arr.findIndex((item) => {return item === chooseItem});
    arr.splice(index, 1);
    if (this.props.onChange) {this.props.onChange([...arr])}
  }
  renderTags = (item) => {
    const { props, disabled } = this.props;
    const closable = !disabled ? 'closable' : '';
    let label = '';
    Object.keys(props.dataSource).forEach(key => {
      const result = props.dataSource[key].find(item1 => item1.value === item);
      if (result) label = result.label;
    });
    if (disabled) {
      return (<Tag onClose={() => this.handleCloseTags(item)} style={{ padding: '0 8px'}} key={item}>{label}</Tag>);
    } else {
      return (<Tag closable onClose={() => this.handleCloseTags(item)} style={{ padding: '0 8px'}} key={item}>{label}</Tag>)
    }
    
  }
  render() {
    const { props } = this.props;
    const { tabsKey } = this.state;
    return (
      <div style={{ padding: '10px 30px 20px'}}>
        <p className={styles.lineTitleDefult}>
          分类
        </p>
        <div>
          { this.state.dataParent && this.state.dataParent.length > 0 &&
            <Tabs className={styles.ificationTabs} type="card" tabPosition="left" activeKey={tabsKey} onChange={this.handleChangeTabs}>
              {this.state.dataParent.map((item) => <TabPane tab={item} key={item}>{this.renderCheckbox()}</TabPane>)}
            </Tabs>
          }
        </div>

        <div style={{ marginTop: 10 }}>
          <p>已选 <a>{props.value.length}</a> 个项目</p>
          <div style={{ padding: '10px 0' }}>
            {props.value.map(item => this.renderTags(item))}
          </div>
          <p style={{ color: '#f00' }}>{props.value.length > 1 ? '只能选择一个项目' : ''}</p>
        </div>
      </div>
    );
  }
}
