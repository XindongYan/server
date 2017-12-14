import React, { PureComponent } from 'react';
import ProjectForm from './ProjectForm';
export default class ProjectCreate extends PureComponent {
  render() {
    return (<ProjectForm operation="create"/>);
  }
}
