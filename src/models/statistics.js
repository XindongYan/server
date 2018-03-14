import { queryStatisticsList } from '../services/statistics';

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
  },

  effects: {
    *fetchStatisticsTask({ payload }, { call, put }) {
      yield put({
        type: 'changeStatisticsTaskLoading',
        payload: true,
      });
      const response = yield call(queryStatisticsList, payload);
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
  },
};
