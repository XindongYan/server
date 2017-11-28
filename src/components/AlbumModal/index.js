import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Modal, message, Tabs, Icon, Upload, Button} from 'antd';
import { QINIU_DOMAIN, QINIU_UPLOAD_DOMAIN } from '../../constants';
import styles from './index.less';
const TabPane = Tabs.TabPane;

@connect(state => ({
  currentUser: state.user.currentUser,
  list: state.album.data.list,
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
    if (this.props.onOk) this.props.onOk(this.state.choosen);
    this.props.dispatch({
      type: 'album/hide',
    });
  }
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'album/hide',
    });
  }
  handleChoose = (photo) => {
    const index = this.state.choosen.findIndex(item => item._id === photo._id)
    if (index === -1) {
      this.setState({ choosen: [ ...this.state.choosen, photo ] });
    } else {
      const choosed = [...this.state.choosen];
      choosed.splice(index,1);
      this.setState({ choosen: [...choosed] });
    }
  }
  renderPhoto = (photo,index) => {
    const isChoosen = this.state.choosen.find(item => item._id === photo._id);
    return (
      <Card style={{ width: 140, display: 'inline-block', margin: 5 }} bodyStyle={{ padding: 0 }} key={photo._id}
      onClick={() => this.handleChoose(photo)}>
        <div className={styles.customImageBox}>
          <img className={styles.customImage} alt="example" width="100%" src={`${photo.href}?imageView2/2/w/300/h/300/q/100`} />
          <div style={{display: this.state.choosen.find(item => item._id === photo._id) ? 'block' : 'none'}} className={styles.chooseModal}>
            
          </div> 
        </div>
        <div className="custom-card">
          <p className={styles.customNodes}>{photo.width} * {photo.height}</p>
          <p className={styles.customNodes}>{photo.originalname}</p>
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
        <Tabs defaultActiveKey="album">
          <TabPane tab={<span><Icon type="apple" />Tab 1</span>} key="album">
            <div>
              {list.map(this.renderPhoto)}
            </div>
          </TabPane>
          <TabPane tab={<span><Icon type="android" />Tab 2</span>} key="upload">
            <div>
              <Upload name="file"
                action={QINIU_UPLOAD_DOMAIN}
                showUploadList={false} 
                data={this.makeUploadData} 
                onChange={this.handleChange}
                listType="picture-card"
              >
                <div style={{width: '800px', 'margin': 'auto'}}>
                  <Icon type="plus" />
                  <div className="ant-upload-text">Upload</div>
                </div>
              </Upload>
            </div>
              
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}
