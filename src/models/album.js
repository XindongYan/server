import { queryPhotos, addPhoto, removePhoto } from '../services/album';

export default {
  namespace: 'album',

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
    previewImgList: [],
    choosen: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryPhotos, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addPhoto, payload);
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removePhoto, payload);
      if (callback) callback(response);
    },
    *show({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeVisible',
        payload: { visible: true, currentKey: payload.currentKey },
      });
    },
    *hide(_, { call, put }) {
      yield put({
        type: 'changeVisible',
        payload: { visible: false, currentKey: '' },
      });
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
    changeVisible(state, action) {
      return {
        ...state,
        visible: action.payload.visible,
        currentKey: action.payload.currentKey,
      };
    },
    changePreview(state, action) {
      return {
        ...state,
        previewImgList: action.payload.previewImgList,
      };
    },
  },
};
