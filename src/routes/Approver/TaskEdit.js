import React, { PureComponent } from 'react';
import { connect } from 'dva';
import querystring from 'querystring';
import { Card } from 'antd';
import Editor from '../../components/Editor';

// import styles from './Project.less';

@connect(state => ({
  formData: state.task.formData,
}))

export default class ProjectForm extends PureComponent {
  state = {

  }
  componentDidMount() {
    const query = querystring.parse(this.props.location.search.substr(1));
    this.props.dispatch({
      type: 'task/fetchTask',
      payload: query,
    });
  }

  handleSubmit = () => {
    
  }
  render() {
    // const { formData } = this.props;
    return (
      <Card bordered={false} title="">
        <Editor style={{ width: '60%' }}/>
      </Card>
    );
  }
}
