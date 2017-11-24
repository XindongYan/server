import React, { PureComponent } from 'react';
import TaskForm from './TaskForm';
export default class TaskCreate extends PureComponent {
  render() {
    return (<TaskForm operation="create"/>);
  }
}
