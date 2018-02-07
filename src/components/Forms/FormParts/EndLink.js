import React, { PureComponent } from 'react';
import { connect } from 'dva';
import $ from 'jquery';
import { Input, Icon, message, Row, Col, Tag, Button, Form } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;

@connect(state => ({

}))
@Form.create()
export default class EndLink extends PureComponent {
  state = {
    tag: false,
  }
  componentDidMount() {
    const { formData } = this.props;
    if (formData && formData.title && this.props.operation !== 'view') {
      if (formData.end_link) {
        this.setState({
          tag: true
        })
      }
      const fieldsValue = {
        href: formData.end_link,
        name: formData.end_text,
      };
      this.props.form.setFieldsValue(fieldsValue);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.formData.title && nextProps.formData.title && this.props.operation !== 'view') {
      const { formData } = nextProps;
      if (formData.end_link) {
        this.setState({
          tag: true
        })
      }
      const fieldsValue = {
        href: formData.end_link,
        name: formData.end_text,
      };
      this.props.form.setFieldsValue(fieldsValue);
    }
  }
  componentWillUnmount() {

  }
  handleAddEndLink = () => {
  	this.props.form.validateFields((err, val) => {
      if (!err) {
        if (this.props.onChange) this.props.onChange(val.href, val.name);
        this.setState({
          tag: true,
        });
        this.props.form.resetFields();
      }
    })
  }
  handleClearInp = () => {
    this.props.form.resetFields();
  }
  handleCloseTag = () => {
    if (this.props.onChange) this.props.onChange('', '');
    this.setState({
      tag: false,
    })
  }
  render() {
    const { formData, operation, form: { getFieldDecorator } } = this.props;
    return (
      <div style={{ padding: '20px', background: '#fff' }}>
        { operation !== 'view' && <div>
          <p className={styles.lineTitleDefult}>
            文末链接
          </p>
          <div>
            { !this.state.tag &&
              <Row gutter={10}>
                <Col span={10}>
                  <FormItem>
                    {getFieldDecorator('href', {
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
                    {getFieldDecorator('name', {
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
              { this.state.tag &&
                <Tag closable onClose={this.handleCloseTag} style={{ height: 30, lineHeight: '30px', border: 'none', background: '#ECEEF2' }}>
                  <Icon type="link" style={{ float: 'left', margin: '0 5px', height: 30, lineHeight: '30px' }} />
                  <a target="_blank" href={formData.end_link} style={{ float: 'left', minWidth: 200, color: '#308CE6', maxWidth: 260, overflow: 'hidden' }}>{formData.end_text}</a>
                </Tag>
              }
            </div>
          </div>
          <p className={styles.promptText}>
            仅支持淘宝、天猫等阿里巴巴旗下网站链接（支付宝除外)
          </p>
        </div>}
        { operation === 'view' && formData.end_link && <div>
          <p className={styles.lineTitleDefult}>
            文末链接
          </p>
          <div>
            <Tag style={{ height: 30, lineHeight: '30px', border: 'none', background: '#ECEEF2' }}>
              <Icon type="link" style={{ margin: '0 5px' }} />
              <a target="_blank" href={formData.end_link} style={{ paddingRight: 80, color: '#308CE6' }}>{formData.end_text}</a>
            </Tag>
          </div>
        </div>}
      </div>
    );
  }
}
