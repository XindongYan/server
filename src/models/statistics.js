import { queryStatisticsList } from '../services/statistics';

export default {
  namespace: 'statistics',
  state: {
    statisticsList: {
      list: [],
      pagination: {},
      totals: {},
    },
    statisticsListLoading: true,
    publish_taobao_time_start: null,
    publish_taobao_time_end: null,
  },

  effects: {
    *fetchStatisticsList({ payload }, { call, put }) {
      yield put({
        type: 'changeStatisticsListLoading',
        payload: true,
      });
      const response = yield call(queryStatisticsList, payload);
      if (!response.error) {
        yield put({
          type: 'saveStatisticsList',
          payload: { ...payload, ...response },
        });
      }
      yield put({
        type: 'changeStatisticsListLoading',
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
    saveStatisticsList(state, action) {
      return {
        ...state,
        statisticsList: action.payload,
      };
    },
    changeStatisticsListLoading(state, action) {
      return {
        ...state,
        statisticsListLoading: action.payload,
      };
    },
  },
};
