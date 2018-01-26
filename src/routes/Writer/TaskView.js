import React, { PureComponent } from 'react';
import TaskForm from './TaskForm';

export default class TaskView extends PureComponent {
  render() {
    return (
      <TaskForm operation="view" location={this.props.location}/>
    );
  }
}
