import React, { PureComponent } from 'react';
import { connect } from 'dva';
import $ from 'jquery';
import fetch from 'dva/fetch';
import { Icon, Card, Table, Input, message } from 'antd';
import { ORIGIN } from '../../constants';
import styles from './ShopPool.less';

const Search = Input.Search;
@connect(state => ({

}))
export default class ShopPool extends PureComponent {
  state = {
    tableMsg: [],
    searchValue: '',
    shopArr: [],
    num: 0,
  };

  async componentDidMount () {
    const arr = await fetch(`${ORIGIN}/jsons/shopPool.json`, {
    }).then(response => response.json());
    this.setState({
      shopArr: arr,
    })
  }
  getShops = () => {
    this.setState({
      tableMsg: [],
      num: 0,
    })
    const { shopArr, searchValue, tableMsg } = this.state;
    if (!searchValue) {
      message.warn('请输入店铺名称');
      return;
    }
    let numLine = 0;
    for (var i = 0; i < shopArr.length; i ++) {
      const value = shopArr[i];
      let kxuan_url = `https://kxuan.taobao.com/searchSp.htm?ajax=true&callback=jsonp2711&q=${
      searchValue}&id=${value.nested_id}&${value.param_name}=${value.second_param}&nested=we&number=${Math.random()}`;
      $.ajax({
        url:kxuan_url,
        dataType:'jsonp',
        async:true,
        type:'get',
        success: (data) => {
          const aryAuctions = data["mods"]["itemlist"] ? data["mods"]["itemlist"]["data"]["auctions"] : []; // object
          if (aryAuctions.length >= 1) {
            kxuan_url = "https://kxuan.taobao.com/search.htm?uniq=pid&navigator=all&q=";
            kxuan_url += searchValue;
            kxuan_url += "&id=";
            kxuan_url += value.nested_id;
            kxuan_url += "&";
            kxuan_url += value.param_name;
            kxuan_url += "=";
            kxuan_url += value.second_param;
            numLine += 1;
            var json = {
              numLine:numLine,
              value:value,
              shopName:value.theme_name,
              accountNick:value.account_nick,
              url:kxuan_url
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
              placeholder="请输入店铺名"
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
