import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import path from 'path';
import { Form, Input, Tabs, Button, Icon, Checkbox, Row, Col, Alert, message, Upload } from 'antd';
import { QINIU_DOMAIN, QINIU_UPLOAD_DOMAIN } from '../../constants';
import styles from './UserInfo.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;

@connect(state => ({
  currentUser: state.user.currentUser,
  qiniucloud: state.qiniucloud,
}))
export default class UserInfo extends Component {
  state = {
    currentUser: {
      name: '',
      avatar: '',
      phone: '',
    }
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'user/fetchCurrent',
      callback: (result) => {
        this.setState({
          currentUser: result.user,
        })
      },
    });
    this.props.dispatch({
      type: 'qiniucloud/fetchUptoken'
    });
  }
  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;
    
  }

  componentWillUnmount() {
    
  }
  handleChange = async ({file}) => {
    const { dispatch, currentUser } = this.props;
    if (file.response && !file.error) {
      const url = `${QINIU_DOMAIN}/${file.response.key}`;
      dispatch({
        type: 'user/update',
        payload: {
          _id: currentUser._id,
          avatar: url,
        },
        callback: (result) => {
          if (result.error) {
            message.error(result.msg);
          } else {
            message.success(result.msg);
            this.setState({
              currentUser: { ...currentUser, avatar: url }
            })
          }
        },
      });
    }
  }
  makeUploadData = (file) => {
    const { qiniucloud } = this.props;
    const extname = path.extname(file.name);
    return {
      token: qiniucloud.uptoken,
      key: `${file.uid}${extname}`,
    }
  }
  handleSubmit = () => {
    const { dispatch } = this.props;
    const { currentUser } = this.state;
    dispatch({
      type: 'user/update',
      payload: {
        _id: currentUser._id,
        name: currentUser.name,
      },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          message.success(result.msg);
        }
      },
    });
  }

  render() {
    const { currentUser } = this.state;
    return (
      <div className={styles.main}>
        <div className={styles.top}>
          个人信息
        </div>
        <div>
          <Row className={styles.rowBox}>
            <Col className={styles.labelSpan} span={6}>
              <span>头像：</span>
            </Col>
            <Col span={14}>
              <img className={styles.imgBox} src={currentUser.avatar} />
            </Col>
            <Col span={4} style={{ textAlign: 'right'}}>
              <div type="primary" style={{ height: 80, lineHeight: '80px' }}>
                 <Upload
                  name="file"
                  listType="text"
                  showUploadList={false}
                  action={QINIU_UPLOAD_DOMAIN}
                  data={this.makeUploadData}
                  onChange={this.handleChange}
                  style={{ color: '#40a9ff', cursor: 'pointer' }}
                >
                  修改
                </Upload>
              </div>
            </Col>
          </Row>

          <Row className={styles.rowBox}>
            <Col className={styles.labelSpan} span={6}>
              <span>用户名：</span>
            </Col>
            <Col span={14}>
              <Input value={currentUser.name} onChange={(e) => this.setState({ currentUser: { ...currentUser, name: e.target.value } })} />
            </Col>
            <Col span={4} style={{ textAlign: 'right'}}>
              <Button type="primary" onClick={() => this.handleSubmit('name')}>保存</Button>
            </Col>
          </Row>
          <Row className={styles.rowBox}>
            <Col className={styles.labelSpan} span={6}>
              <span>手机号：</span>
            </Col>
            <Col span={18}>
              <span>{ currentUser.phone }</span>
            </Col>
          </Row>

          <Row className={styles.rowBox}>
            <Col className={styles.labelSpan} span={6}>
              <span>密码：</span>
            </Col>
            <Col span={18}>
              <Link to="/setting/password?type=pass">
                <Button size="small" onClick={() => this.setState({ changePsd: true })}>修改密码</Button>
              </Link>
            </Col>
          </Row>
        </div>

      </div>
    );
  }
}
