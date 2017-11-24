import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Modal, message } from 'antd';

export default class AlbumModal extends PureComponent {
  state = {
    choosen: [],
  }
  componentDidMount() {
    
  }
  componentWillReceiveProps(nextProps) {
    
  }
  handleOk = () => {
    console.log(this.state.choosen);
    if (this.props.onOk) this.props.onOk(this.state.choosen);
  }
  handleCancel = () => {
    const { dispatch } = this.props;
    
  }

  render() {
    const { list, loading, visible } = this.props;
    return (
      <div />
    );
  }
}
