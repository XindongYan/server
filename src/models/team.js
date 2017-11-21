import { queryTeamUsers, updateUser, queryTeamUsersByPhone, createTeamUser, removeTeamUser } from '../services/team';

export default {
  namespace: 'team',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    loading: true,
    suggestionUsers: [],
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
      yield call(createTeamUser, payload);
      const response = yield call(queryTeamUsers, {team_id: payload.team_id});
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
      const response = yield call(queryTeamUsers, {team_id: payload.team_id});
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
      yield call(removeTeamUser, payload);
      const response = yield call(queryTeamUsers, {team_id: payload.team_id});
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
    *toggleTeamUsersModal({ payload }, { call, put }) {
      yield put({
        type: 'changeTeamUsersModalVisible',
        payload,
      });
    },
    *fetchUsersByPhone({ payload }, { call, put }) {
      const response = yield call(queryTeamUsersByPhone, payload);
      yield put({
        type: 'saveSuggestionUsers',
        payload: response.users,
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
    changeTeamUsersModalVisible(state, action) {
      return {
        ...state,
        teamUsersModalVisible: action.payload,
      };
    },
    saveSuggestionUsers(state, action) {
      return {
        ...state,
        suggestionUsers: action.payload || [],
      };
    }
  },
};
