import { queryProjects, addProject, updateProject, removeProject } from '../services/project';

export default {
  namespace: 'project',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    loading: true,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryProjects, payload);
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
      yield call(addProject, payload);
      const response = yield call(queryProjects, {team_id: payload.team_id});
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
      yield call(updateProject, payload);
      const response = yield call(queryProjects, {team_id: payload.team_id});
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
      yield call(removeProject, payload);
      const response = yield call(queryProjects, {team_id: payload.team_id});
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
  },
};
