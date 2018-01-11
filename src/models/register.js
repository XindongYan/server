import { fakeRegister, oldRegister } from '../services/api';

export default {
  namespace: 'register',

  state: {
    msg: '',
    submitting: false,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(fakeRegister, payload);
      yield put({
        type: 'registerHandle',
        payload: { msg: response.msg },
      });
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
    },
    *oldSubmit({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(oldRegister, payload);
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
