import { queryProjects, addProject, updateProject, removeProject, queryProject, publishProject, offshelfProject,
publishTasks } from '../services/project';

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
      const result = yield call(addProject, payload);
      if (callback) callback(result);
      const response = yield call(queryProjects, { team_id: payload.team_id });
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *update({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const result = yield call(updateProject, payload);
      if (callback) callback(result);
      const response = yield call(queryProjects, { team_id: payload.team_id });
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *publish({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const result = yield call(publishProject, payload);
      const response = yield call(queryProjects, { team_id: payload.team_id });
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback(result);
    },
    *offshelf({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const result = yield call(offshelfProject, payload);
      const response = yield call(queryProjects, { team_id: payload.team_id });
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback(result);
    },
    *publishTasks({ payload, callback }, { call, put }) {
      const result = yield call(publishTasks, payload);
      if (callback) callback(result);
    },
    *remove({ payload, callback }, { call, put }) {
      const result = yield call(removeProject, payload);
      if (callback) callback(result);
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
