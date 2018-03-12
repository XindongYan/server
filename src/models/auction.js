import { queryChannels } from '../services/auction';
export default {
  namespace: 'auction',
  state: {
    data: {
      list: [],
      pagination: {
        pageSize: 20,
        current: 1,
      },
    },
    loading: true,
    visible: false,
    currentKey: '',
    bbuModal: {
      visible: false,
      currentKey: '',
    },
    shopList: {
      visible: false,
      currentKey: '',
    },
    taskChannel: [],
  },

  effects: {
    *show({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeVisible',
        payload: { visible: true, currentKey: payload.currentKey },
      });
    },
    *hide(_, { call, put }) {
      yield put({
        type: 'changeVisible',
        payload: { visible: false },
      });
    },
    *showBbu({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeBbuVisible',
        payload: { visible: true, currentKey: payload.currentKey },
      });
    },
    *hideBbu(_, { call, put }) {
      yield put({
        type: 'changeBbuVisible',
        payload: { visible: false },
      });
    },
    *showShopList({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeShopListVisible',
        payload: { visible: true, currentKey: payload.currentKey },
      });
    },
    *hideShopList(_, { call, put }) {
      yield put({
        type: 'changeShopListVisible',
        payload: { visible: false },
      });
    },
    *fetchChannel({ payload, callback }, { call, put }) {
      const response = yield call(queryChannels);
      yield put({
        type: 'changeTaskChannel',
        payload: response,
      });
    },
  },

  reducers: {
    changeVisible(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    changeBbuVisible(state, action) {
      return {
        ...state,
        bbuModal: { ...state.bbuModal, ...action.payload, },
      };
    },
    changeShopListVisible(state, action) {
      return {
        ...state,
        shopList: { ...state.shopList, ...action.payload, },
      };
    },
    changeTaskChannel(state, action) {
      return {
        ...state,
        taskChannel: [ ...state.taskChannel, ...action.payload ],
      };
    },
  },
};
