import React, { PureComponent } from 'react';
import { connect } from 'dva';
import $ from 'jquery';
import { Card, Table, Input, message, Icon } from 'antd';
import { ORIGIN } from '../../constants';
import styles from './WeTaobao.less';
import request from '../../utils/request';

const Search = Input.Search;
@connect(state => ({

}))
export default class WeTaobao extends PureComponent {
  state = {
    sevenValue: '',
    qualitValue: '',
    sevenVisible: -1,
    qualitList: [],
  };

  componentDidMount () {
    
  }

  onSearchSeven = (value) => {
    this.setState({
      sevenVisible: -1,
    })
    if (value) {
      $.ajax({
        type:"GET",
        url:`${ORIGIN}/api/spider/data.detail.taobao`,
        data:{
          url: value
        },
        success:(result) => {
          console.log(result)
          if(!result.error){
            this.setState({
              sevenVisible: result.success,
            })
          } else {
            message.warn(result.msg,)
          }
        },
        error:function(){
          message.error('出错了');
        }
      });
    } else {
      message.warn('请输入搜索内容');
    }
  }
  onSearchqualit = (value) => {
    this.setState({
      qualitList: [],
    })
    const { qualitList } = this.state;
    if (value){
      $.ajax({
        type:'GET',
        url:`${ORIGIN}/api/spider/title.detail.taobao`,
        data:{
          text: value
        },
        success: (result) => {
          if( result.data && result.data.length > 0 ){
            this.setState({
              qualitList: result.data,
            })
          } else {
            message.warn('无数据');
          }
        },
        error: () => {
          message.warn('无数据');
        }
      })
    } else {
      message.warn('请输入要查询的链接');
    }
  }
  render (){
    const { sevenValue, sevenVisible, qualitValue, qualitList } = this.state;
    const columns = [
      {
        title: '店铺名称',
        dataIndex: 'raw_title',
        render: (value, row) => <a target="_blank" href={row.detail_url} dangerouslySetInnerHTML={{__html: value}}></a>
      },
      {
        title: '品质等级',
        width: 150,
        dataIndex: 'q_score',
      },
    ]
    return (
      <Card bordered={false}>
        <div>
          <p className={styles.tbSearchTit}>查询淘宝商品是否符合新七条</p>
          <div className="searchBox">
            <Search
              placeholder=""
              enterButton="搜索"
              size="large"
              onSearch={this.onSearchSeven}
              onChange={(e) => this.setState({ sevenValue: e.target.value })}
              value={sevenValue}
            />
          </div>
          <div className={styles.dataList}>
            { sevenVisible === 1 &&
              <div className={styles.sevenBox}>
                <Icon style={{ color: '#009688', fontSize: 40, display: 'block' }} type="check-circle" />
                该商品符合新七条
              </div>
            }
            { sevenVisible === 0 &&
              <div className={styles.sevenBox}>
                <Icon style={{ color: '#c21', fontSize: 40, display: 'block' }} type="close-circle" />
                该商品不符合新七条
              </div>
            }
          </div>
        </div>
        <div style={{ marginTop: 40 }}>
          <p className={styles.tbSearchTit}>查询淘宝商品品质等级</p>
          <div className="searchBox">
            <Search
              placeholder=""
              enterButton="搜索"
              size="large"
              onSearch={this.onSearchqualit}
              onChange={(e) => this.setState({ qualitValue: e.target.value })}
              value={qualitValue}
            />
          </div>
          <div className={styles.dataList}>
            <Table
              pagination={false}
              dataSource={qualitList}
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
