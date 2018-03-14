import { queryStatisticsTask, queryStatisticsChannel } from '../services/statistics';

export default {
  namespace: 'statistics',
  state: {
    statisticsTask: {
      list: [],
      pagination: {},
      totals: {},
    },
    statisticsTaskLoading: true,
    publish_taobao_time_start: null,
    publish_taobao_time_end: null,
    statisticsChannel: {
      list: [],
      pagination: {},
    },
    statisticsChannelLoading: true,
  },

  effects: {
    *fetchStatisticsTask({ payload }, { call, put }) {
      yield put({
        type: 'changeStatisticsTaskLoading',
        payload: true,
      });
      const response = yield call(queryStatisticsTask, payload);
      if (!response.error) {
        yield put({
          type: 'saveStatisticsTask',
          payload: { ...payload, ...response },
        });
      }
      yield put({
        type: 'changeStatisticsTaskLoading',
        payload: false,
      });
    },
    *fetchStatisticsChannel({ payload }, { call, put }) {
      yield put({
        type: 'changeStatisticsChannelLoading',
        payload: true,
      });
      const response = yield call(queryStatisticsChannel, payload);
      if (!response.error) {
        yield put({
          type: 'saveStatisticsChannel',
          payload: { ...payload, ...response },
        });
      }
      yield put({
        type: 'changeStatisticsChannelLoading',
        payload: false,
      });
    },
  },

  reducers: {
    saveTimeRange(state, action) {
      return {
        ...state,
        publish_taobao_time_start: action.payload.publish_taobao_time_start,
        publish_taobao_time_end: action.payload.publish_taobao_time_end,
      };
    },
    saveStatisticsTask(state, action) {
      return {
        ...state,
        statisticsTask: action.payload,
      };
    },
    changeStatisticsTaskLoading(state, action) {
      return {
        ...state,
        statisticsTaskLoading: action.payload,
      };
    },
    saveStatisticsChannel(state, action) {
      return {
        ...state,
        statisticsChannel: action.payload,
      };
    },
    changeStatisticsChannelLoading(state, action) {
      return {
        ...state,
        statisticsChannelLoading: action.payload,
      };
    },
  },
};
