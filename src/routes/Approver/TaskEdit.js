import React, { PureComponent } from 'react';
import { connect } from 'dva';
import querystring from 'querystring';
import { Card, Button, message, Popover, Slider } from 'antd';
import Editor from '../../components/Editor';
import TaskChat from '../../components/TaskChat';
import styles from './TableList.less';
import WeitaoForm from '../../components/Forms/WeitaoForm';
import Annotation from '../../components/Annotation';

// import styles from './Project.less';

@connect(state => ({
  formData: state.task.formData,
}))

export default class TaskEdit extends PureComponent {
  state = {
    task: {
      title: '',
      task_desc: '',
      cover_img: '',
    },
    grades: [
      {name: '标题', value: 0},
      {name: '正文', value: 0},
      {name: '图片', value: 0},
    ]
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
    const newGrades = [...this.state.grades];
    newGrades.splice(index, 1, {...this.state.grades[index], value: value});
    this.setState({
      grades: newGrades
    })
  }
  handleChange = (task) => {
    this.setState({ task: { ...this.state.task, ...task } });
  }
  handleSave = () => {
    console.log(this.state.task);
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
  handleSubmit = () => {
    console.log(this.state.task);
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch({
      type: 'task/update',
      payload: { ...this.state.task, _id: query._id },
      callback: (result) => {
        if (result.error) {
          message.error(result.msg);
        } else {
          this.props.dispatch({
            type: 'task/approve',
            payload: { _id: query._id },
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
    const { grades } = this.state;
    const operation = !formData.approve_step ? 'edit' : 'view';
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
            <Annotation viewStatus="edit" value={[]} />
          </div>
          <div className={styles.submitBox}>
            <Popover content={content} title="评分" trigger="hover">
              <Button onClick={this.handleSubmit}>不通过</Button>
            </Popover>
            <Popover content={content} title="评分" trigger="hover">
              <Button onClick={this.handleSubmit}>通过</Button>
            </Popover>
            <Button onClick={this.handleSave}>保存</Button>
          </div>
        </div>
      </Card>
    );
  }
}
