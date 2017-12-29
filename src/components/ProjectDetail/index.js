import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Modal, message, Icon, Button, Tag, Collapse, Tooltip } from 'antd';
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
  createTaskInto = () => {
    if (this.props.createTaskInto) this.props.createTaskInto();
  }
  render() {
    const { project, type } = this.props;
    const { fileBox } = this.state;
    let color = 'volcano';
    let borderColor = '#FF6A00';
    if (project.channel_name === '淘宝头条') {
      color = 'volcano';
      borderColor = '#FF6A00';
    } else if (project.channel_name === '微淘') {
      color = 'orange';
      borderColor = '#ffe58f';
    } else {
      color = 'blue';
      borderColor = '#6AF';
    }
    return (
      <Card bordered={false} bodyStyle={{paddingBottom: 10 }} style={{ marginBottom: 10 }}>
        <div>
          <h3 className={styles.clearFix}>
            { project.name ? project.name : '' }
            { type && type === 2 &&
              <Button type="primary" style={{ float: 'right' }} onClick={this.createTaskInto}>投稿</Button>
            }
          </h3>
          <div>
              
          </div>
        </div>
        <div style={{ marginTop: 8}}>
          <Tooltip title="活动ID">
            <Tag color="green">{ project.id}</Tag>
          </Tooltip>
          <Tooltip title="发布渠道">
            { project.channel_name &&
              <Tag color={color}>{ project.channel_name }</Tag>
            }
          </Tooltip>
          <Tooltip title="商家标签">
            <Tag color="cyan">{ project.merchant_tag}</Tag>
          </Tooltip>
        </div>
        <div>
          <div className={styles.projectDescBox} style={{ marginTop: 10 }}>
            { project.desc ? project.desc : '' }
          </div>
          <div className={styles.projectTagBox}>
            { project.price !== 0 &&
              <span className={styles.projectTag}>活动酬劳：¥
                <span>{ project.price }</span>
              </span>
            }
            { project.deadline &&
              <span className={styles.projectTag}>截稿日期：
                <span>{ project.deadline ? moment(project.deadline).format('YYYY-MM-DD HH:mm:ss') : '' }</span>
              </span>
            }
            { project.attachments && project.attachments.length > 0 &&
              <span style={{ float: 'right' }} onClick={this.fileBoxVisible}>
                <a href="javascript:;">{ fileBox ? '收起' : '查看附件' }<Icon type={ fileBox ? 'up' : 'down' } /></a>
              </span>
            }
          </div>
        </div>  
        <ul className={styles.fileBox} style={{ display: fileBox ? 'block' : 'none' }}>
          { project.attachments && project.attachments.length > 0 &&
            project.attachments.map((item,index) => <li key={index}><a target="_blank" href={item.url}>{item.name}</a></li>)
          }
        </ul>
      </Card>
    );
  }
}
