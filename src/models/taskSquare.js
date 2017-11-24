import { fakeRegister } from '../services/api';

export default {
  namespace: 'register',

  state: {
    status: undefined,
    msg: '',
  },

  effects: {
    *submit({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(fakeRegister, payload);
      console.log(response);
      let status = '';
      if (!response.error) {
        status = 'ok';
      } else {
        status = 'error';
      }
      yield put({
        type: 'registerHandle',
        payload: { status, msg: response.msg },
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
        status: payload.status,
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
