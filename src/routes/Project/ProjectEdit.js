import React, { PureComponent } from 'react';
import ProjectForm from './ProjectForm';
export default class ProjectEdit extends PureComponent {
  render() {
    return (<ProjectForm operation="edit" location={this.props.location}/>);
  }
}
