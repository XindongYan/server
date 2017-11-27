import React, { PureComponent } from 'react';

export default class AlbumModal extends PureComponent {
  state = {
  }
  // componentDidMount() {
  // }
  // componentWillReceiveProps(nextProps) {
  // }
  handleOk = () => {
    if (this.props.onOk) this.props.onOk(this.state.choosen);
  }
  render() {
    // const { list } = this.props;
    return (
      <div>6789hjj</div>
    );
  }
}
