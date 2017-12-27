import { queryAlimamaOrders } from '../services/tool';

export default {
  namespace: 'tool',

  state: {
    alimamaOrders: {
      list: [],
      pagination: {},
    },
    alimamaOrdersloading: true,
  },

  effects: {
    *fetchAlimamaOrders({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryAlimamaOrders, payload);
      if (!response.error) {
        yield put({
          type: 'saveAlimamaOrders',
          payload: response,
        });
      }
      yield put({
        type: 'changeAlimamaOrdersLoading',
        payload: false,
      });
    },
  },

  reducers: {
    saveAlimamaOrders(state, action) {
      return {
        ...state,
        alimamaOrders: action.payload,
      };
    },
    changeAlimamaOrdersLoading(state, action) {
      return {
        ...state,
        alimamaOrdersloading: action.payload,
      };
    },
  },
};
