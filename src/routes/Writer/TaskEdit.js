import React, { PureComponent } from 'react';
import TaskForm from './TaskForm';

export default class TaskEdit extends PureComponent {
  render() {
    return (
      <TaskForm operation="edit" location={this.props.location}/>
    );
  }
}
