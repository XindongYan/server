import React, { PureComponent } from 'react';
import ProjectForm from './ProjectForm';
export default class ActivityCreate extends PureComponent {
  render() {
    return (<ProjectForm operation="create" type={1}/>);
  }
}
