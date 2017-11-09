import { fakeAccountLogin, fakeMobileLogin, accountLogout } from '../services/api';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *accountSubmit({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(fakeAccountLogin, payload);
      let status = '';
      if (!response.error && response.user.rights.indexOf(8) >= 0) {
        status = 'ok';
      }
      yield put({
        type: 'loginHandle',
        payload: {...response, status},
      });
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
    },
    *mobileSubmit(_, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(fakeMobileLogin);
      yield put({
        type: 'loginHandle',
        payload: response,
      });
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
    },
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
  },

  reducers: {
    loginHandle(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
    logoutHandle(state, { payload }) {
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
