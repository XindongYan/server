import { queryTeamUsers } from '../services/team';

export default {
  namespace: 'team',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    loading: true,
    teamUsers: {
      list: [],
      pagination: {},
    },
    teamUsersLoading: true,
    teamUsersModalVisible: false,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryTeamUsers, payload);
      if (!response.error) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *add({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield call(addTeam, payload);
      const response = yield call(queryTeamUsers, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield call(updateUser, payload);
      const response = yield call(queryTeamUsers, {});
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback();
    },
    *fetchTeamUsers({ payload }, { call, put }) {
      yield put({
        type: 'changeTeamUsersLoading',
        payload: true,
      });
      const response = yield call(queryTeamUsers, payload);
      if (!response.error) {
        yield put({
          type: 'saveTeamUsers',
          payload: response,
        });
      }
      yield put({
        type: 'changeTeamUsersLoading',
        payload: false,
      });
    },
    *toggleTeamUsersModal({ payload }, { call, put }) {
      yield put({
        type: 'changeTeamUsersModalVisible',
        payload,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    saveTeamUsers(state, action) {
      return {
        ...state,
        teamUsers: action.payload,
      };
    },
    changeTeamUsersLoading(state, action) {
      return {
        ...state,
        teamUsersLoading: action.payload,
      };
    },
    changeTeamUsersModalVisible(state, action) {
      return {
        ...state,
        teamUsersModalVisible: action.payload,
      };
    },
  },
};
