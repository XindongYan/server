import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import Input from './Input';

@connect(state => ({

}))

export default class FormParts extends PureComponent {
  state = {

  }
  componentDidMount() {

  }
  componentWillUnmount() {

  }
  render() {
    // const { data } = this.props;
    return (
      <div>
        <Input
          form={this.props.form}
          // data={data}
        />
      </div>
    );
  }
}
