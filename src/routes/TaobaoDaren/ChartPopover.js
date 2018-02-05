import React, { PureComponent } from 'react';
import { Popover } from 'antd';
import G2 from '@antv/g2';

export default class ChartPopover extends PureComponent {
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
        if (visible && document.getElementById(`chart_${data.field}_${data._id}`)) {
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
    const chart = this.state.chart || new G2.Chart({
      container: document.getElementById(`chart_${data.field}_${data._id}`),
      forceFit: true,
      height: 400,
    });
    const total = data.list.map(item => item.value).reduce((a, b) => a + b, 0);
    const list = data.list.map(item => ({...item, percent: item.value / total }));
    chart.source(list);
    chart.coord('theta', {
      radius: 0.8 // 设置饼图的大小
    });
    chart.legend('title', {
      offsetX: 30,
    });
    chart.axis('percent', {
      title: null,
    });
    chart.axis('title', {
      title: null,
    });
    // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
    chart.intervalStack()
    .position('percent')
    .color('title')
    .label('percent', {
      formatter: (val, item) => {
        return item.point.title + ': ' + ( val * 100).toFixed(2) + '%';
      }
    });
    // Step 4: 渲染图表
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
        title={this.props.data.title}
        content={
          <div id={`chart_${data.field}_${data._id}`}
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
