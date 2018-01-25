import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, message, Row, Col, Tag, Button, Modal } from 'antd';
import styles from './AuctionImageModal.less';
import AlbumModal from '../../AlbumModal';

@connect(state => ({
  visible: state.album.auctionImageModal.visible,
}))
export default class AuctionImageModal extends PureComponent {
  state = {
    coverUrl: '',
    extraBanners: [],
  }
  componentDidMount() {
    if (this.props.formData && this.props.formData.coverUrl) {
      this.setState({
        coverUrl: this.props.formData.coverUrl,
        extraBanners: this.props.formData.extraBanners || [],
      })
    }
  }
  componentWillReceiveProps(nextProps) {
    const { formData } = nextProps;
    if (!this.props.formData.coverUrl && formData.coverUrl) {
      this.setState({
        coverUrl: formData.coverUrl,
        extraBanners: formData.extraBanners || [],
      })
    }
  }
  componentWillUnmount() {

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
      })
    }
  }
  handleRemoveImg = () => {
    this.setState({
      images: '',
    })
  }

  handleOk = () => {
    if (this.state.extraBanners.length >= 3 && this.state.extraBanners.length <= 5) {
      if (this.props.onChange) this.props.onChange(this.state.coverUrl, this.state.extraBanners);
      this.props.dispatch({
        type: 'album/hideAuctionImage',
      })
    } else {
      message.warn('请选择3到5张补充展示封面图');
    }
  }
  handleCancel = () => {
    this.setState({
      coverUrl: '',
      extraBanners: [],
    })
    this.props.dispatch({
      type: 'album/hideAuctionImage',
    })
  }

  handleChooseCover = (photo) => {
    this.setState({
      coverUrl: photo,
    })
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
  render() {
    const { formData, visible } = this.props;
    const { images, extraBanners } = this.state;
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
              <div className={styles.imgBox}>
                { formData.images.map((item, index) => <div key={index} className={styles.whitebgBox} onClick={() => this.handleChooseCover(item)}>
                    { this.state.coverUrl === item &&
                      <div className={styles.chooseImgBox}>
                        <Icon type="check" />
                      </div>
                    }
                    <img src={item} />
                  </div>)
                }
              </div>
              <p className={styles.promptText}>请选择或上传1张白底商品图，尺寸不小于 500x500px ，查看#白底图提交规则#</p>
            </div>
          </div>
        } 
        </Modal>
        <AlbumModal mode="single" k={this.props.index} minSize={this.state.minSize} onOk={this.handleCropCoverImg}/>
      </div>
    );
  }
}
