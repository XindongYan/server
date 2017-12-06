import { queryTask, updateTask, addTask, publishTask, queryProjectTasks, queryTakerTasks, handinTask, approveTask, rejectTask,
queryApproverTasks, addTaskByWriter, specifyTask } from '../services/task';

export default {
  namespace: 'task',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    loading: true,
    formData: {},
    approveData: [],
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
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryTask, payload);
      if (callback) callback(response);
      yield put({
        type: 'saveTask',
        payload: response.task || {},
      });
    },
    *fetchTask({ payload, callback }, { call, put }) {
      const response = yield call(queryTask, payload);
      if (callback) callback(response);
      yield put({
        type: 'saveTask',
        payload: response.task || {},
      });
      yield put({
        type: 'saveApproveData',
        payload: response.approveData || [],
      });
    },
    *add({ payload, callback }, { call }) {
      const result = yield call(addTask, payload);
      if (callback) callback(result);
    },
    *addByWriter({ payload, callback }, { call }) {
      const result = yield call(addTaskByWriter, payload);
      if (callback) callback(result);
    },
    *publish({ payload, callback }, { call }) {
      const result = yield call(publishTask, payload);
      if (callback) callback(result);
    },
    *update({ payload, callback }, { call, put }) {
      const result = yield call(updateTask, payload);
      if (callback) callback(result);
    },
    *handin({ payload, callback }, { call, put }) {
      const result = yield call(handinTask, payload);
      if (callback) callback(result);
    },
    *approve({ payload, callback }, { call, put }) {
      const result = yield call(approveTask, payload);
      if (callback) callback(result);
    },
    *reject({ payload, callback }, { call, put }) {
      const result = yield call(rejectTask, payload);
      if (callback) callback(result);
    },
    *specify({ payload, callback }, { call, put }) {
      const result = yield call(specifyTask, payload);
      if (callback) callback(result);
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
    *clearFormData(_, { call, put }) {
      yield put({
        type: 'saveTask',
        payload: { },
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
    saveApproveData(state, action) {
      return {
        ...state,
        approveData: action.payload,
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
