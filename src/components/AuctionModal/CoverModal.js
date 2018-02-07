import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, message, Row, Col, Tag, Button, Modal, Switch, Radio } from 'antd';
import styles from '../Forms/FormParts/AuctionImageModal.less';
import AlbumModal from '../AlbumModal';
const RadioGroup = Radio.Group;

@connect(state => ({
  visible: state.album.coverModal.visible,
  coverKey: state.album.coverModal.coverKey,
  auction: state.album.coverModal.auction,
}))
export default class CoverChooseModal extends PureComponent {
  state = {
    coverUrl: '',
    cutCoverUrl: [],
    extraBanners: [],
    nicaiCrx: null,
    version: '',
    checkedCutpic: false,
    checkedLoading: false,
    minSize: {
      width: 500,
      height: 500,
    },
    k: '',
    uploadBgImage: '',
    images: [],
  }

  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      this.setState({
        coverUrl: '',
        extraBanners: [],
        checkedCutpic: false,
        checkedLoading: false
      });
      const nicaiCrx = document.getElementById('nicaiCrx');
      // nicaiCrx.addEventListener('setVersion', this.setVersion);
      nicaiCrx.addEventListener('setCutpic', this.setCutpic);
      if (!this.state.nicaiCrx) {
        this.setState({ nicaiCrx });
      }
      // setTimeout(() => {
      //   if(!this.state.version){
      //     message.destroy();
      //     message.warn('请安装尼采创作平台插件并用淘宝授权登录！', 60);
      //   }
      // }, 5000);
      const { auction } = nextProps;
      if (auction.coverUrl) {
        this.setState({
          coverUrl: auction.images[0],
          extraBanners: auction.extraBanners || [],
        });
      }
      if (auction.images) {
        const arr = [];
        for (let i = 0; i < nextProps.auction.images.length; i++) {
          arr.push('');
        }
        this.setState({
          cutCoverUrl: arr,
          images: nextProps.auction.images,
        });
      }
    } else if (this.props.visible && !nextProps.visible) {
      const nicaiCrx = this.state.nicaiCrx || document.getElementById('nicaiCrx');
      nicaiCrx.removeEventListener('setCutpic', this.setCutpic);
    }
  }

  handleGetVersion = () => {
    this.state.nicaiCrx.innerText = '';
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getVersion', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  setVersion = (e) => {
    const data = JSON.parse(e.target.innerText);
    const { pagination } = this.state;
    if (data.error) {
      message.warn(data.msg);
      this.setState({
        loading: false,
      });
    }
    this.setState({
      version: data.version,
    });
    this.state.nicaiCrx.removeEventListener('setVersion', this.setVersion);
  }
  handleOk = () => {
    const { auction } = this.props;
    const index = this.state.images.findIndex(item => item === this.state.coverUrl);
    let coverUrl = this.state.coverUrl;
    if (this.state.cutCoverUrl[index]) {
      coverUrl = this.state.cutCoverUrl[index];
    }
    if (this.props.onOk) this.props.onOk(coverUrl);
    this.props.dispatch({
      type: 'album/hideCover',
    });
  }
  handleCancel = () => {
    this.props.dispatch({
      type: 'album/hideCover',
    });
  }

  setCutpic = (e) => {
    const response = JSON.parse(e.target.innerText);
    const { cutCoverUrl } = this.state;
    if (!response.error) {
      const data = response.data;
      if (data.result && response.index >= 0) {
        const arr = cutCoverUrl;
        arr[response.index] = data.result;
        this.setState({
          cutCoverUrl: arr,
        });
      }
    } else {
      message.warn(response.msg);
      this.setState({
        checkedCutpic: false,
      });
    }
    this.setState({
      checkedLoading: false,
    });
  }
  getCutpic = (checked) => {
    const { auction } = this.props;
    const index = this.state.images.findIndex(item => item === this.state.coverUrl);
    this.setState({
      checkedCutpic: checked,
    });

    if (checked === true) {
      this.state.nicaiCrx.innerText = JSON.stringify({picUrl: this.state.coverUrl, index: index});
      const customEvent = document.createEvent('Event');
      customEvent.initEvent('getCutpic', true, true);
      this.state.nicaiCrx.dispatchEvent(customEvent);
      this.setState({
        checkedLoading: true,
      });
    } else {
      const arr = this.state.cutCoverUrl;
      arr[index] = '';
      this.setState({
        cutCoverUrl: arr,
      });
    }
  }
  handleChangeCoverImg = (e) => {
    const { auction } = this.props;
    const index = this.state.images.findIndex(item => item === e.target.value);
    const arr = this.state.cutCoverUrl;
    if (arr[arr.length - 1]) {
      arr[arr.length - 1] = '';
      this.setState({
        cutCoverUrl: arr,
      })
    }
    this.setState({
      coverUrl: e.target.value,
      uploadBgImage: '',
    });
    if (this.state.cutCoverUrl[index]) {
      this.setState({
        checkedCutpic: true,
      });
    } else {
      this.setState({
        checkedCutpic: false,
      });
    }
  }

  handleAddImage = (key) => {
    this.setState({
      k: key,
    }, () => {
      this.props.dispatch({
        type: 'album/show',
        payload: { currentKey: key }
      });
    });
  }
  handleAddCoverImg = (imgs) => {
    if (imgs && imgs.length > 0) {
      if (this.state.k === 'bgImage') {
        const arr = [...this.state.images];
        if (arr.length === this.props.auction.images.length) {
          arr.push(imgs[0].url);
        } else {
          arr.splice(arr.length - 1, 1, imgs[0].url);
        }
        this.setState({
          uploadBgImage: imgs[0].url,
          coverUrl: imgs[0].url,
          images: arr,
          checkedCutpic: false,
        });
      } else if (this.state.k === 'extraImage') {
        const arr = [...this.state.extraBanners];
        arr.push(imgs[0].url);
        this.setState({
          extraBanners: arr,
        });
      }
    }
  }
  render() {
    const { auction, visible } = this.props;
    const { images, extraBanners, checkedCutpic, cutCoverUrl, checkedLoading, uploadBgImage } = this.state;
    return (
      <div style={{ padding: '0 0 20px' }}>
        <Modal
          title="完善商品信息"
          width="850px"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          bodyStyle={{ padding: '5px 20px' }}
        >
        { auction && auction.images &&
          <div>
            <div>
              <RadioGroup className={styles.imgBox} onChange={this.handleChangeCoverImg} value={this.state.coverUrl}>
                { auction.images.map((item, index) => <Radio className={styles.radioBox} key={index} value={item}><img src={cutCoverUrl[index]? cutCoverUrl[index] : item} /></Radio>)
                }
                { !uploadBgImage ? <div onClick={() => this.handleAddImage('bgImage')} className={styles.uploadImgBox} style={{ marginLeft: 20 }}>
                  <div>
                    <Icon type="plus" style={{ fontSize: 40 }} />
                    <p>添加上传图片</p>
                  </div>
                </div> :
                <Radio className={styles.radioBox} value={uploadBgImage}><img src={cutCoverUrl[auction.images.length] ? cutCoverUrl[auction.images.length] : uploadBgImage} /></Radio>}
              </RadioGroup>
            </div>
            <div>
              <Switch onChange={this.getCutpic} checked={checkedCutpic} loading={checkedLoading} />
              <span style={{ marginLeft: 20 }}>智能抠图</span>
            </div>
          </div>
        }
        </Modal>
        <AlbumModal mode="single" minSize={this.state.minSize} k={this.state.k} onOk={this.handleAddCoverImg}/>
      </div>
    );
  }
}
