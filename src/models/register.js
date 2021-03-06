import { fakeRegister, oldRegister } from '../services/api';

export default {
  namespace: 'register',

  state: {
    error: false,
    msg: '',
    submitting: false,
  },

  effects: {
    *submit({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(fakeRegister, payload);
      if (callback) callback(response);
      yield put({
        type: 'registerHandle',
        payload: { error: response.error, msg: response.msg },
      });
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
    },
    *oldSubmit({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(oldRegister, payload);
      if (callback) callback(response);
      yield put({
        type: 'registerHandle',
        payload: { msg: response.msg },
      });
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      return {
        ...state,
        msg: payload.msg,
        error: payload.error,
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
  },
};
