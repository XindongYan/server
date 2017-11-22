import { queryTeamUsers, updateUser, queryTeamUsersByPhone, createTeamUser, removeTeamUser,
  queryTeamUsersByRole } from '../services/team';

export default {
  namespace: 'team',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    loading: true,
    suggestionUsers: [],
    teamUsers: [],
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
      
      const addResult = yield call(createTeamUser, payload);
      if (!addResult.error) {
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryTeamUsers, {team_id: payload.team_id});
        yield put({
          type: 'save',
          payload: response,
        });
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }
      if (callback) callback(addResult);
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
    *fetchTeamUsers({ payload }, { call, put }) {
      const response = yield call(queryTeamUsersByRole, payload);
      yield put({
        type: 'saveTeamUsersByRole',
        payload: response.teamUsers,
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
    },
    saveTeamUsersByRole(state, action) {
      return {
        ...state,
        teamUsers: action.payload || [],
      };
    },
  },
};
