import { queryPhotos } from '../services/album';

export default {
  namespace: 'album',

  state: {
    list: [],
    loading: true,
    visible: true,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryPhotos, payload);
      yield put({
        type: 'save',
        payload: response.photos,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *show({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeVisible',
        payload: true,
      });
    },
    *hide(_, { call, put }) {
      yield put({
        type: 'changeVisible',
        payload: false,
      });
    },

  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    changeVisible(state, action) {
      return {
        ...state,
        visible: action.payload,
      };
    },
  },
};
