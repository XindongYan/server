import { getUptoken } from '../services/qiniucloud';

export default {
  namespace: 'qiniucloud',

  state: {
    uptoken: '',
  },

  effects: {
    *fetchUptoken(_, { call, put }) {
      const response = yield call(getUptoken);
      yield put({
        type: 'saveUptoken',
        payload: response,
      });
    },
  },

  reducers: {
    saveUptoken(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
