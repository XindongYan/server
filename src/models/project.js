import { queryProjects, addProject, updateProject, removeProject, queryProject, publishProject } from '../services/project';

export default {
  namespace: 'project',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    loading: true,
    formData: {},
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
    *publish({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const publishResult = yield call(publishProject, payload);
      const response = yield call(queryProjects, {team_id: payload.team_id});
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback(publishResult);
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
    *fetchProject({ payload }, { call, put }) {
      const response = yield call(queryProject, payload);
      if (!response.error) {
        yield put({
          type: 'saveProject',
          payload: response.project,
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
        formData: {},
      };
    },
    saveProject(state, action) {
      return {
        ...state,
        formData: action.payload,
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
