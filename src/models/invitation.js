import { queryInvitationCodes, addInvitationCodes } from '../services/invitation';
import { INVITATION_ROLE } from '../constants';

export default {
  namespace: 'invitation',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    loading: true,
    Invitations: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryInvitationCodes, payload);
      if (!response.error) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchInvitation({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryInvitationCodes, payload);
      if (!response.error) {
        yield put({
          type: 'saveTabChange',
          payload: response,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *add({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield call(addInvitationCodes, payload);
      const response = yield call(queryInvitationCodes, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'saveTabChange',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveTabChange(state, action) {
      return {
        ...state,
        Invitations: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
