import { queryAlimamaOrders, queryAlimamaShopOrders } from '../services/tool';

export default {
  namespace: 'tool',

  state: {
    alimamaOrders: {
      list: [],
      pagination: {},
    },
    alimamaOrdersloading: true,
    alimamaShopOrders: {
      list: [],
      pagination: {},
    },
    alimamaShopOrdersloading: true,
  },

  effects: {
    *fetchAlimamaOrders({ payload }, { call, put }) {
      yield put({
        type: 'changeAlimamaOrdersLoading',
        payload: true,
      });
      const response = yield call(queryAlimamaOrders, payload);
      console.log(response)
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
    *fetchAlimamaShopOrders({ payload }, { call, put }) {
      yield put({
        type: 'changeAlimamaShopOrdersLoading',
        payload: true,
      });
      const response = yield call(queryAlimamaOrders, payload);
      if (!response.error) {
        yield put({
          type: 'saveAlimamaShopOrders',
          payload: response,
        });
      }
      yield put({
        type: 'changeAlimamaShopOrdersLoading',
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
    saveAlimamaShopOrders(state, action) {
      return {
        ...state,
        alimamaShopOrders: action.payload,
      };
    },
    changeAlimamaShopOrdersLoading(state, action) {
      return {
        ...state,
        alimamaShopOrdersloading: action.payload,
      };
    },
  },
};
