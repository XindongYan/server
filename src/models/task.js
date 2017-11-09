import { queryTasks, removeRule, updateUser } from '../services/api';

export default {
  namespace: 'task',

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
      const response = yield call(queryTasks, payload);
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
    *update({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield call(updateUser, payload);
      const response = yield call(queryTasks, {});
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
