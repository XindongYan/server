import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Input, message, Icon } from 'antd';
import styles from './WeTaobao.less';
import { searchStatistic, searchNew7 } from '../../services/tool';

const Search = Input.Search;
@connect(state => ({
  currentUser: state.user.currentUser,
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

  // onSearchSeven = (value) => {
  //   this.setState({
  //     sevenVisible: -1,
  //   })
  //   if (value) {
  //     $.ajax({
  //       type:"GET",
  //       url:`${ORIGIN}/api/spider/data.detail.taobao`,
  //       data:{
  //         url: value
  //       },
  //       success:(result) => {
  //         if(!result.error){
  //           this.setState({
  //             sevenVisible: result.success,
  //           })
  //         } else {
  //           message.warn(result.msg,)
  //         }
  //       },
  //       error:function(){
  //         message.error('出错了');
  //       }
  //     });
  //   } else {
  //     message.warn('请输入搜索内容');
  //   }
  // }
  onSearchqualit = async (value) => {
    const { currentUser } = this.props;
    searchStatistic({
      name: '查询新七条',
      user_id: currentUser._id,
      username: currentUser.name,
    });
    this.setState({
      qualitList: [],
    })
    const { qualitList } = this.state;
    if (value){
      const result = await searchNew7({text: value});
      if(result.data && result.data.length > 0 ){
        this.setState({
          qualitList: result.data,
        })
      } else {
        this.setState({
          qualitList: [
            {
              raw_title: '商品',
              detail_url: value,
              icon: [],
              nid: 0,
            }
          ],
        })
        // message.warn('没有找到该商品！');
      }
    } else {
      message.warn('请输入要查询的宝贝');
    }
  }
  clearInpValDown = () => {
    this.setState({
      qualitValue: '',
      qualitList: [],
    })
  }
  clearInpValUp = () => {
    this.setState({
      sevenValue: '',
      sevenVisible: -1,
    })
  }
  render (){
    const { sevenValue, sevenVisible, qualitValue, qualitList } = this.state;
    
    const columns = [
      {
        title: '商品',
        dataIndex: 'raw_title',
        width: 600,
        render: (value, row) => <a target="_blank" href={row.detail_url} dangerouslySetInnerHTML={{__html: value}}></a>
      },
      {
        title: '新七条',
        width: 80,
        dataIndex: 'icon',
        render: (value) => {
          const str = value.find(item => /新7条/.test(item.innerText));
          return str ? '符合' : '不符合';
        },
      },
    ];
    const score = {
      title: '品质档',
      width: 80,
      dataIndex: 'q_score',
    };
    const tk_rate_suf = {
      title: '淘客佣金',
      dataIndex: 'tk_rate_suf',
      width: 80,
      render: (value, record) => `${record.tk_rate_pre}${value}`,
    };
    const view_price = {
      title: '售价',
      dataIndex: 'view_price',
      width: 80,
    };
    const comment_count = {
      title: '评论数',
      dataIndex: 'comment_count',
      width: 80,
    };
    if (qualitList[0] && qualitList[0].q_score) {
      columns.push(score, tk_rate_suf, view_price, comment_count);
    }
    return (
      <Card bordered={false}>
        {/*
          <div>
            <p className={styles.tbSearchTit}>查询淘宝商品是否符合新七条</p>
            <div className={styles.searchBox} style={{ position: 'relative' }}>
              <Search
                placeholder=""
                enterButton="搜索"
                size="large"
                onSearch={this.onSearchSeven}
                onChange={(e) => this.setState({ sevenValue: e.target.value })}
                value={sevenValue}
              />
              <Icon type="close-circle" className={styles.clearInpIcon} onClick={this.clearInpValUp} />
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
        */}
        <div>
          <p className={styles.tbSearchTit}>查询淘宝商品品质等级及是否符合新七条</p>
          <div className={styles.searchBox} style={{ position: 'relative' }}>
            <Search
              placeholder="输入标题模糊查找／宝贝链接精确查找"
              enterButton="搜索"
              size="large"
              onSearch={this.onSearchqualit}
              onChange={(e) => this.setState({ qualitValue: e.target.value })}
              value={qualitValue}
            />
            <Icon type="close-circle" className={styles.clearInpIcon} onClick={this.clearInpValDown} />
          </div>
          <div className={styles.dataList}>
            <Table
              pagination={{ pageSize: 15 }}
              dataSource={qualitList}
              size="small"
              columns={columns}
              rowKey="nid"
            />
          </div>
        </div>
      </Card>
    );
  }
}
