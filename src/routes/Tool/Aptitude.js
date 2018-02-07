import React, { PureComponent } from 'react';
import { connect } from 'dva';
import $ from 'jquery';
import fetch from 'dva/fetch';
import { Icon, Card, Table, Input, message } from 'antd';
import styles from './ShopPool.less';

const Search = Input.Search;
@connect(state => ({

}))
export default class Aptitude extends PureComponent {
  state = {
    
  };

  async componentDidMount () {
    
  }
  getShops = () => {
    
  }
  clearInpVal = () => {
    this.setState({
      searchValue: '',
      tableMsg: [],
    })
  }
  render (){
    const { tableMsg, searchValue } = this.state;
    return (
      <Card bordered={false}>
        <div>
          <p className={styles.tbSearchTit}>查询店铺资质</p>
          <div className={styles.searchBox} style={{ position: 'relative' }}>
            <Search
              placeholder="请输入要搜索的店铺链接"
              enterButton="搜索"
              size="large"
              onSearch={this.getShops}
              onChange={(e) => this.setState({ searchValue: e.target.value })}
              value={searchValue}
            />
            <Icon type="close-circle" className={styles.clearInpIcon} onClick={this.clearInpVal} />
          </div>
        </div>
      </Card>
    );
  }
}
