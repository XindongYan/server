import { queryTeamUsers, updateUser, searchUsers, createTeamUser, removeTeamUser,
  queryTeamUsersByRole, searchTeamUsers, queryStatisticsList } from '../services/team';

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
    statisticsList: {
      list: [],
      pagination: {},
      publish_taobao_time_end: null,
      publish_taobao_time_start: null,
    },
    statisticsListLoading: true,
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
      const updateResult = yield call(updateUser, payload);
      if (!updateResult.error) {
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
      if (callback) callback(updateResult);
    },
    *remove({ payload, callback }, { call, put }) {
      const result = yield call(removeTeamUser, payload);
      if (callback) callback(result);
    },
    *toggleTeamUsersModal({ payload }, { call, put }) {
      console.log(payload);
      yield put({
        type: 'changeTeamUsersModalVisible',
        payload,
      });
    },
    *searchUsers({ payload, callback }, { call, put }) {
      const response = yield call(searchUsers, payload);
      yield put({
        type: 'saveSuggestionUsers',
        payload: response.list,
      });
      if (callback) callback(response);
    },
    *searchTeamUsers({ payload, callback }, { call, put }) {
      const response = yield call(searchTeamUsers, payload);
      yield put({
        type: 'saveSuggestionUsers',
        payload: response.list,
      });
      if (callback) callback(response);
    },
    *fetchTeamUsers({ payload }, { call, put }) {
      const response = yield call(queryTeamUsersByRole, payload);
      yield put({
        type: 'saveTeamUsersByRole',
        payload: response.teamUsers,
      });
    },
    *fetchStatisticsList({ payload }, { call, put }) {
      yield put({
        type: 'changeStatisticsListLoading',
        payload: true,
      });
      const response = yield call(queryStatisticsList, payload);
      if (!response.error) {
        yield put({
          type: 'saveStatisticsList',
          payload: { ...payload, ...response },
        });
      }
      yield put({
        type: 'changeStatisticsListLoading',
        payload: false,
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
    saveStatisticsList(state, action) {
      return {
        ...state,
        statisticsList: action.payload,
      };
    },
    changeStatisticsListLoading(state, action) {
      return {
        ...state,
        statisticsListLoading: action.payload,
      };
    },
  },
};
