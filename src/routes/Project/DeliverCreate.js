import React, { PureComponent } from 'react';
import ProjectForm from './ProjectForm';
export default class DeliverCreate extends PureComponent {
  render() {
    return (<ProjectForm operation="create" type={2}/>);
  }
}
