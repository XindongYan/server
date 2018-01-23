import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import JigsawModal from '../../AlbumModal/JigsawModal';
import styles from './AnchorImageList.less';
@connect(state => ({

}))
export default class AnchorImageList extends PureComponent {
  state = {
    
  }
  componentDidMount() {
    
  }
  componentWillReceiveProps(nextProps) {
    
  }
  componentWillUnmount() {

  }
  handleShowJigsawModal = (e) => {
    this.props.dispatch({
      type: 'album/showJigsaw',
      payload: {
        visible: true,
        
      }
    });
  }
  render() {
    const {  } = this.props;
    return (
      <div>
        <p>主图</p>
        <div style={{ padding: '10px 20px' }}>
          <div className={styles.upCover} style={{ padding: '60px 0', width: 200, height: 200 }} onClick={this.handleShowJigsawModal}>
            <Icon type="plus" />
            <p style={{ fontSize: 14 }}>添加搭配图</p>
          </div>
        </div>
        <JigsawModal />
      </div>
    );
  }
}
