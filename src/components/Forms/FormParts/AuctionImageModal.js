import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, message, Row, Col, Tag, Button, Modal, Switch, Radio } from 'antd';
import styles from './AuctionImageModal.less';
import AlbumModal from '../../AlbumModal';
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
  }
  componentDidMount() {
    if (this.props.formData && this.props.formData.coverUrl) {
      this.setState({
        coverUrl: this.props.formData.coverUrl,
        extraBanners: this.props.formData.extraBanners || [],
      })
    }
    if (this.props.formData && this.props.formData.images) {
      const arr = [];
      for (var i = 0; i < nextProps.formData.images.length; i++) {
        arr.push('');
      }
      this.setState({
        cutCoverUrl: [ ...arr ],
      });
    }
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
        this.setState({ loading: false });
      }
    }, 5000);
  }
  componentWillReceiveProps(nextProps) {
    const { formData } = nextProps;
    if (!this.props.formData.coverUrl && formData.coverUrl) {
      this.setState({
        coverUrl: formData.coverUrl,
        extraBanners: formData.extraBanners || [],
      })
    }

    if (!this.props.formData.images && nextProps.formData.images) {
      const arr = [];
      for (var i = 0; i < nextProps.formData.images.length; i++) {
        arr.push('');
      }
      this.setState({
        cutCoverUrl: [ ...arr ],
      });
    }
  }
  componentWillUnmount() {
    const nicaiCrx = this.state.nicaiCrx || document.getElementById('nicaiCrx');
    nicaiCrx.removeEventListener('setCutpic', this.setCutpic);
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
    nicaiCrx.removeEventListener('setVersion', this.setVersion);
  }
  uploadCoverImg = (key) => {
    this.props.dispatch({
      type: 'album/show',
      payload: { currentKey: this.props.index },
    });
  }
  handleCropCoverImg = (imgs) => {
    if (imgs[0]) {
      this.setState({
        images: imgs[0].url,
      });
    }
  }
  handleRemoveImg = () => {
    this.setState({
      images: '',
    });
  }

  handleOk = () => {
    const { formData } = this.props;
    if (this.state.extraBanners.length >= 3 && this.state.extraBanners.length <= 5) {
      const index = formData.images.findIndex(item => item === this.state.coverUrl);
      let coverUrl = this.state.coverUrl;
      if (this.state.cutCoverUrl[index]) {
        coverUrl = this.state.cutCoverUrl[index];
      }
      this.setState({
        checkedCutpic: false,
      })
      if (this.props.onChange) this.props.onChange(coverUrl, this.state.extraBanners);
      this.props.dispatch({
        type: 'album/hideAuctionImage',
      });
    } else {
      message.warn('请选择3到5张补充展示封面图');
    }
  }
  handleCancel = () => {
    this.setState({
      coverUrl: '',
      extraBanners: [],
    });
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
    if (!response.error) {response
      const data = response.data;
      if (data.result && response.index >= 0) {
        const arr = cutCoverUrl;
        arr[response.index] = data.result;
        this.setState({
          cutCoverUrl: [ ...arr ]
        })
      }
    } else {
      message.warn(data.msg);
    }
    this.setState({
      checkedLoading: false,
    });
  }
  getCutpic = (checked) => {
    const { formData } = this.props;
    const index = formData.images.findIndex(item => item === this.state.coverUrl);
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
        cutCoverUrl: [ ...arr ],
      });
    }
  }
  handleChangeCoverImg = (e) => {
    const { formData } = this.props;
    const index = (formData.images).findIndex(item => item === e.target.value);
    this.setState({
      coverUrl: e.target.value,
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
  render() {
    const { formData, visible } = this.props;
    const { images, extraBanners, checkedCutpic, cutCoverUrl, checkedLoading } = this.state;
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
                {
                  // <div className={styles.uploadImgBox}></div>
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
                </RadioGroup>
              </div>
              <p className={styles.promptText}>请选择或上传1张白底商品图，尺寸不小于 500x500px ，查看#白底图提交规则#</p>
              <div>
                <Switch onChange={this.getCutpic} checked={checkedCutpic} loading={checkedLoading} />
                <span>智能抠图</span>
                <div></div>
              </div>
            </div>
          </div>
        } 
        </Modal>
        <AlbumModal mode="single" k={this.props.index} minSize={this.state.minSize} onOk={this.handleCropCoverImg}/>
      </div>
    );
  }
}
