import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect(state => ({
  tasks: state.taskSquare.tasks,
  loading: state.taskSquare.projectsLoading,
}))

export default class FlowList extends PureComponent {
  state = {
   
  }

  componentDidMount() {
    
  }
  componentWillReceiveProps(nextProps) {
    
  }

  
  render() {
    
    return (
      <div />
    );
  }
}
