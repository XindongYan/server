import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Input, message, Icon } from 'antd';
import styles from './WeTaobao.less';
import { searchStatistic, queryQumai } from '../../services/tool';

const Search = Input.Search;
@connect(state => ({
  currentUser: state.user.currentUser,
}))
export default class WeTaobao extends PureComponent {
  state = {
    text: '',
    data: {htmls: ''},
  }

  componentDidMount () {
    
  }

  onSearchqualit = async (value) => {
    const { currentUser } = this.props;
    searchStatistic({
      name: '有好货查重',
      user_id: currentUser._id,
      username: currentUser.nickname,
    });
    this.setState({
      qualitList: [],
    })
    const { qualitList } = this.state;
    if (value){
      const result = await queryQumai({text: value});
      if(result.data ){
        this.setState({
          data: result.data,
        })
      } else {
        message.error('请输入正确的商品链接');
      }
    } else {
      message.warn('请输入要查询的宝贝');
    }
  }
  clearInpValDown = () => {
    this.setState({
      text: '',
      data: {htmls: ''}
    })
  }
  render (){
    const { text, data } = this.state;
    return (
      <Card bordered={false}>
        <div>
          <p className={styles.tbSearchTit}>有好货查重</p>
          <div className={styles.searchBox} style={{ position: 'relative' }}>
            <Search
              placeholder="输入链接"
              enterButton="搜索"
              size="large"
              onSearch={this.onSearchqualit}
              onChange={(e) => this.setState({ text: e.target.value, data: {htmls: ''} })}
              value={text}
            />
            <Icon type="close-circle" className={styles.clearInpIcon} onClick={this.clearInpValDown} />
          </div>
          <div style={{textAlign: 'center', marginTop: 20}} dangerouslySetInnerHTML={{__html: data.htmls}}>
          </div>
        </div>
      </Card>
    );
  }
}
