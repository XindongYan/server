import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Icon, Avatar, Dropdown, Tag, message, Spin, Modal } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Link, routerRedux, Route, Redirect, Switch } from 'dva/router';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import styles from './BasicLayout.less';
import HeaderSearch from '../components/HeaderSearch';
import NoticeIcon from '../components/NoticeIcon';
import GlobalFooter from '../components/GlobalFooter';
import ProjectEdit from '../routes/Project/ProjectEdit';
import TaskCreateList from '../routes/TaskCreate/TableList';
import TaskCreate from '../routes/TaskCreate/TaskCreate';
import TaskEdit from '../routes/TaskCreate/TaskEdit';
import TaskView from '../routes/TaskCreate/TaskView';
import TaskSquareTaskList from '../routes/TaskSquare/TaskList';
import SubmissionDetails from '../routes/TaskSquare/SubmissionDetails';
import WriterTaskEdit from '../routes/Writer/TaskEdit';
import WriterTaskView from '../routes/Writer/TaskView';
import WriterTaskCreate from '../routes/Writer/TaskCreate';
import TaskChannel from '../routes/Writer/TaskChannel';
import WriterTaskSuccess from '../routes/Result/Success';

import ApproverTaskEdit from '../routes/Approver/TaskEdit';
import ApproverTaskView from '../routes/Approver/TaskView';
import { getNavData } from '../common/nav';
import { getRouteData } from '../utils/utils';
import { RIGHT } from '../constants';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  }
  constructor(props) {
    super(props);
    // 把一级 Layout 的 children 作为菜单项
    this.menus = getNavData(props.currentUser).reduce((arr, current) => arr.concat(current.children), []);
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
    };
  }
  getChildContext() {
    const { location, currentUser } = this.props;
    const routeData = getRouteData('BasicLayout');
    const menuData = getNavData(currentUser).reduce((arr, current) => arr.concat(current.children), []);
    const breadcrumbNameMap = {};
    routeData.concat(menuData).forEach((item) => {
      breadcrumbNameMap[item.path] = item.name;
    });
    return { location, breadcrumbNameMap };
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'user/fetchCurrent',
      callback: (result) => {
        if (!result.user.phone) {
          this.props.dispatch(routerRedux.push('/user/register'));
        }
      },
    });
    const key = this.props.location.pathname.split('/') ? this.props.location.pathname.split('/')[2] : '';
    this.props.dispatch({
      type: 'global/changeSelectedKeys',
      payload: [key],
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser.error) {
      this.props.dispatch(routerRedux.push('/user/login'));
    }
    const menuData = getNavData(nextProps.currentUser).reduce((arr, current) => arr.concat(current.children), []);
    // this.setState({ menus: menuData });
    this.menus = menuData;
  }
  componentWillUnmount() {
    clearTimeout(this.resizeTimeout);
  }
  onCollapse = (collapsed) => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  }
  onMenuClick = ({ key }) => {
    const { dispatch, teamUser, team } = this.props;
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
        payload: {
          status: false,
        },
        callback: () => {
          this.props.dispatch(routerRedux.push('/user/login'));
        },
      });
    } else if (key === 'leaveTeam') {
      Modal.confirm({
        title: '退出团队',
        content: `确定退出当前所在团队 ${team.name}`,
        onOk() {
          dispatch({
            type: 'team/remove',
            payload: {
              _id: teamUser._id,
              callback: () => {
                message.success('退出成功');
                dispatch({
                  type: 'user/fetchCurrent',
                });
              },
            },
          });
        },
        onCancel() {},
      });
    } else if (key === 'setting') {
      this.props.dispatch(routerRedux.push('/setting/userInfo'));
    }
  }
  getDefaultCollapsedSubMenus(props) {
    const currentMenuSelectedKeys = [...this.getCurrentMenuSelectedKeys(props)];
    currentMenuSelectedKeys.splice(-1, 1);
    if (currentMenuSelectedKeys.length === 0) {
      return ['home'];
    }
    return currentMenuSelectedKeys;
  }
  getCurrentMenuSelectedKeys(props) {
    const { location: { pathname } } = props || this.props;
    const keys = pathname.split('/').slice(1);
    if (keys.length === 1 && keys[0] === '') {
      return [this.menus[0].key];
    }
    return keys;
  }
  getNavMenuItems(menusData, parentPath = '') {
    if (!menusData) {
      return [];
    }
    return menusData.map((item) => {
      if (!item.name) {
        return null;
      }
      let itemPath;
      if (item.path.indexOf('http') === 0) {
        itemPath = item.path;
      } else {
        itemPath = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
      }
      if (item.children && item.children.some(child => child.name)) {
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  <Icon type={item.icon} />
                  <span>{item.name}</span>
                </span>
              ) : item.name
            }
            key={item.key || item.path}
          >
            {this.getNavMenuItems(item.children, itemPath)}
          </SubMenu>
        );
      }
      const icon = item.icon && <Icon type={item.icon} />;
      return (
        <Menu.Item key={item.key || item.path}>
          {
            /^https?:\/\//.test(itemPath) ? (
              <a href={itemPath} target={item.target}>
                {icon}<span>{item.name}</span>
              </a>
            ) : (
              <Link to={itemPath} target={item.target}>
                {icon}<span>{item.name}</span>
              </Link>
            )
          }
        </Menu.Item>
      );
    });
  }
  getPageTitle() {
    const { location } = this.props;
    const { pathname } = location;
    let title = '尼采';
    getRouteData('BasicLayout').forEach((item) => {
      if (item.path === pathname) {
        title = `${item.name} - 尼采`;
      }
    });
    return title;
  }
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map((notice) => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = ({
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        })[newNotice.status];
        newNotice.extra = <Tag color={color} style={{ marginRight: 0 }}>{newNotice.extra}</Tag>;
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }
  handleOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    this.setState({
      openKeys: latestOpenKey ? [latestOpenKey] : [],
    });
  }
  handleSelect = (e) => {
    this.props.dispatch({
      type: 'global/changeSelectedKeys',
      payload: [e.key],
    });
    window.scrollTo(0, 0);
  }
  toggle = () => {
    const { collapsed } = this.props;
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: !collapsed,
    });
    this.resizeTimeout = setTimeout(() => {
      const event = document.createEvent('HTMLEvents');
      event.initEvent('resize', true, false);
      window.dispatchEvent(event);
    }, 600);
  }
  handleNoticeClear = (type) => {
    message.success(`清空了${type}`);
    this.props.dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  }
  handleNoticeVisibleChange = (visible) => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchNotices',
      });
    }
  }
  render() {
    const { currentUser, collapsed, fetchingNotices, teamUser, selectedKeys } = this.props;

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="setting"><Icon type="user" />个人中心</Menu.Item>
        <Menu.Divider />
        { /* teamUser && <Menu.Item key="leaveTeam"><Icon type="user-delete" />退出团队</Menu.Item> */ }
        <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
      </Menu>
    );
    const bbs = (
      <Menu className={styles.bbsMenu} selectedKeys={[]}>
        <Menu.Item><a target="_blank" href="https://daren.bbs.taobao.com/list.html">达人论坛</a></Menu.Item>
        <Menu.Item><a target="_blank" href="https://live.bbs.taobao.com/list.html">直播论坛</a></Menu.Item>
        <Menu.Item><a target="_blank" href="https://video.bbs.taobao.com/list.html">短视频论坛</a></Menu.Item>
        <Menu.Item><a target="_blank" href="https://headline.bbs.taobao.com/list.html">头条论坛</a></Menu.Item>
        <Menu.Item><a target="_blank" href="https://guang.bbs.taobao.com/list.html">爱逛街论坛</a></Menu.Item>
        <Menu.Item><a target="_blank" href="https://ifashion.bbs.taobao.com/list.html">ifashion论坛</a></Menu.Item>
        <Menu.Item><a target="_blank" href="https://weitao.bbs.taobao.com/list.html">微淘论坛</a></Menu.Item>
        <Menu.Item><a target="_blank" href="https://yingxiao.bbs.taobao.com/list.html">营销论坛</a></Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();

    // Don't show popup menu when it is been collapsed
    const menuProps = collapsed ? {} : {
      openKeys: this.state.openKeys,
      selectedKeys: [...selectedKeys],
    };
    const layout = (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="md"
          onCollapse={this.onCollapse}
          width={200}
          className={styles.sider}
        >
          <div className={styles.logo}>
            <Link to="/list/task-square">
              { /* <img src="" alt="logo" /> */ }
              <h1 style={{ width: 200, height: 32, lineHeight: '32px', display: 'block', marginTop: 10, marginLeft: 0 }}>{ collapsed ? '尼采' : '尼采创作平台'}</h1>
              { !collapsed &&
                <h4 style={{ height: 20, lineHeight: '20px', fontSize: 12, color: '#999', wordWrap: 'break-word' }}>让天下没有埋没的文采</h4>
              }
            </Link>
          </div>
          <Menu
            theme="light"
            mode="inline"
            {...menuProps}
            onOpenChange={this.handleOpenChange}
            onClick={this.handleSelect}
            style={{ margin: '16px 0', width: '100%' }}
          >
            {this.getNavMenuItems(this.menus)}
          </Menu>
        </Sider>
        <Layout>
          <Header className={styles.header}>
            <Icon
              className={styles.trigger}
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <div className={styles.daren}>
              <Link target='_blank' to="/taobao_daren/list">
                <Icon type="area-chart" /> <span style={{ fontSize: 14 }}>综合榜单</span>
              </Link>
            </div>
            <div className={styles.daren}>
              <Link target='_blank' to="/taobao_daren/live/list">
                <Icon type="area-chart" /> <span style={{ fontSize: 14 }}>直播榜单</span>
              </Link>
            </div>
            <div className={styles.daren}>
              <Dropdown overlay={bbs}>
                <span className={styles.bbsLink}>
                  <Icon type="link" /> <span style={{ fontSize: 14 }}>论坛链接</span>
                </span>
              </Dropdown>
            </div>
            <div className={styles.right}>
              { /* <HeaderSearch
                className={`${styles.action} ${styles.search}`}
                placeholder="站内搜索"
                dataSource={['搜索提示一', '搜索提示二', '搜索提示三']}
                onSearch={(value) => {
                  console.log('input', value); // eslint-disable-line
                }}
                onPressEnter={(value) => {
                  console.log('enter', value); // eslint-disable-line
                }}
              /> */ }
              { /* <NoticeIcon
                className={styles.action}
                count={currentUser.notifyCount}
                onItemClick={(item, tabProps) => {
                  console.log(item, tabProps); // eslint-disable-line
                }}
                onClear={this.handleNoticeClear}
                onPopupVisibleChange={this.handleNoticeVisibleChange}
                loading={fetchingNotices}
                popupAlign={{ offset: [20, -16] }}
              >
                <NoticeIcon.Tab
                  list={noticeData['通知']}
                  title="通知"
                  emptyText="你已查看所有通知"
                  emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
                />
                <NoticeIcon.Tab
                  list={noticeData['消息']}
                  title="消息"
                  emptyText="您已读完所有消息"
                  emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
                />
                <NoticeIcon.Tab
                  list={noticeData['待办']}
                  title="待办"
                  emptyText="你已完成所有待办"
                  emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
                />
              </NoticeIcon> */ }
              {currentUser.nickname ? (
                <Dropdown overlay={menu}>
                  <span className={`${styles.action} ${styles.account}`}>
                    <Avatar size="small" className={styles.avatar} src={currentUser.avatar} />
                    {currentUser.nickname}
                  </span>
                </Dropdown>
              ) : <Spin size="small" style={{ marginLeft: 8 }} />}
            </div>
          </Header>
          <Content style={{ margin: '15px 12px 0', height: '100%' }}>
            <Switch>
              {
                getRouteData('BasicLayout').map(item =>
                  (
                    <Route
                      exact={item.exact}
                      key={item.path}
                      path={item.path}
                      component={item.component}
                    />
                  )
                )
              }
              <Route path="/project/edit" component={ProjectEdit} />
              <Route path="/project/task/list" component={TaskCreateList} />
              <Route path="/project/task/create" component={TaskCreate} />
              <Route path="/project/task/view" component={TaskView} />
              <Route path="/project/task/edit" component={TaskEdit} />
              <Route path="/taskSquare/task/list" component={TaskSquareTaskList} />
              <Route path="/taskSquare/submission/details" component={SubmissionDetails} />
              <Route path="/writer/task/edit" component={WriterTaskEdit} />
              <Route path="/writer/task/view" component={WriterTaskView} />
              <Route path="/writer/task/create" component={WriterTaskCreate} />
              <Route path="/writer/task/channel" component={TaskChannel} />
              <Route path="/writer/task/handin/success" component={WriterTaskSuccess} />
              <Route path="/approver/task/edit" component={ApproverTaskEdit} />
              <Route path="/approver/task/view" component={ApproverTaskView} />
              <Redirect to="/home" />
            </Switch>
            <GlobalFooter
              links={[{
                title: '',
                href: '',
                blankTarget: true,
              }]}
              copyright={
                <div>
                  Copyright <Icon type="copyright" /> 2017 尼采
                </div>
              }
            />
          </Content>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(state => ({
  currentUser: state.user.currentUser,
  collapsed: state.global.collapsed,
  fetchingNotices: state.global.fetchingNotices,
  notices: state.global.notices,
  team: state.user.team,
  teamUser: state.user.teamUser,
  selectedKeys: state.global.selectedKeys,
}))(BasicLayout);
