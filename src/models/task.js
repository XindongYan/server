import { queryTask, updateTask, addTask, queryProjectTasks, queryTakerTasks, handinTask, approveTask, rejectTask,
queryApproverTasks } from '../services/task';

export default {
  namespace: 'task',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    loading: true,
    formData: {},
    projectTask: {
      list: [],
      pagination: {},
    },
    projectTaskLoading: true,
    takerTask: {
      list: [],
      pagination: {},
    },
    takerTaskLoading: true,
    approverTask: {
      list: [],
      pagination: {},
    },
    approverTaskLoading: true,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryTask, payload);
      yield put({
        type: 'saveTask',
        payload: response.task || {},
      });
    },
    *fetchTask({ payload }, { call, put }) {
      const response = yield call(queryTask, payload);
      yield put({
        type: 'saveTask',
        payload: response.task || {},
      });
    },
    *add({ payload, callback }, { call }) {
      const result = yield call(addTask, payload);
      if (callback) callback(result);
    },
    *update({ payload, callback }, { call, put }) {
      const result = yield call(updateTask, payload);
      if (callback) callback(result);
      // yield put({
      //   type: 'saveTask',
      //   payload: {},
      // });
    },
    *handin({ payload, callback }, { call, put }) {
      const result = yield call(handinTask, payload);
      if (callback) callback(result);
    },
    *approve({ payload, callback }, { call, put }) {
      const result = yield call(approveTask, payload);
      if (callback) callback(result);
      yield put({
        type: 'saveTask',
        payload: {},
      });
    },
    *reject({ payload, callback }, { call, put }) {
      const result = yield call(rejectTask, payload);
      if (callback) callback(result);
      yield put({
        type: 'saveTask',
        payload: {},
      });
    },
    *fetchProjectTasks({ payload }, { call, put }) {
      yield put({
        type: 'changeProjectTasksLoading',
        payload: true,
      });
      const response = yield call(queryProjectTasks, payload);
      if (!response.error) {
        yield put({
          type: 'saveProjectTasks',
          payload: response,
        });
      }
      yield put({
        type: 'changeProjectTasksLoading',
        payload: false,
      });
    },
    *fetchTakerTasks({ payload }, { call, put }) {
      yield put({
        type: 'changeTakerTasksLoading',
        payload: true,
      });
      const response = yield call(queryTakerTasks, payload);
      if (!response.error) {
        yield put({
          type: 'saveTakerTasks',
          payload: response,
        });
      }
      yield put({
        type: 'changeTakerTasksLoading',
        payload: false,
      });
    },
    *fetchApproverTasks({ payload }, { call, put }) {
      yield put({
        type: 'changeApproverTasksLoading',
        payload: true,
      });
      const response = yield call(queryApproverTasks, payload);
      if (!response.error) {
        yield put({
          type: 'saveApproverTasks',
          payload: response,
        });
      }
      yield put({
        type: 'changeApproverTasksLoading',
        payload: false,
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
    saveTask(state, action) {
      return {
        ...state,
        formData: action.payload,
      };
    },
    saveProjectTasks(state, action) {
      return {
        ...state,
        projectTask: action.payload,
      };
    },
    changeProjectTasksLoading(state, action) {
      return {
        ...state,
        projectTaskLoading: action.payload,
      };
    },
    saveTakerTasks(state, action) {
      return {
        ...state,
        takerTask: action.payload,
      };
    },
    changeTakerTasksLoading(state, action) {
      return {
        ...state,
        takerTaskLoading: action.payload,
      };
    },
    saveApproverTasks(state, action) {
      return {
        ...state,
        approverTask: action.payload,
      };
    },
    changeApproverTasksLoading(state, action) {
      return {
        ...state,
        approverTaskLoading: action.payload,
      };
    },
  },
};
