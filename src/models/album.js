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
    cropperModal: {
      visible: false,
      src: '',
      width: 1,
      height: 1,
      picHeight: 1,
      picWidth: 1,
      cropperKey: '',
    },
    auctionImageModal: {
      visible: false,
    },
    cutpicModal: {
      visible: false,
      cutpicKey: '',
      src: '',
    }
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
        payload: { visible: false },
      });
    },
    *showCropper({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeCropperVisible',
        payload: { visible: true, ...payload },
      });
    },
    *hideCropper({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeCropperVisible',
        payload: { visible: false, src: '' },
      });
    },
    *showAuctionImage({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeAuctionImageModal',
        payload: { visible: true, ...payload },
      });
    },
    *hideAuctionImage({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeAuctionImageModal',
        payload: { visible: false, ...payload },
      });
    },
    *showCutpic({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeCutpicModal',
        payload: { visible: true, ...payload },
      });
    },
    *hideCutpic({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeCutpicModal',
        payload: { visible: false, ...payload },
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
        ...action.payload,
      };
    },
    changeCropperVisible(state, action) {
      return {
        ...state,
        cropperModal: {
          ...state.cropperModal,
          ...action.payload,
        },
      };
    },
    changeAuctionImageModal(state, action) {
      return {
        ...state,
        auctionImageModal: {
          ...state.auctionImageModal,
          ...action.payload,
        },
      };
    },
    changeCutpicModal(state, action) {
      return {
        ...state,
        cutpicModal: {
          ...state.cutpicModal,
          ...action.payload,
        },
      };
    },
  },
};
