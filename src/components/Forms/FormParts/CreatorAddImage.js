import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import AlbumModal from '../../AlbumModal';
import styles from './index.less';
@connect(state => ({
}))
export default class CreatorAddImage extends PureComponent {
  uploadCoverImg = () => {
    this.props.dispatch({
      type: 'album/show',
      payload: { currentKey: this.props.name }
    });
  }
  handleDeleteCover = (index) => {
    const value = Object.assign([], this.props.props.value);
    value.splice(index, 1);
    if (this.props.onChange) this.props.onChange(value);
  }
  handleChangeCover = (imgs) => {
    if (imgs && imgs.length > 0) {
      const value = Object.assign([], this.props.props.value);
      value.push({
        anchors: [],
        hotSpaces: [],
        materialId: imgs[0].materialId,
        url: imgs[0].url,
      });
      if (this.props.onChange) this.props.onChange(value);
    }
  }
  render() {
    const { name, props, rules } = this.props;
    const disabled = this.props.operation === 'view' ? true : false;
    const coverViewStyles = disabled ? {border: '1px solid #ccc', color: '#ccc'} : {};
    const needAdd = props.value.length < props.max;
    return (
      <div style={{ padding: '10px 0'}}>
        <div>
          { props.value.map((item, index) =>
            <div className={styles.coverPic} key={index}>
              <img src={item.url} style={{ height: '100%', width: '100%' }}/>
              { !disabled &&
                <div className={styles.coverModal} onClick={() => this.handleDeleteCover(index)}>
                  <Icon type="delete" />
                </div>
              }
            </div>)}
          { needAdd &&
            <div className={styles.upCover} onClick={!disabled ? this.uploadCoverImg : () => {}} style={coverViewStyles}>
              <div style={{ position: 'absolute', top: '50%', marginTop: -33, width: '100%'}}>
                <Icon type="plus"/>
                <p style={{ fontSize: 14 }}>{props.uploadTips}</p>
              </div>
            </div>
          }
        </div>
        <p style={{ height: 18, lineHeight: '18px', fontSize: '12px', color: '#999', marginTop: 5 }}>{props.tips}</p>
        <AlbumModal mode="single" k={name} minSize={{ width: 750, height: 422 }} onOk={this.handleChangeCover}/>
      </div>
    );
  }
}
