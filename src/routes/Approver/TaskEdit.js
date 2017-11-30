import React, { PureComponent } from 'react';
import { connect } from 'dva';
import querystring from 'querystring';
import { Card, Button, message, Popover, Slider, Popconfirm } from 'antd';
import { RIGHTS, APPROVE_ROLES, ROLES, TASK_APPROVE_STATUS } from '../../constants';
import Editor from '../../components/Editor';
import TaskChat from '../../components/TaskChat';
import styles from './TableList.less';
import WeitaoForm from '../../components/Forms/WeitaoForm';
import Annotation from '../../components/Annotation';

// import styles from './Project.less';

@connect(state => ({
  formData: state.task.formData,
  currentUser: state.user.currentUser,
}))

export default class TaskEdit extends PureComponent {
  state = {
    task: {
      title: '',
      task_desc: '',
      cover_img: '',
    },
    grade: 0,
    grades: [
      {name: '标题', value: 0},
      {name: '正文', value: 0},
      {name: '图片', value: 0},
    ],
    approve_status: 0,
    approve_notes: [],
  }
  componentDidMount() {
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch({
      type: 'task/fetchTask',
      payload: query,
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      task: {
        title: nextProps.formData.title,
        task_desc: nextProps.formData.task_desc,
        cover_img: nextProps.formData.cover_img,
      }
    });
  }
  changeGrades = (index, value) => {
    const { grades } = this.state;
    const newGrades = [...this.state.grades];
    newGrades.splice(index, 1, {...this.state.grades[index], value: value});
    const title_grade = newGrades[0].value;
    const desc_grade = newGrades[1].value;
    const img_grade = newGrades[2].value;
    const grade = (title_grade * 0.3 + desc_grade * 0.4 + img_grade * 0.3).toFixed(1);
    this.setState({
      grade: grade,
      grades: newGrades,
    })
  }
  changeApproveNode = (commentContent) => {
    this.setState({
      approve_notes: [...commentContent],
    })
  }
  handleChange = (task) => {
    this.setState({ task: { ...this.state.task, ...task } });
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
  handleSubmit = (status) => {
    const query = querystring.parse(this.props.location.search.substr(1));
    const { grade, grades, approve_status, approve_notes } = this.state;
    this.props.dispatch({
      type: 'task/update',
      payload: { ...this.state.task, _id: query._id },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          this.props.dispatch({
            type: 'task/approve',
            payload: {
              _id: query._id,
              grade: grade,
              grades: grades,
              approve_status: status || approve_status,
              approver_id: this.props.currentUser._id,
              approve_notes: approve_notes,
            },
            callback: (result1) => {
              if (result1.error) {
                message.error(result1.msg);
              } else {
                message.success(result1.msg);
              }
            }
          });
        }
      }
    });
  }

  render() {
    const { formData } = this.props;
    const { grades, approve_notes } = this.state;
    // const operation = formData.approve_step === 0 ? 'edit' : 'view';
    const operation = 'edit';
    const content = (
      <div style={{width: 360}}>
        {grades.map((item, index) => 
          <div style={{padding: '10px 0'}} key={index}>
            <span style={{margin: '0 15px'}}>{item.name}</span>
            <Slider
              style={{width: '80%', display: 'inline-block', margin: 0}}
              value={item.value}
              max={10}
              step={0.1}
              onChange={(value) => this.changeGrades(index, value)}
            />
          </div>)
        }
      </div>
    );
    // const taskOuterBoxHeight = $(this.refs.taskOuterBox).outerHeight() || 0;
    return (
      <Card bordered={false} title="" style={{ background: 'none' }} bodyStyle={{ padding: 0 }}>
        <div className={styles.taskOuterBox} ref="taskOuterBox">
          <WeitaoForm operation={operation} style={{ width: 650 }} formData={this.state.task} onChange={this.handleChange}/>
          <div className={styles.taskComment} >
            <Annotation
              approve_step={formData.approve_step}
              viewStatus="edit"
              value={approve_notes}
              changeApproveNode={this.changeApproveNode}
            />
          </div>
          <div className={styles.submitBox}>
            <Popconfirm placement="top" title="确认提交？" onConfirm={() => this.handleSubmit(TASK_APPROVE_STATUS.rejected)}>
              <Popover content={content} title="评分" trigger="hover">
                <Button>不通过</Button>
              </Popover>
            </Popconfirm>
            <Popconfirm placement="top" title="确认提交？" onConfirm={() => this.handleSubmit(TASK_APPROVE_STATUS.passed)}>  
              <Popover content={content} title="评分" trigger="hover">
                <Button>通过</Button>
              </Popover>
            </Popconfirm>
            <Button onClick={this.handleSave}>保存</Button>
          </div>
        </div>
      </Card>
    );
  }
}
