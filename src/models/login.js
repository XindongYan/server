import { fakeAccountLogin, fakeMobileLogin, accountLogout, getSmsCode } from '../services/api';

export default {
  namespace: 'login',

  state: {
    type: 'account',
    status: undefined,
    msg: '',
  },

  effects: {
    *accountSubmit({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(fakeAccountLogin, payload);
      let status = '';
      if (!response.error) {
        status = 'ok';
      } else {
        status = 'error';
      }
      yield put({
        type: 'loginHandle',
        payload: {...response, status, msg: response.msg, type: 'account'},
      });
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
    },
    *mobileSubmit({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(fakeMobileLogin, payload);
      let status = '';
      if (!response.error && response.user.rights.indexOf(8) >= 0) {
        status = 'ok';
      } else {
        status = 'error';
      }
      yield put({
        type: 'loginHandle',
        payload: {...response, status, msg: response.msg, type: 'mobile'},
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
    *getSmsCode({ payload, callback }, { call, put }) {
      yield call(getSmsCode, payload);
    },
  },

  reducers: {
    loginHandle(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        msg: payload.msg,
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
