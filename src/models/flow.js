import { queryFlows, addFlow, updateFlow, removeFlow, queryApproveRoles, addApproveRole } from '../services/flow';

export default {
  namespace: 'flow',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    loading: true,
    approveRoles: [],
    approveRolesLoading: true,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryFlows, payload);
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
    *add({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield call(addFlow, payload);
      const response = yield call(queryFlows, {team_id: payload.team_id});
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
    *update({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield call(updateFlow, payload);
      const response = yield call(queryFlows, {team_id: payload.team_id});
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
    *remove({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield call(removeFlow, payload);
      const response = yield call(queryFlows, {team_id: payload.team_id});
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
    *fetchApproveRoles({ payload }, { call, put }) {
      yield put({
        type: 'changeApproveRolesLoading',
        payload: true,
      });
      const response = yield call(queryApproveRoles, payload);
      if (!response.error) {
        yield put({
          type: 'saveApproveRoles',
          payload: response.roles,
        });
      }
      yield put({
        type: 'changeApproveRolesLoading',
        payload: false,
      });
    },
    *addApproveRole({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeApproveRolesLoading',
        payload: true,
      });
      yield call(addApproveRole, payload);
      const response = yield call(queryApproveRoles, {team_id: payload.team_id});
      yield put({
        type: 'saveApproveRoles',
        payload: response.roles,
      });
      yield put({
        type: 'changeApproveRolesLoading',
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
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    saveApproveRoles(state, action) {
      return {
        ...state,
        approveRoles: action.payload,
      };
    },
    changeApproveRolesLoading(state, action) {
      return {
        ...state,
        approveRolesLoading: action.payload,
      };
    },
  },
};
