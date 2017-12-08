import React, { PureComponent } from 'react';
import { connect } from 'dva';
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
      textAlign: 'center',
      fontSize: 12,
      padding: 10,
      border: 'none',
    };
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
    const contentListNoTitle = {
      0: <p>article content</p>,
      1: <p>app content</p>,
      2: <p>project content</p>,
      3: <p> content</p>,
    };
    return (
      <Card
        bordered={false}
        tabList={tabListNoTitle}
        onTabChange={(key) => { this.onTabChange(key); }}
      >
        { showClothes && showClothes.length > 0 &&
          showClothes.map((item,index) => <Card.Grid key={index} style={gridStyle}>{item.name}</Card.Grid>)
        }
      </Card>
    );
  }
}
