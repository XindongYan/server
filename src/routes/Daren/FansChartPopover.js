import React, { PureComponent } from 'react';
import { Popover } from 'antd';
import G2 from '@antv/g2';

export default class FansChartPopover extends PureComponent {
  state = {
    visible: false,
    chart: null,
  }

  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
  }
  handleVisibleChange = (visible) => {
    const { data } = this.props;
    this.setState({ visible }, () => {
      setTimeout(() => {
        if (visible && document.getElementById(`chart_fansCounts_${data._id}`)) {
          this.renderChart(data);
        } else {
          if (this.state.chart)
            this.state.chart.clear();
        }
      }, 50);
      
    });
  }
  hide = () => {
    this.setState({
      visible: false,
    });
  }
  renderChart = (data) => {
    const list = data.list.map((item, index) => {
      let year = `${data.list.length - index - 1}天前`;
      if (index === data.list.length - 1) {
        year = `今天`;
      }
      return {year, value: Number((item/10000).toFixed(1))}
    });
    const chart = this.state.chart || new G2.Chart({
      container: document.getElementById(`chart_fansCounts_${data._id}`),
      forceFit: true,
      height: 400,
    });
    chart.source(list);
    chart.scale('value', {
      min: 0,
      alias: '粉丝',
      formatter: value => `${value}万`,
    });
    chart.scale('year', {
      range: [ 0 , 1 ]
    });
    chart.tooltip({
      crosshairs: {
        type: 'line'
      }
    });
    chart.line().position('year*value');
    chart.point().position('year*value').size(4).shape('circle').style({
      stroke: '#fff',
      lineWidth: 1
    });
    chart.render();
    if (!this.state.chart) {
      this.setState({ chart });
    }
  }
  render() {
    const { data } = this.props;
    // console.log(this.props.data);
    return (
      <Popover
        placement="right"
        title="一周粉丝变化情况"
        content={
          <div id={`chart_fansCounts_${data._id}`}
            style={{ width: 600 }}>
            {data.list.length === 0 && <div style={{ textAlign: 'center' }}>无数据</div>}
          </div>}
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
      >
      {this.props.children}</Popover>
    );
  }
}
