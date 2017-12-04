import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Modal, message, Icon, Button, Tag, Collapse } from 'antd';
import moment from 'moment';
import path from 'path';
import styles from './index.less';

const Panel = Collapse.Panel;
@connect(state => ({

}))

  
export default class ProjectDetail extends PureComponent {
  state = {
    fileBox: false,
  }
  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {

  }

  fileBoxVisible = () => {
    this.setState({
      fileBox: !(this.state.fileBox)
    })
  }
  render() {
    const { project } = this.props;
    const { fileBox } = this.state;
    return (
      <Card bordered={false} bodyStyle={{paddingBottom: 10 }} style={{ marginBottom: 10 }}>
        <div>
          <h3>{ project.name ? project.name : '无' }
          <Tag style={{ marginLeft: 10 }} color="cyan">{ project.merchant_tag ? project.merchant_tag : '无' }</Tag></h3>
        </div>
        <div>
          <div className={styles.projectDescBox} style={{ marginTop: 10 }}>{ project.desc ? project.desc : '无' }</div>
          <div className={styles.projectTagBox}>
            <span className={styles.projectTag}>活动酬劳:
              <span>¥{ project.price ? project.price : '无' }</span>
            </span>
            <span className={styles.projectTag}>截稿日期:
              <span>{ project.deadline ? moment(project.deadline).format('YYYY-MM-DD') : '无' }</span>
            </span>
            { project.attachments && project.attachments.length > 0 ?
              <span style={{ float: 'right' }} onClick={this.fileBoxVisible}>
                <a href="javascript:;">{ fileBox ? '收起' : '查看附件' }<Icon type={ fileBox ? 'up' : 'down' } /></a>
              </span>
              : ''
            }
          </div>
        </div>  
        <ul className={styles.fileBox} style={{ display: fileBox ? 'block' : 'none' }}>
          { project.attachments && project.attachments.length > 0 ? project.attachments.map((item,index) => <li key={index}><a href={item.url}>{item.name}</a></li>) : <li></li>}
        </ul>
      </Card>
    );
  }
}
