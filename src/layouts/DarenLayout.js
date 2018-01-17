import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route, Switch, Redirect } from 'dva/router';
import DocumentTitle from 'react-document-title';
import styles from './DarenLayout.less';
import DarenList from '../routes/Daren/DarenList';

class DarenLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
  }
  getChildContext() {
    const { location } = this.props;
    return { location };
  }
  getPageTitle() {
    const title = '尼采创作平台';
    return title;
  }

  componentDidMount() {
  }
  render() {
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <Switch>
            <Route key="daren" path="/daren/list" component={DarenList} />
            <Redirect to="/daren/list" />
          </Switch>
        </div>
      </DocumentTitle>
    );
  }
}

export default DarenLayout;
