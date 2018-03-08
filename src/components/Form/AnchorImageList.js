import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, message, Badge } from 'antd';
import AlbumModal from '../AlbumModal';
import AnchorModal from '../AuctionModal/AnchorModal';
import styles from './AnchorImageList.less';
@connect(state => ({

}))
export default class AnchorImageList extends PureComponent {
  state = {
    nicaiCrx: null,
    version: '',
    url: '',
  }
  componentDidMount() {
    const nicaiCrx = document.getElementById('nicaiCrx');
    nicaiCrx.addEventListener('setJigsaw', this.setJigsaw);
    nicaiCrx.addEventListener('setVersion', this.setVersion);
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
        message.warn('请安装尼采创作平台插件！', 5000);
      }
    }, 5000);
  }
  componentWillReceiveProps(nextProps) {
    
  }
  componentWillUnmount() {
    const nicaiCrx = document.getElementById('nicaiCrx');
    nicaiCrx.removeEventListener('setJigsaw', this.setJigsaw);
    this.setState({
      nicaiCrx: null,
    });
  }
  setJigsaw = (e) => {
    const result = JSON.parse(e.target.innerText);
    if (!result.errorCode) {
      if (this.props.onChange) {
        const features = {
          images: [],
          dapeiParams: {
            area: result.area,
            bannerSize: result.size,
          },
          dapeiId: result.id
        }
        const rawData = JSON.parse(result.rawData);
        const anchors = [];
        for (var i = 1; i < rawData.layers.length; i++) {
          if (rawData.layers[i].type === 8) {
            const item = rawData.layers[i];
            anchors.push({
              data: {
                coverUrl: item.picUrl,
                finalPricePc: 0,
                finalPriceWap: 0,
                itemId: item.itemId,
                materialId: "",
                price: 0,
                url: 'https://item.taobao.com/item.htm?id=' + item.itemId,
              },
              type: "item",
              x: ((item.width * (item.anchorX / 100) + item.x) / 1200) * 100,
              y: ((item.height * (item.anchorY / 100) + item.y) / 1200) * 100,
            })
          }
        }
        this.props.onChange([{
          anchors: anchors,
          features: JSON.stringify(features),
          hotSpaces: [],
          url: result.url,
        }]);
      }
    } else {
      message.error(result.message);
    }
  }
  setVersion = (e) => {
    const data = JSON.parse(e.target.innerText);
    const version = data.version;
    this.setState({
      version: data.version,
    });
    nicaiCrx.removeEventListener('setVersion', this.setVersion);
    if (version && version.length > 0) {
      const arr = version.split('.');
      const versionNumber = Number(arr[0]) * 100 + Number(arr[1]) * 10 + Number(arr[2]);
      if (versionNumber < 106) { // 1.0.4
        message.warn('请更新插件！', 60 * 60);
      }
    }
  }
  handleGetVersion = () => {
    const customEvent = document.createEvent('Event');
    customEvent.initEvent('getVersion', true, true);
    this.state.nicaiCrx.dispatchEvent(customEvent);
  }
  handleCreateJigsaw = (e) => {
    const { props } = this.props;
    if (props.url) {
      window.open(`https://we.taobao.com${props.url}`);
    } else {
      this.props.dispatch({
        type: 'album/show',
        payload: { currentKey: this.props.name }
      });
    }
  }
  handleEditJigsaw = (e, index) => {
    const { props } = this.props;
    if (props.url) {
      const features = JSON.parse(props.value.length > 0 ? props.value[0].features : '{}');
      window.open(`https://we.taobao.com${this.props.props.url}&dapeiId=${features.dapeiId}`);
    } else {
      if (props.value[index] && props.value[index].url) {
        this.props.dispatch({
          type: 'album/showAnchor',
          payload: {
            anchorKey: this.props.name,
            image: props.value[index].url,
            value: props.value[index],
            index: index,
          }
        });
      }
    }
  }
  handleDeleteJigsaw = (e, index) => {
    const newValue = this.props.props.value;
    newValue.splice(index, 1);
    if (this.props.onChange) this.props.onChange(newValue);
  }

  handleChangeCover = (imgs) => {
    if (imgs && imgs.length > 0) {
      this.setState({
        url: imgs[0].url,
      });
      this.props.dispatch({
        type: 'album/showAnchor',
        payload: {
          anchorKey: this.props.name,
          image: imgs[0].url,
          value: {
            anchors: [],
            hotSpaces: [],
            url: imgs[0].url,
          },
          index: -1,
        }
      });
    }
  }
  handleAddAnchor = (anchorChild, index) => {
    const anchorList = Object.assign([], this.props.props.value);
    if (index >= 0) {
      anchorList.splice(index, 1, anchorChild);
    } else {
      anchorList.push(anchorChild);
    }
    if (this.props.onChange) this.props.onChange(anchorList);
  }
  render() {
    const { name, props, disabled } = this.props;
    const pixFilter = props.imgSpaceProps.pixFilter.split('x').map(item => Number(item));
    const outerBoxWh = 200;
    const wh = 22;
    const styleDisabled = disabled ? {
      padding: '60px 0',
      width: 200,
      height: 200,
      border: '1px solid #ccc',
      color: '#ccc',
    } : { padding: '60px 0', width: 200, height: 200 };
    return (
      <div style={{ padding: '10px 20px' }}>
        <p style={{ marginBottom: 10 }}>{props.label}</p>
        <div>
          { props.value && props.value.length > 0 &&
            props.value.map((item, index) => <div key={index} className={styles.showImgBox} style={{ width: 200, height: 200, display: 'inline-block', margin: '0 3px 3px 0' }}>
              <img style={{ width: '100%', height: '100%' }} src={item.url}/>
              { !this.props.disabled && <div className={styles.deleteImgBox}>
                <Icon type="edit" className={styles.editIcon} onClick={(e) => this.handleEditJigsaw(e, index)} />
                <Icon type="delete" className={styles.deleteIcon} onClick={(e) => this.handleDeleteJigsaw(e, index)} />
              </div>
              }
              {
                <div style={{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}}>
                  {item.anchors && item.anchors.map((anchor, index) => {
                    const thisY = (anchor.y / 100 * outerBoxWh) - wh/2;
                    const thisX = (anchor.x / 100 * outerBoxWh) - wh/2;
                    return (
                      <div
                        key={index}
                        className={styles.anchorTagsBox}
                        style={{top: thisY, left: anchor.x < 50 ? thisX : 'auto', right: anchor.x > 50 ? (outerBoxWh - thisX - wh) : 'auto'}}>
                      <Badge status="warning" className={styles.anchorTagsDian} style={{float: anchor.x < 50 ? 'left' : 'right'}} />
                      <span className={styles.anchorTags}>
                        {anchor.data && anchor.data.title ? anchor.data.title : ''}
                      </span>
                    </div>)
                  })}
                </div>
              }
            </div>)
          }
          { props.value.length < props.max &&
            <div style={{ width: 200, height: 200, display: 'inline-block' }}>
              <div className={styles.upCover} style={styleDisabled} onClick={!disabled ? this.handleCreateJigsaw : () => {}}>
                <Icon type="plus" />
                <p style={{ fontSize: 14 }}>添加搭配图</p>
              </div>
            </div>
          }
        </div>
        <AlbumModal mode="single" k={name} minSize={{ width: pixFilter[0], height: pixFilter[1] }} onOk={this.handleChangeCover}/>
        <AnchorModal props={this.props.props} k={name} onChange={this.handleAddAnchor} />
      </div>
    );
  }
}
