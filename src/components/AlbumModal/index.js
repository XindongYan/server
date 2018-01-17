import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Modal, message, Tabs, Icon, Upload, Button, Pagination, Spin} from 'antd';
import styles from './index.less';
const TabPane = Tabs.TabPane;

@connect(state => ({
  visible: state.album.visible,
  qiniucloud: state.qiniucloud,
  currentKey: state.album.currentKey,
}))

  
export default class AlbumModal extends PureComponent {
  state = {
    choosen: [],
    previewImage: '',
    nicaiCrx: null,
    itemList: [],
    pagination: {
      pageSize: 12,
      current: 1,
      total: 0,
    },
    loading: true,
    version: '',
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.k === nextProps.currentKey) {
      if (!this.props.visible && nextProps.visible) {
        const nicaiCrx = document.getElementById('nicaiCrx');
        nicaiCrx.addEventListener('setAlbum', this.setAlbum);
        nicaiCrx.addEventListener('uploadResult', this.uploadResult);
        nicaiCrx.addEventListener('setVersion', this.setVersion);
        if (!this.state.nicaiCrx) {
          this.setState({ nicaiCrx }, () => {
            setTimeout(() => {
              this.handleGetVersion();
            }, 400);
          });
        }
        setTimeout(() => {
          if(!this.state.version){
            message.destroy();
            message.warn('请安装尼采创作平台插件并用淘宝授权登录！', 60 * 60);
            this.setState({ loading: false });
          }
        }, 5000);
      } else if (this.props.visible && !nextProps.visible) {
        const nicaiCrx = document.getElementById('nicaiCrx');
        nicaiCrx.removeEventListener('setAlbum', this.setAlbum);
        nicaiCrx.removeEventListener('uploadResult', this.uploadResult);
        nicaiCrx.removeEventListener('setVersion', this.setVersion);
      }
    }
  }
  setAlbum = (e) => {
    const data = JSON.parse(e.target.innerText);
    if (!data.error) {
      this.setState({
        itemList: data.itemList || [],
        pagination: {
          pageSize: data.pageSize,
          current: data.current,
          total: data.total,
        },
        loading: false,
      });
    } else {
      message.warn(data.msg);
      this.setState({
        loading: false,
      });
    }
  }
  uploadResult = (e) => {
    const result = JSON.parse(e.target.innerText);
    if (this.props.k === this.props.currentKey) {
      if (!result.errorCode) {
        message.success('上传成功');
        if (this.props.k !== 'editor'){
          this.setState({
            choosen: [ result.data[0] ],
          })
        } else {
          this.setState({
            choosen: [ ...this.state.choosen, result.data[0] ],
          })
        }
        
      } else {
        message.error(result.message);
      }
    }
  }
  setVersion = (e) => {
    const data = JSON.parse(e.target.innerText);
    const { pagination } = this.state;
    if (data.error) {
      message.warn(data.msg);
      this.setState({
        loading: false,
      });
    } else {
      this.handleLoadAlbum({ pageSize: pagination.pageSize, current: 1 });
    }
    this.setState({
      version: data.version,
    })
  }
  handleLoadAlbum = (params) => {
    this.state.nicaiCrx.innerText = JSON.stringify(params);
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getAlbum', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  handleGetVersion = () => {
    this.state.nicaiCrx.innerText = '';
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getVersion', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  handleOk = () => {
    if (this.state.choosen.length > 0) {
      if (this.props.onOk) this.props.onOk(this.state.choosen);
      this.setState({ choosen: [] });
    }
    this.props.dispatch({
      type: 'album/hide',
    });
  }
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'album/hide',
    });
    message.destroy();
    this.setState({ choosen: [] });
  }
  handleChoose = (photo) => {
    const { mode } = this.props;
    const index = this.state.choosen.findIndex(item => item.id === photo.id);
    if( mode==='single' ) {
      this.setState({ choosen: [ photo ] });
    } else {
      if (index === -1) {
        this.setState({ choosen: [ ...this.state.choosen, { ...photo, uid: photo.id } ] });
      } else {
        const choosed = [...this.state.choosen];
        choosed.splice(index,1);
        this.setState({ choosen: [...choosed] });
      }
    }
  }
  renderPhoto = (photo, index) => {
    const { minSize, k } = this.props;
    return (
      <Card style={{ width: 140, display: 'inline-block', margin: 5 }} bodyStyle={{ padding: 0 }} key={photo.id}>
        <div className={styles.customImageBox} onClick={() => this.handleChoose(photo)}>
          <img
            className={styles.customImage}
            width="100%"
            src={photo.url}
          />
          <div style={{display: this.state.choosen.find(item => item.id === photo.id) ? 'block' : 'none'}} className={styles.chooseModal}>
            <Icon type="check" />
          </div>          
        </div>
        { k !== 'editor' && minSize && (photo.picWidth < minSize.width || photo.picHeight < minSize.height) &&
          <div className={styles.diabledModal}>
            尺寸不符
          </div>
        }
        <div className="custom-card">
          <p className={styles.customNodes}>{photo.picWidth} * {photo.picHeight}</p>
          <p className={styles.customNodes}>{photo.title}</p>
        </div>
      </Card>
    );
  }

  previewPhoto = (photo, index) => {
    return (
      <div className={styles.previewImg} key={index}>
        <img src={photo.url} />
      </div>
    );
  }
  changeTab = (e) => {
    const { choosen, pagination } = this.state;
    if (e === "album") {
      this.handleLoadAlbum({ pageSize: pagination.pageSize, current: pagination.current });
    }
    this.setState({ choosen: [] });
  }
  changeAlbumPage = (current, pageSize) => {
    if (this.state.nicaiCrx) {
      this.setState({ loading: true });
      this.handleLoadAlbum({ pageSize, current });
    }
  }
  handleUpload = (e) => {
    const { k, minSize } = this.props;
    const { nicaiCrx } = this.state;
    const file = e.target.files[0];
    if (file) {
      if (file.size / 1024 / 1024 >= 3) {
        message.warn('上传图片最大3M');
      } else {
        // console.log(file)
        var reader = new FileReader();  
        reader.readAsDataURL(file);  
        //监听文件读取结束后事件  
        reader.onloadend = (e1) => {
          if (k !== 'editor') {
            var img = new Image();
            img.src = e1.target.result;
            img.onload = function(event) {
              if (img.height < minSize.height || img.width < minSize.width) {
                message.warn(`封面图尺寸不能小于${minSize.width}*${minSize.height}px`);
              } else {
                nicaiCrx.innerText = JSON.stringify({data: e1.target.result});
                const customEvent = document.createEvent('Event');
                customEvent.initEvent('uploadImg', true, true);
                nicaiCrx.dispatchEvent(customEvent);
              }
            }
          } else {
            nicaiCrx.innerText = JSON.stringify({data: e1.target.result});
            const customEvent = document.createEvent('Event');
            customEvent.initEvent('uploadImg', true, true);
            nicaiCrx.dispatchEvent(customEvent);
          }
        };
      }
    }
  }
 
  render() {
    const { visible, k, currentKey, minSize } = this.props;
    const { choosen, previewImage, itemList, pagination, loading } = this.state;
    return (
      <Modal
        title="素材"
        width="992px"
        visible={k === currentKey && visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        bodyStyle={{ padding: '5px 20px' }}
      >
        <Tabs defaultActiveKey="album" onChange={this.changeTab}>
          <TabPane tab={<span><Icon type="picture" />素材库</span>} key="album">
            <Spin spinning={loading}>
              <div>
                {itemList.map(this.renderPhoto)}
              </div>
              <Pagination
                {...pagination}
                onChange={this.changeAlbumPage}
                style={{float: 'right', margin: '10px 20px'}}
              />
            </Spin>
          </TabPane>
          <TabPane tab={<span><Icon type="upload" />上传</span>} key="upload">
            <div>
              <div className={styles.uploadInpBox}>
                <div className={styles.uploadViewBox}>
                  <Icon type="plus" style={{ fontSize: 32, color: '#6AF' }} />
                  <p>直接拖拽文件到虚线框内即可上传</p>
                </div>
                <input className={styles.fileInp} type="file" onChange={this.handleUpload} />
              </div>
              <p style={{ fontSize: 12 }}>请选择大小不超过 3 MB 的文件</p>
              <div className={styles.previewBox}>           
                {choosen.map(this.previewPhoto)}
              </div>
            </div>
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}
