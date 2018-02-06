import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, message, Row, Col, Tag, Button, Modal, Switch, Radio } from 'antd';
import styles from './AuctionImageModal.less';
import AlbumModal from '../../AlbumModal';
import CropperModal from '../../AlbumModal/CropperModal';
const RadioGroup = Radio.Group;

@connect(state => ({
  visible: state.album.auctionImageModal.visible,
}))
export default class AuctionImageModal extends PureComponent {
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
      nicaiCrx.addEventListener('setVersion', this.setVersion);
      nicaiCrx.addEventListener('setCutpic', this.setCutpic);
      if (!this.state.nicaiCrx) {
        this.setState({ nicaiCrx }, () => {
          setTimeout(() => {
            this.handleGetVersion();
          }, 600);
        });
      }
      setTimeout(() => {
        if(!this.state.version){
          message.destroy();
          message.warn('请安装尼采创作平台插件并用淘宝授权登录！', 60);
        }
      }, 5000);
      const { formData } = nextProps;
      if (formData.coverUrl) {
        this.setState({
          coverUrl: formData.images[0],
          extraBanners: formData.extraBanners || [],
        });
      }
      if (formData.images) {
        const arr = [];
        for (let i = 0; i < nextProps.formData.images.length; i++) {
          arr.push('');
        }
        this.setState({
          cutCoverUrl: arr,
          images: nextProps.formData.images,
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
  uploadCoverImg = (key) => {
    this.props.dispatch({
      type: 'album/show',
      payload: { currentKey: this.props.index },
    });
  }
  handleOk = () => {
    const { formData } = this.props;
    if (this.state.extraBanners.length >= 3 && this.state.extraBanners.length <= 5) {
      const index = this.state.images.findIndex(item => item === this.state.coverUrl);
      let coverUrl = this.state.coverUrl;
      if (this.state.cutCoverUrl[index]) {
        coverUrl = this.state.cutCoverUrl[index];
      }
      if (this.props.onChange) this.props.onChange(coverUrl, this.state.extraBanners);
      this.props.dispatch({
        type: 'album/hideAuctionImage',
      });
    } else {
      message.warn('请选择3到5张补充展示封面图');
    }
  }
  handleCancel = () => {
    this.props.dispatch({
      type: 'album/hideAuctionImage',
    });
  }

  handleChooseExtraBanners = (photo) => {
    const index = this.state.extraBanners.findIndex(item => item === photo);
    if (index === -1 ) {
      if (this.state.extraBanners.length < 5) {
        this.setState({ extraBanners: [ ...this.state.extraBanners, photo ] });
      }
    } else {
      const choosed = this.state.extraBanners;
      choosed.splice(index,1);
      this.setState({ extraBanners: [...choosed] });
    }
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
    const { formData } = this.props;
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
    const { formData } = this.props;
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
  handleDeleteBanners = (pic) => {
    const arr = [ ...this.state.extraBanners ];
    arr.findIndex((item, index) => {pic === item ? arr.splice(index, 1) : ''});
    this.setState({
      extraBanners: arr,
    });
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
  handleCropCoverImg = (imgs) => {
    const { formData } = this.state;
    if (imgs[0]) {
      this.props.dispatch({
        type: 'album/showCropper',
        payload: {
          visible: true,
          src: imgs[0].url,
          width: this.state.minSize.width,
          height: this.state.minSize.height,
          picHeight: imgs[0].picHeight,
          picWidth: imgs[0].picWidth,
          cropperKey: this.state.k,
        }
      });
    }
  }
  handleAddCoverImg = (imgs) => {
    if (imgs && imgs.length > 0) {
      if (this.state.k === 'bgImage') {
        const arr = [...this.state.images];
        if (arr.length === this.props.formData.images.length) {
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
    const { formData, visible } = this.props;
    const { images, extraBanners, checkedCutpic, cutCoverUrl, checkedLoading, uploadBgImage } = this.state;
    return (
      <div style={{ padding: '0 0 20px' }}>
        <Modal
          title="完善封面与展示图片信息"
          width="850px"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          bodyStyle={{ padding: '5px 20px' }}
        >
        { formData && formData.images &&
          <div>
            <div style={{ marginBottom: 40 }}>
              <p>展示图共3-5张（顺序选择第1张指定为封面图）</p>
              <div className={styles.imgBox}>
                { formData.images.map((item, index) => <div key={index} className={styles.coverImgBox} onClick={() => this.handleChooseExtraBanners(item)}>
                    { extraBanners.find(url => url === item) &&
                      <div className={styles.chooseImgBox}>
                        <Icon type="check" />
                      </div>
                    }
                    <img src={item} />
                  </div>)
                }
                { extraBanners && extraBanners.length < 5 && <div onClick={() => this.handleAddImage('extraImage')} className={styles.uploadImgBox}>
                    <div>
                      <Icon type="plus" style={{ fontSize: 40 }} />
                      <p>添加上传图片</p>
                    </div>
                  </div>
                }
              </div>
              <div className={styles.imgShowBox}>
                { extraBanners.map((item, index) => <div key={index} onClick={() => this.handleDeleteBanners(item)}>
                    <span><Icon type="close-circle" /></span>
                    <img src={item} />
                  </div>)
                }
              </div>
              <p className={styles.promptText}>请选择或上传列表和详情页展示图共3-5张，尺寸不小于 500x500px ，白底图或场景图均可</p>
            </div>
            <div>
              <p>首页入口图1张，仅限白底图（用于各内容频道入口资源位展示）</p>
              <div>
                <RadioGroup className={styles.imgBox} onChange={this.handleChangeCoverImg} value={this.state.coverUrl}>
                  { formData.images.map((item, index) => <Radio className={styles.radioBox} key={index} value={item}><img src={cutCoverUrl[index]? cutCoverUrl[index] : item} /></Radio>)
                  }
                  { !uploadBgImage ? <div onClick={() => this.handleAddImage('bgImage')} className={styles.uploadImgBox} style={{ marginLeft: 20 }}>
                    <div>
                      <Icon type="plus" style={{ fontSize: 40 }} />
                      <p>添加上传图片</p>
                    </div>
                  </div> :
                  <Radio className={styles.radioBox} value={uploadBgImage}><img src={cutCoverUrl[formData.images.length] ? cutCoverUrl[formData.images.length] : uploadBgImage} /></Radio>}
                </RadioGroup>
              </div>
              <p className={styles.promptText}>请选择或上传1张白底商品图，尺寸不小于 500x500px ，查看#白底图提交规则#</p>
              <div>
                <Switch onChange={this.getCutpic} checked={checkedCutpic} loading={checkedLoading} />
                <span style={{ marginLeft: 20 }}>智能抠图</span>
              </div>
            </div>
          </div>
        } 
        </Modal>
        <AlbumModal mode="single" minSize={this.state.minSize} k={this.state.k} onOk={this.handleAddCoverImg}/>
      </div>
    );
  }
}
