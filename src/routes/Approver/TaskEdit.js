import React, { PureComponent } from 'react';
import { connect } from 'dva';
import querystring from 'querystring';
import { Card, Button, message } from 'antd';
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
  handleChange = (task) => {
    this.setState({ task: { ...this.state.task, ...task } });
  }
  handleSubmit = () => {
    
  }
  render() {
    const { formData } = this.props;
    console.log(formData.approve_step)
    const operation = !formData.approve_step ? 'edit' : 'view';
    // const taskOuterBoxHeight = $(this.refs.taskOuterBox).outerHeight() || 0;
    return (
      <Card bordered={false} title="" style={{ background: 'none' }} bodyStyle={{ padding: 0 }}>
        <div className={styles.taskOuterBox} ref="taskOuterBox">
          <WeitaoForm operation={operation} style={{ width: 650 }} formData={this.state.task} onChange={this.handleChange}/>
          <div className={styles.taskComment} >
            <Annotation viewStatus="edit" value={[]} />
          </div>
          <div className={styles.submitBox}>
            <Button onClick={this.handleSubmit}>提交</Button>
            <Button onClick={this.handleSave}>保存</Button>
          </div>
        </div>
      </Card>
    );
  }
}
