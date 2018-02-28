import React, { PureComponent } from 'react';
import { Input, Icon, Row, Col, Tag, Button, Form, Tooltip } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;

export default class AddLink extends PureComponent {
  state = {
    names: ['link', 'text'],
  }
  handleAddEndLink = () => {
  	this.props.form.validateFields(this.state.names, (err, val) => {
      if (!err) {
        if (this.props.onChange) this.props.onChange([val]);
        this.props.form.resetFields(this.state.names);
      }
    })
  }
  handleClearInp = () => {
    this.props.form.resetFields(this.state.names);
  }
  handleCloseTag = () => {
    if (this.props.onChange) this.props.onChange([]);
  }
  render() {
    const { operation, name, props, rules } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div style={{ padding: '20px', background: '#fff' }}>
        { operation !== 'view' && <div>
          <p className={styles.lineTitleDefult}>
            文末链接
            <Tooltip placement="right" title={props.labelExtra}>
              <Icon type="question-circle-o" style={{ marginLeft: 5 }}/>
            </Tooltip>
          </p>
          <div>
            { props.value.length === 0 &&
              <Row gutter={10}>
                <Col span={10}>
                  <FormItem>
                    {getFieldDecorator('link', {
                      rules: [{
                        required: true, message: '  ',
                      }, {
                        type: 'url', message: ' ',
                      }],
                    })(
                      <Input
                        onChange={this.handleSubTitleChange}
                        placeholder="http(s)://"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    {getFieldDecorator('text', {
                      rules: [{
                        required: true, message: '  ',
                      }],
                    })(
                      <Input
                        onChange={this.handleSubTitleChange}
                        placeholder="请填写链接线上名称"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <Row gutter={0} style={{ paddingTop: 3 }}>
                    <Col span={12}>
                      <Button type="primary" onClick={this.handleAddEndLink}>确认</Button>
                    </Col>
                    <Col span={12}>
                      <Button onClick={this.handleClearInp}>清空</Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            }
            <div>
              { props.value.length > 0 &&
                <Tag closable onClose={this.handleCloseTag} style={{ height: 30, lineHeight: '30px', border: 'none', background: '#ECEEF2' }}>
                  <Icon type="link" style={{ float: 'left', margin: '0 5px', height: 30, lineHeight: '30px' }} />
                  <a target="_blank" href={props.value[0].link} style={{ float: 'left', minWidth: 200, color: '#308CE6', maxWidth: 260, overflow: 'hidden' }}>{props.value[0].text}</a>
                </Tag>
              }
            </div>
          </div>
          <p className={styles.promptText}>
            {props.tips}
          </p>
        </div>}
        { operation === 'view' && <div>
          <p className={styles.lineTitleDefult}>
            文末链接
          </p>
          <div>
            { props.value.length > 0 &&
              <Tag closable onClose={this.handleCloseTag} style={{ height: 30, lineHeight: '30px', border: 'none', background: '#ECEEF2' }}>
                <Icon type="link" style={{ float: 'left', margin: '0 5px', height: 30, lineHeight: '30px' }} />
                <a target="_blank" href={props.value[0].link} style={{ float: 'left', minWidth: 200, color: '#308CE6', maxWidth: 260, overflow: 'hidden' }}>{props.value[0].text}</a>
              </Tag>
            }
          </div>
        </div>}
      </div>
    );
  }
}
