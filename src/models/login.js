import { accountLogout, getSmsCode } from '../services/api';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    msg: '',
  },

  effects: {
    *logout({ payload, callback }, { call, put }) {
      yield call(accountLogout);
      yield put({
        type: 'logoutHandle',
        payload,
      });
      if (callback) {
        callback();
      }
    },
    *getSmsCode({ payload, callback }, { call, put }) {
      const result = yield call(getSmsCode, payload);
      if (callback) callback(result);
    },
  },

  reducers: {
    logoutHandle(state, { payload }) {
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
