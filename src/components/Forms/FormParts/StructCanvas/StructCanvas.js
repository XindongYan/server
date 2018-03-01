import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Icon, message, Row, Col, Tag, Button, Form, Anchor, Popover } from 'antd';
import styles from '../index.less';
import AlbumModal from '../../../AlbumModal';

const FormItem = Form.Item;
const { TextArea } = Input;
@connect(state => ({

}))
@Form.create()
export default class StructCanvas extends PureComponent {
  state = {

  }
  componentDidMount() {
    
  }
  componentWillReceiveProps(nextProps) {
    
  }
  componentWillUnmount() {

  }

  render() {
    const { operation, props, formData } = this.props;
    const { images } = this.state;
    let disabled = false;
    if (operation === 'view') {
      disabled = true;
    }
    return (
      <div style={{ padding: '0 0 20px'}}>
        { !disabled && <Anchor style={{ position: 'absolute', top: 0, left: '-80px' }}>
          <div onClick={this.handleAddBodyStruct} style={{ width: 65, height: 65, padding: '6px 0', cursor: 'pointer', textAlign: 'center' }}>
            <div>
              <img style={{ width: 30, height: 30 }} src="//img.alicdn.com/tfs/TB1Q4jRa.gQMeJjy0FfXXbddXXa-48-48.png" />
            </div>
            <div style={{ fontSize: 12, color: '#999' }}>
              自定义段落
            </div>
          </div>
        </Anchor>}
        <Popover
          overlayClassName={styles.popover_box}
          placement="right"
          title="111"
          // content={this.renderLongpointContent()}
          trigger="click"
          visible={this.state.visibleLongpoint}
          autoAdjustOverflow={false}
        >
          <div style={{ padding: 20, border: this.state.visibleLongpoint ? '2px solid #00b395' : 'none' }} onClick={this.handleShowLongpoint}>
            <div className={styles.section_show_title}>
              好在哪里
            </div>
            { formData && formData.bodyStruct0 && formData.bodyStruct0.length > 0 ?
              <ul>
                {formData.bodyStruct0.map((item, index) => <li key={index} className={styles.longpoint_list_item}>{item}</li>)}
              </ul> :
              <ul>
                {[0,1,2].map(item => <li key={item} className={styles.longpoint_list_item}>长亮点描述</li>)}
              </ul>
            }
          </div>
        </Popover>
        { formData && formData.bodyStruct.map((item, index) =><Popover style={{ padding: 20 }}
            key={index}
            overlayClassName={styles.popover_box}
            placement="right"
            title={this.renderBodyStructTitle()}
            content={<BodyStructContent onChange={this.handleChangeBodyStruct} formData={item} index={index} />}
            trigger="click"
            visible={this.state.visibleBodyStruct === index ? true : false}
            autoAdjustOverflow={false}
          >
            <div style={{ padding: 20, position: 'relative', border: this.state.visibleBodyStruct === index ? '2px solid #00b395' : 'none' }} onClick={() => this.handleShowBodyStruct(index)}>
              <div className={styles.section_show_title}>
                { item && item.title ? item.title : '请输入段落标题' }
              </div>
              <div style={{ marginBottom: 20 }}>
                { item && item.desc ? item.desc : '请输入段落介绍文本' }
              </div>
              <div>
                <img
                  style={{ width: '100%', height: 'auto' }}
                  src={item && item.images && item.images.length > 0 ? item.images[0].picUrl : 'https://gw.alicdn.com/tfs/TB1A5.geC_I8KJjy0FoXXaFnVXa-702-688.jpg_790x10000Q75.jpg_.webp'}
                ></img>
              </div>
              { this.state.visibleBodyStruct === index &&
                <div onClick={() => this.handleDeleteContent(index)} className={styles.deleteContentBox}>
                  <Icon type="delete" />
                </div>
              }
            </div>
          </Popover>)
        }
      </div>
    );
  }
}
