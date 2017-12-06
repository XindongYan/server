import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import querystring from 'querystring';
import { Card, Button, Popconfirm, message, Modal, Form, Select } from 'antd';
// import $ from 'jquery';
import WeitaoForm from '../../components/Forms/WeitaoForm';
import { TASK_APPROVE_STATUS } from '../../constants';
import TaskChat from '../../components/TaskChat';
import styles from './TableList.less';

const FormItem = Form.Item;
const Option = Select.Option;
@connect(state => ({
  suggestionUsers: state.team.suggestionUsers,
  formData: state.task.formData,
  currentUser: state.user.currentUser,
}))
@Form.create()
export default class TaskCreate extends PureComponent {
  state = {
    task: {
      title: '',
      task_desc: '',
      cover_img: '',
    },
    modalVisible: false,
    phone: '',
    approver_id: '',
  }
  componentDidMount() {
    const query = querystring.parse(this.props.location.search.substr(1));
    if (query._id) {
      this.props.dispatch({
        type: 'task/fetchTask',
        payload: { _id: query._id },
        callback: (result) => {
          if (!result.error) {
            this.setState({
              task: {
                title: result.task.title,
                task_desc: result.task.task_desc,
                cover_img: result.task.cover_img,
              },
            });
          }
        }
      });
    }
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: true,
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: false,
    });
  }
  handleShowAddTeamUserModal = () => {
    this.setState({ modalVisible: true, });
  }
  handleSpecify = () => {
    const { dispatch } = this.props;
    const { approver_id } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (approver_id) {
          this.setState({ modalVisible: false });
          this.handleSubmit();
        } else {
          message.warn('请根据手机号选择审核人员！');
        }
      }
    });
  }
  handleChange = (task) => {
    this.setState({ task: { ...this.state.task, ...task } });
  }
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }
  onSearch = (value) => {
    this.setState({
      approver_id: '',
    })
    if (value.length == 11) {
      this.props.dispatch({
        type: 'team/fetchUsersByPhone',
        payload: {
          phone: value
        },
      });
    }
  }
  onSelect = (value) => {
    this.setState({
      approver_id: value,
    })
  }
  handleSubmit = () => {
    const { currentUser } = this.props;
    const { task, approver_id } = this.state;
    const query = querystring.parse(this.props.location.search.substr(1));
    if (!task.title || !task.title.replace(/\s+/g, '')) {
      message.warn('请填写标题');
    } else if (task.title && task.title.length > 19) {
      message.warn('标题字数不符合要求');
    } else if (!task.task_desc) {
      message.warn('请填写内容');
    } else if (!task.cover_img) {
      message.warn('请选择封面图');
    } else {
      this.props.dispatch({
        type: 'task/addByWriter',
        payload: {
          ...this.state.task,
          name: this.state.task.title,
          approve_status: TASK_APPROVE_STATUS.taken,
          channel_name: query.channel_name,
          publisher_id: currentUser._id, // 登录后用户的 user._id
          taker_id: currentUser._id,
          creator_id: currentUser._id,
          current_approvers: [ approver_id ],
        },
        callback: (result) => {
          if (result.error) {
            message.error(result.msg);
          } else {
            this.props.dispatch({
              type: 'task/handin',
              payload: { _id: result.task._id },
              callback: (result1) => {
                if (result1.error) {
                  message.error(result1.msg);
                } else {
                  this.props.dispatch(routerRedux.push(`/writer/task/handin/success?_id=${result.task._id}`));
                }
              }
            });
          }
        },
      });
    }
  }
  handleSave = () => {
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch({
      type: 'task/update',
      payload: { ...this.state.task, _id: query._id },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          message.success(result.msg);
        }
      }
    });
  }
  render() {
    const { suggestionUsers, form: { getFieldDecorator } } = this.props;
    const { modalVisible } = this.state;
    const query = querystring.parse(this.props.location.search.substr(1));
    return (
      <Card bordered={false} title="" style={{ background: 'none' }} bodyStyle={{ padding: 0 }}>
        <div className={styles.taskOuterBox} style={{ width: 942 }} ref="taskOuterBox">
          <WeitaoForm role="writer" operation="edit" style={{ width: 720 }} formData={this.state.task} onChange={this.handleChange} />
          <div className={styles.taskComment} style={{ width: 200 }}>
            <p className={styles.titleDefult}>爆文写作参考</p>
            <ul className={styles.tPrompt}>
              <li>1. 从小知识小技巧着手. 淘宝头条讲了个概念叫”随手有用书”,即生活中有很多一般人不注意的小知识小技巧. 比如大部分人都晾错内衣, 尤其是第二种方式这条,结合着推内衣这个点很不错.</li>
              <li>2. 从风格化, 场景化着手入手, 即内容针对目标人群.想一想目标针对用户有什么样的特点? 会对什么样的内容感兴趣?要去倒推.</li>
              <li>3. 从时下热点,八卦,新闻等角度着手.反正总之就是一句话:要用户产生觉得“有用”“感兴趣”等特别的感觉.</li>
            </ul>
          </div>
          <div className={styles.submitBox}>
            {/*
              <Popconfirm placement="top" title="确认已经写完并提交给审核人员?" okText="确认" cancelText="取消">
              </Popconfirm>
            */}
            <Button onClick={this.handleShowAddTeamUserModal}>提交</Button>
            {/*
              <Button onClick={this.handleSave}>保存</Button>
            */}
          </div>
        </div>
        <TaskChat taskId={query._id} />
        <Modal
          title="选择审核人员"
          visible={modalVisible}
          onOk={this.handleSpecify}
          onCancel={() => this.handleModalVisible(false)}
        >
          <FormItem
              label="审核人员"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
            >
              {getFieldDecorator('phone', {
                initialValue: '',
                rules: [{ required: true, message: '请选择审核人员！' }],
              })(
                <Select
                  style={{ width: '100%' }}
                  mode="combobox"
                  optionLabelProp="children"
                  placeholder="搜索电话指定审核人员"
                  notFoundContent=""
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  onSearch={this.onSearch}
                  onSelect={this.onSelect}
                >
                  {suggestionUsers.map(item => <Option value={item._id} key={item.phone}>{item.name}</Option>)}
                </Select>
              )}
            </FormItem>
        </Modal>
      </Card>
    );
  }
}
