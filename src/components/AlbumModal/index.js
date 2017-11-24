import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Modal, message } from 'antd';

@connect(state => ({
  currentUser: state.user.currentUser,
  list: state.album.list,
  loading: state.album.loading,
  visible: state.album.visible,
}))

export default class AlbumModal extends PureComponent {
  state = {
    choosen: [],
  }
  componentDidMount() {
    const { dispatch, currentUser } = this.props;
    dispatch({
      type: 'album/fetch',
      payload: { user_id: '59fc4f3cf974bd56678cd50a' || currentUser._id }
    });
  }
  componentWillReceiveProps(nextProps) {
    const { dispatch, currentUser } = nextProps;
    if (!this.props.visible && nextProps.visible) {
      dispatch({
        type: 'album/fetch',
        payload: { user_id: currentUser._id }
      });
    }
  }
  handleOk = () => {
    console.log(this.state.choosen);
    if (this.props.onOk) this.props.onOk(this.state.choosen);
  }
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'album/hide',
    });
  }
  handleChoose = (photo) => {
    if (!this.state.choosen.find(item => item._id === photo._id)) {
      this.setState({ choosen: [ ...this.state.choosen, photo ] });
    }
  }
  renderPhoto = (photo) => {
    const isChoosen = this.state.choosen.find(item => item._id === photo._id);
    return (
      <Card style={{ width: 140, display: 'inline-block', margin: 5 }} bodyStyle={{ padding: 0 }} key={photo._id}
      onClick={() => this.handleChoose(photo)}>
        <div className="custom-image">
          <img style={{ display: 'block' }} alt="example" width="100%" src={`${photo.href}?imageView2/2/w/300/h/300/q/100`} />
        </div>
        <div className="custom-card">
          <h3>{photo.width} x {photo.height}</h3>
          <p style={{ color: "#999" }}>{photo.originalname}</p>
        </div>
      </Card>
    );
  }
  render() {
    const { list, loading, visible } = this.props;
    return (
      <Modal
        title="素材"
        width="80%"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        {list.map(this.renderPhoto)}
      </Modal>
    );
  }
}
