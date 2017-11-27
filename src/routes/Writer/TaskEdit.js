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
    // const { form: { getFieldDecorator, getFieldValue }, teamUser, formData } = this.props;
    // const flow = APPROVE_FLOWS.find(item => item.value === getFieldValue('approve_flow'));
    // this.props.form.validateFields((err, values) => {
    //   if (!err) {
    //     const approvers = (flow ? flow.texts : [] ).map(item => values[`approvers${item}`])
    //     const payload = {
    //       team_id: teamUser.team_id,
    //       user_id: teamUser.user_id,
    //       ...values,
    //       attachments: values.attachments ? values.attachments.filter(item => !item.error).map(item => {
    //         if (!item.error) {
    //           return {
    //             name: item.name,
    //             url: item.url || `${QINIU_DOMAIN}/${item.response.key}`,
    //             uid: item.uid,
    //           };
    //         }
    //       }) : [],
    //       approvers,
    //     };
    //     if (this.props.operation === 'edit') {
    //       this.props.dispatch({
    //         type: 'project/update',
    //         payload: {
    //           ...payload,
    //           _id: formData._id,
    //         },
    //       });
    //     } else if (this.props.operation === 'create') {
    //       this.props.dispatch({
    //         type: 'project/add',
    //         payload,
    //       });
    //     }
    //     this.props.dispatch(routerRedux.push('/list/project-list'));
    //   }
    // });
  }
  render() {
    // const { formData } = this.props;
    return (
      <Card bordered={false} title="">
        <Editor />
      </Card>
    );
  }
}
