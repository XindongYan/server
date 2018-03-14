import React, { PureComponent } from 'react';
import styles from './PageHeaderLayout.less';

export default class PageHeaderLayout extends PureComponent {
  state = {
    y: document.body.clientHeight - 210,
  }
  componentDidMount() {
    document.body.onresize = () => {
      this.setState({ y: document.body.clientHeight - 210 });
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ y: document.body.clientHeight - 210 });
  }
  render() {
    const { children, wrapperClassName, top, ...restProps } = this.props
    return (
      <div style={{ margin: '-24px -24px 0' }} className={wrapperClassName}>
        {top}
        {children ? <div className={styles.content}>{children}</div> : null}
      </div>
    );
  }
}