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
  },

  reducers: {
    changeVisible(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
