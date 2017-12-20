import React, { PureComponent } from 'react';
import { connect } from 'dva';
import fetch from 'dva/fetch';
import { Card, message } from 'antd';
import { ORIGIN } from '../../constants';
import styles from './Clothes.less';

@connect(state => ({

}))


export default class Clothes extends PureComponent {
  state = {
    key: 0,
    clothList: [],
    showClothes: [],
  };

  async componentDidMount () {
    const arr = await fetch(`${ORIGIN}/jsons/clothes-list.json`, {
    }).then(response => response.json());
    this.setState({
      clothList: arr,
      showClothes: arr[0].data,
    })
  }
  onTabChange = (key) => {
    const { clothList } = this.state;
    this.setState({
      key: key,
      showClothes: clothList[key].data,
    });
  }
  render (){
    const gridStyle = {
      width: '20%',      
      padding: 10,
      minHeight: 56,
      verticalAlign: 'middle',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    };
    const gridItemStyle = {
      textAlign: 'center',
      fontSize: 12,
    }
    const { clothList, key, showClothes } = this.state;
    const tabListNoTitle = [{
      key: 0,
      tab: '女装/女士精品',
    }, {
      key: 1,
      tab: '男装',
    }, {
      key: 2,
      tab: '女士内衣/男士内衣/家居服',
    }, {
      key: 3,
      tab: '服饰配件',
    }];
    return (
      <Card
        bordered={false}
        tabList={tabListNoTitle}
        onTabChange={(key) => { this.onTabChange(key); }}
      >
        { showClothes && showClothes.length > 0 &&
          showClothes.map((item,index) => 
            <Card.Grid key={index} style={gridStyle}>
              <div style={gridItemStyle}>{item.name}</div>
            </Card.Grid>)
        }
      </Card>
    );
  }
}
