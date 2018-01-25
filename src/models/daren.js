import { queryDarens, queryDarenLives } from '../services/daren';

export default {
  namespace: 'daren',

  state: {
    darens: {
      list: [],
      pagination: {},
      creator_type: '',
      area: '',
      channel: '',
    },
    darensLoading: true,
    darenLives: {
      list: [],
      pagination: {},
      creator_type: '',
      area: '',
      channel: '',
    },
    darenLivesLoading: true,
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
          payload: {...payload, ...response},
        });
      }
      yield put({
        type: 'changeDarensLoading',
        payload: false,
      });
    },
    *fetchDarenLives({ payload }, { call, put }) {
      yield put({
        type: 'changeDarenLivesLoading',
        payload: true,
      });
      const response = yield call(queryDarenLives, payload);
      if (!response.error) {
        yield put({
          type: 'saveDarenLives',
          payload: {...payload, ...response},
        });
      }
      yield put({
        type: 'changeDarenLivesLoading',
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
    saveDarenLives(state, action) {
      return {
        ...state,
        darenLives: action.payload,
      };
    },
    changeDarenLivesLoading(state, action) {
      return {
        ...state,
        darenLivesLoading: action.payload,
      };
    },
  },
};
