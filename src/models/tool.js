import { queryAlimamaOrders, queryAlimamaShops } from '../services/tool';

export default {
  namespace: 'tool',

  state: {
    alimamaOrders: {
      list: [],
      pagination: {},
    },
    alimamaOrdersLoading: true,
    alimamaShops: {
      list: [],
      pagination: {},
    },
    alimamaShopsLoading: true,
  },

  effects: {
    *fetchAlimamaOrders({ payload }, { call, put }) {
      yield put({
        type: 'changeAlimamaOrdersLoading',
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
    *fetchAlimamaShops({ payload }, { call, put }) {
      yield put({
        type: 'changeAlimamaShopsLoading',
        payload: true,
      });
      const response = yield call(queryAlimamaShops, payload);
      if (!response.error) {
        yield put({
          type: 'saveAlimamaShops',
          payload: response,
        });
      }
      yield put({
        type: 'changeAlimamaShopsLoading',
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
        alimamaOrdersLoading: action.payload,
      };
    },
    saveAlimamaShops(state, action) {
      return {
        ...state,
        alimamaShops: action.payload,
      };
    },
    changeAlimamaShopsLoading(state, action) {
      return {
        ...state,
        alimamaShopsLoading: action.payload,
      };
    },
  },
};
