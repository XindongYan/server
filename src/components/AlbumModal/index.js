import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Modal, message, Tabs, Icon, Upload, Button, Pagination} from 'antd';
import { QINIU_DOMAIN, QINIU_UPLOAD_DOMAIN } from '../../constants';
import path from 'path';
import styles from './index.less';
const TabPane = Tabs.TabPane;

@connect(state => ({
  currentUser: state.user.currentUser,
  data: state.album.data,
  loading: state.album.loading,
  visible: state.album.visible,
  qiniucloud: state.qiniucloud,
}))

export default class AlbumModal extends PureComponent {
  state = {
    choosen: [],
    pagination: {
      pageSize: 12,
      current: 1,
    },
  }
  componentDidMount() {
    const { dispatch, currentUser } = this.props;
    dispatch({
      type: 'album/fetch',
      payload: {
        user_id: currentUser._id,
        ...this.state.pagination,
        currentPage: this.state.pagination.current,
      }
    });
    dispatch({
      type: 'qiniucloud/fetchUptoken'
    });
  }
  componentWillReceiveProps(nextProps) {
    const { dispatch, currentUser, data: { pagination } } = nextProps;
    this.setState({ pagination });
    if (!this.props.visible && nextProps.visible) {
      dispatch({
        type: 'album/fetch',
        payload: {
          user_id: currentUser._id,
          ...this.state.pagination,
          currentPage: this.state.pagination.current,
        }
      });
    }
  }
  handleOk = () => {
    if (this.props.onOk) this.props.onOk(this.state.choosen);
    console.log(this.state.choosen)
    this.setState({ choosen: [] });
    this.props.dispatch({
      type: 'album/hide',
    });
  }
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'album/hide',
    });
    this.setState({ choosen: [] });
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
  makeUploadData = (file) => {
    const { qiniucloud } = this.props;
    const extname = path.extname(file.name);
    return {
      token: qiniucloud.uptoken,
      key: `${file.uid}${extname}`,
    }
  }
  handleChange = async ({file,fileList}) => {
    const { dispatch, currentUser } = this.props;
    const payload = {
      user_id: currentUser._id,
      originalname: file.name,
      album_name: '相册一',
    };
    this.setState({ choosen: fileList });
    if (file.status === 'done' && file.response && !file.error) {
      const url = `${QINIU_DOMAIN}/${file.response.key}`;
      payload.href = url;
      const result = await fetch(`${url}?imageInfo`, {
        Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      }).then(response => response.json());
      payload.width = result.width;
      payload.height = result.height;
      dispatch({
        type: 'album/add',
        payload,
        callback: (result1) => {
          if (result1.error) {
            message.error(result1.msg);
          } else {
            message.success(result1.msg);
            dispatch({
              type: 'album/fetch',
              payload: { user_id: currentUser._id }
            });
          }
        },
      });
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
  changeTab = (e) => {
    const { choosen } = this.state;
    this.setState({ choosen: [] });
  }
  changeAlbumPage = (current, pageSize) => {
    const { dispatch, currentUser } = this.props;
    dispatch({
      type: 'album/fetch',
      payload: {
        user_id: currentUser._id,
        pageSize,
        currentPage: current,
      }
    });
  }
  render() {
    const { data, loading, visible } = this.props;
    const { choosen, pagination } = this.state;
    console.log(data)
    return (
      <Modal
        title="素材"
        width="992px"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        bodyStyle={{ padding: '5px 20px' }}
      >
        <Tabs defaultActiveKey="album" onChange={this.changeTab}>
          <TabPane tab={<span><Icon type="apple" />Tab 1</span>} key="album">
            <div>
              {data.list.map(this.renderPhoto)}
            </div>
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={data.pagination.total} 
              onChange={this.changeAlbumPage}
              style={{float: 'right', margin: '10px 20px'}}
            />
          </TabPane>
          <TabPane tab={<span><Icon type="android" />Tab 2</span>} key="upload">
            <div className="uploadBox">
              <Upload name="file"
                action={QINIU_UPLOAD_DOMAIN}
                data={this.makeUploadData}
                onChange={this.handleChange}
                listType="picture-card"
                fileList={choosen}
                onRemove={this.handleRemove}
              >
                <div style={{height: '120px', 'paddingTop': '40px'}}>
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
