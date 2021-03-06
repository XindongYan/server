import React, { PureComponent } from 'react';
import { connect } from 'dva';
import $ from 'jquery';
import fetch from 'dva/fetch';
import { Icon, Card, Table, Input, message } from 'antd';
import url from 'url';
import querystring from 'querystring';
import styles from './ShopPool.less';
import { searchStatistic } from '../../services/tool';

const Search = Input.Search;
@connect(state => ({
  currentUser: state.user.currentUser,
}))
export default class ShopPool extends PureComponent {
  state = {
    tableMsg: [],
    searchValue: '',
    shopArr: [],
    num: 0,
  };

  async componentDidMount () {
    const arr = await fetch(`/jsons/shopPool.json`, {
    }).then(response => response.json());
    this.setState({
      shopArr: arr,
    })
  }
  getShops = () => {
    const { currentUser } = this.props;
    const { shopArr, searchValue, tableMsg } = this.state;
    this.setState({
      tableMsg: [],
      num: 0,
    })
    let valueInp = searchValue;
    if (!valueInp) {
      message.warn('请输入要搜索的关键词或商品链接');
      return;
    } else if (/(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(valueInp)) {
      valueInp = escape(valueInp);
    }
    let numLine = 0;
    for (let i = 0; i < shopArr.length; i ++) {
      const value = shopArr[i];
      const kxuan_uplus_c2c_url = url.parse(value.kxuan_uplus_c2c_url);
      const query = querystring.parse(kxuan_uplus_c2c_url.query);
      let param_name = 'kxuan_swyt_c2c';
      if (query.kxuan_swyt_c2c) {
        param_name = 'kxuan_swyt_c2c';
      } else if (query.oetag) {
        param_name = 'oetag';
      } else if (query.kxuan_uplus_c2c) {
        param_name = 'kxuan_uplus_c2c';
      } else if (query.oetag) {
        param_name = 'oetag';
      }
      let kxuan_url = `https://kxuan.taobao.com/searchSp.htm?ajax=true&callback=jsonp2711&q=${
      valueInp}&id=${query.id}&${param_name}=${query[param_name]}&nested=we&number=${Math.random()}`;
      $.ajax({
        url:kxuan_url,
        dataType:'jsonp',
        async:true,
        type:'get',
        success: (data) => {
          const aryAuctions = data["mods"]["itemlist"] ? data["mods"]["itemlist"]["data"]["auctions"] : []; // object
          if (aryAuctions.length >= 1) {
            numLine += 1;
            const json = {
              numLine:numLine,
              value:value,
              shopName:value.theme_name,
              accountNick: '',
              url: `${value.kxuan_uplus_c2c_url}&q=${valueInp}`
            }
            this.setState({
              tableMsg: [ ...this.state.tableMsg, json ],
            })
          }
          this.setState({
            num: this.state.num + 1,
          }, () => {
            if (this.state.num === shopArr.length && this.state.tableMsg.length === 0){
              message.error('未找到');
            }
          })
        },
        error:function(XMLHttpRequest, textStatus, errorThrown) {

        }
      });
    }
    searchStatistic({
      name: '查询店铺池子',
      user_id: currentUser._id,
      username: currentUser.name,
    });
  }
  clearInpVal = () => {
    this.setState({
      searchValue: '',
      tableMsg: [],
    })
  }
  render (){
    const { tableMsg, searchValue } = this.state;
    const columns = [
      {
        title: '序号',
        width: 100,
        dataIndex: 'numLine',
      },
      {
        title: '选品池',
        dataIndex: 'shopName',
      },
      {
        title: '操作',
        width: 100,
        dataIndex: 'url',
        render: (value) => <a target="_blank" href={value}>详情</a>
      },
    ]
    return (
      <Card bordered={false}>
        <div className="dpcz">
          <p className={styles.tbSearchTit}>查询店铺商品入选的池子</p>
          <div className={styles.searchBox} style={{ position: 'relative' }}>
            <Search
              placeholder="请输入要搜索的关键词或商品链接"
              enterButton="搜索"
              size="large"
              onSearch={this.getShops}
              onChange={(e) => this.setState({ searchValue: e.target.value })}
              value={searchValue}
            />
            <Icon type="close-circle" className={styles.clearInpIcon} onClick={this.clearInpVal} />
          </div>
          <div className={styles.dataList}>
            <Table
              pagination={false}
              dataSource={tableMsg}
              size="small"
              columns={columns}
              rowKey="numLine"
            />
          </div>
        </div>
      </Card>
    );
  }
}
