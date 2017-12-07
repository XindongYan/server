import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Input } from 'antd';
import { RIGHTS, APPROVE_ROLES, ROLES } from '../../constants';
import styles from './ShopPool.less';

const Search = Input.Search;
@connect(state => ({

}))
export default class ShopPool extends PureComponent {
  state = {
    tableMsg: [],
    searchValue: '',
  };

  componentDidMount() {
    
  }
  onSearch = () => {
    
  }
  render() {
    const { tableMsg } = this.state;
    const columns = [
      {
        title: '序号',
        width: 100,
        dataIndex: 'numLine',
      },
      {
        title: '店铺名称',
        dataIndex: 'value',
      },
      {
        title: '操作',
        width: 100,
        dataIndex: 'url',
        render: (value) => <a target="_blank" href={value}>详情</a>
      },
    ]
    return (
      <Card>
        <div className="dpcz">

          <p className={styles.tbSearchTit}>查询店铺商品入选的池子</p>
          <div className="searchBox">
            <Search placeholder="" enterButton="Search" size="large" onSearch={this.onSearch} />
          </div>
          <div className={styles.dataList}>
            
            <Table
              rowKey={record => record.key}
              dataSource={tableMsg}
              columns={columns}
              rowKey="numLine"
            />
          </div>
        </div>
      </Card>
    );
  }
}
