import { query as queryUsers, queryCurrent, updateUser, changePassword, changePasswordBySms_code } from '../services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    loading: false,
    currentUser: {},
    teamUser: {},
    team: {},
    projects: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchCurrent({ callback }, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateUser, payload);
      if (callback) callback(response);
    },
    *changePassword({ payload, callback }, { call, put }) {
      const response = yield call(changePassword, payload);
      if (callback) callback(response);
    },
    *changePasswordBySms_code({ payload, callback }, { call, put }) {
      const response = yield call(changePasswordBySms_code, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        ...action.payload,
        currentUser: action.payload.user || action.payload,
        teamUser: action.payload.teamUser || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
