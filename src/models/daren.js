import { queryDarens } from '../services/daren';

export default {
  namespace: 'daren',

  state: {
    darens: {
      list: [],
      pagination: {},
    },
    darensLoading: true,
  },

  effects: {
    *fetchDarens({ payload }, { call, put }) {
      yield put({
        type: 'changeDarensLoading',
        payload: true,
      });
      const response = yield call(queryDarens, payload);
      if (!response.error) {
        yield put({
          type: 'saveDarens',
          payload: response,
        });
      }
      yield put({
        type: 'changeDarensLoading',
        payload: false,
      });
    },
  },

  reducers: {
    saveDarens(state, action) {
      return {
        ...state,
        darens: action.payload,
      };
    },
    changeDarensLoading(state, action) {
      return {
        ...state,
        darensLoading: action.payload,
      };
    },
  },
};
