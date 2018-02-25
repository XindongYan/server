import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, message } from 'antd';
import styles from './AnchorImageList.less';
@connect(state => ({

}))
export default class AnchorImageList extends PureComponent {
  state = {
    nicaiCrx: null,
    version: '',
  }
  componentDidMount() {
    const nicaiCrx = document.getElementById('nicaiCrx');
    nicaiCrx.addEventListener('setJigsaw', this.setJigsaw);
    nicaiCrx.addEventListener('setVersion', this.setVersion);
    if (!this.state.nicaiCrx) {
      this.setState({ nicaiCrx }, () => {
        setTimeout(() => {
          this.handleGetVersion();
        }, 1000);
      });
    }
    setTimeout(() => {
      if(!this.state.version){
        message.destroy();
        message.warn('请安装尼采创作平台插件！', 60 * 60);
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
      if (this.props.onChange) this.props.onChange(result);
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
    window.open('https://we.taobao.com/mirror/mirror.html?activityId=1437');
  }
  handleEditJigsaw = (e) => {
    const { formData } = this.props;
    window.open(`https://we.taobao.com/mirror/mirror.html?activityId=1437&dapeiId=${formData.body.id}`);
  }
  handleDeleteJigsaw = (e) => {
    if (this.props.onChange) this.props.onChange({});
  }
  render() {
    const { formData, disabled } = this.props;
    const url = formData.body ? formData.body.url : '';
    const styleDisabled = disabled ? {
      padding: '60px 0',
      width: 200,
      height: 200,
      border: '1px solid #ccc',
      color: '#ccc',
    } : { padding: '60px 0', width: 200, height: 200 };
    return (
      <div style={{ padding: '10px 20px' }}>
        <p style={{ marginBottom: 10 }}>主图</p>
        <div style={{ width: 200, height: 200 }}>
          {(url) ?
            <div className={styles.showImgBox}>
              <img src={url}/>
              { !this.props.disabled && <div className={styles.deleteImgBox}>
                <Icon type="edit" className={styles.editIcon} onClick={this.handleEditJigsaw} />
                <Icon type="delete" className={styles.deleteIcon} onClick={this.handleDeleteJigsaw} />
              </div>
              }
            </div> :
            <div className={styles.upCover} style={styleDisabled} onClick={!disabled ? this.handleCreateJigsaw : () => {}}>
              <Icon type="plus" />
              <p style={{ fontSize: 14 }}>添加搭配图</p>
            </div>
          }
        </div>
      </div>
    );
  }
}
