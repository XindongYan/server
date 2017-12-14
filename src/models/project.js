import { queryProjects, addProject, updateProject, removeProject, queryProject, publishProject, offshelfProject,
publishTasks } from '../services/project';

export default {
  namespace: 'project',

  state: {
    data: {
      list: [],
      pagination: {},
      status: 1,
      type: 1,
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
          payload: { ...response, status: payload.status, type: payload.type },
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const result = yield call(addProject, payload);
      if (callback) callback(result);
    },
    *update({ payload, callback }, { call, put }) {
      const result = yield call(updateProject, payload);
      if (callback) callback(result);
    },
    *publish({ payload, callback }, { call, put }) {
      const result = yield call(publishProject, payload);
      if (callback) callback(result);
    },
    *offshelf({ payload, callback }, { call, put }) {
      const result = yield call(offshelfProject, payload);
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
