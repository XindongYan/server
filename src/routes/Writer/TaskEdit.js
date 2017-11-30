import React, { PureComponent } from 'react';
import { connect } from 'dva';
import querystring from 'querystring';
import { Card } from 'antd';
import $ from 'jquery';
import Editor from '../../components/Editor';
import Annotation from '../../components/Annotation';
import WeitaoForm from '../../components/Forms/WeitaoForm';
import styles from './TableList.less';

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
      <Card bordered={false} title="" style={{ background: 'none' }} bodyStyle={{ padding: 0 }}>
        <div className={styles.taskOuterBox} ref="taskOuterBox">
          <WeitaoForm operation="edit" style={{ width: 650 }} />

          <div className={styles.taskComment} >
            <div className={styles.commentTitle}>
              批注
            </div>
            <Annotation style={{height: '100%'}} />
          </div>
        </div>
      </Card>
    );
  }
}
