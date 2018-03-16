import { queryTask, updateTask, addTask, publishTask, queryProjectTasks, queryTakerTasks, handinTask, approveTask, rejectTask,
queryApproverTasks, addTaskByWriter, specifyTask, withdrawTask, passTask, payoffTask, removeTask, undarenTask, queryTaskOperationRecords,
queryTeamTasks, queryProjectFinanceTasks, queryDarenTasks, approveTaskBatch, copyTask } from '../services/task';
import { TASK_APPROVE_STATUS } from '../constants';

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
    operationRecords: [],
    projectTask: {
      approve_status: TASK_APPROVE_STATUS.all,
      list: [],
      pagination: {},
    },
    projectTaskLoading: true,
    takerTask: {
      list: [],
      pagination: {},
      approve_status: TASK_APPROVE_STATUS.taken,
    },
    takerTaskLoading: true,
    approverTask: {
      list: [],
      pagination: {},
      approve_status: 'waitingForApprove',
    },
    approverTaskLoading: true,
    darenTask: {
      list: [],
      pagination: {},
      approve_status: TASK_APPROVE_STATUS.all,
    },
    darenTaskLoading: true,
    teamTask: {
      approve_status: TASK_APPROVE_STATUS.all,
      list: [],
      pagination: {},
    },
    teamTaskLoading: true,
    projectFinanceTask: {
      list: [],
      pagination: {},
    },
    projectFinanceTaskLoading: true,

    dockPanel: {
      visible: false,
      _id: '',
      activeKey: 'OperationPane',
    },
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
    *fetchOperationRecords({ payload, callback }, { call, put }) {
      const response = yield call(queryTaskOperationRecords, payload);
      yield put({
        type: 'saveOperationRecords',
        payload: response.operationRecords || [],
      });
      if (callback) callback(response);
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
    *withdraw({ payload, callback }, { call, put }) {
      const result = yield call(withdrawTask, payload);
      if (callback) callback(result);
    },
    *pass({ payload, callback }, { call, put }) {
      const result = yield call(passTask, payload);
      if (callback) callback(result);
    },
    *remove({ payload, callback }, { call, put }) {
      const result = yield call(removeTask, payload);
      if (callback) callback(result);
    },
    *payoff({ payload, callback }, { call, put }) {
      const result = yield call(payoffTask, payload);
      if (callback) callback(result);
    },
    *undaren({ payload, callback }, { call, put }) {
      const result = yield call(undarenTask, payload);
      if (callback) callback(result);
    },
    *copy({ payload, callback }, { call, put }) {
      const result = yield call(copyTask, payload);
      if (callback) callback(result);
    },
    *approveBatch({ payload, callback }, { call, put }) {
      const result = yield call(approveTaskBatch, payload);
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
          payload: {...response, approve_status: payload.approve_status},
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
          payload: {...response, approve_status: payload.approve_status},
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
          payload: {...response, approve_status: payload.approve_status},
        });
      }
      yield put({
        type: 'changeApproverTasksLoading',
        payload: false,
      });
    },
    *fetchDarenTasks({ payload }, { call, put }) {
      yield put({
        type: 'changeDarenTasksLoading',
        payload: true,
      });
      const response = yield call(queryDarenTasks, payload);
      if (!response.error) {
        yield put({
          type: 'saveDarenTasks',
          payload: {...response, approve_status: payload.approve_status},
        });
      }
      yield put({
        type: 'changeDarenTasksLoading',
        payload: false,
      });
    },
    *fetchTeamTasks({ payload }, { call, put }) {
      yield put({
        type: 'changeTeamTasksLoading',
        payload: true,
      });
      const response = yield call(queryTeamTasks, payload);
      if (!response.error) {
        yield put({
          type: 'saveTeamTasks',
          payload: {...response, approve_status: payload.approve_status},
        });
      }
      yield put({
        type: 'changeTeamTasksLoading',
        payload: false,
      });
    },
    *fetchProjectFinanceTasks({ payload }, { call, put }) {
      yield put({
        type: 'changeProjectFinanceTasksLoading',
        payload: true,
      });
      const response = yield call(queryProjectFinanceTasks, payload);
      if (!response.error) {
        yield put({
          type: 'saveProjectFinanceTasks',
          payload: {...response, approve_status: payload.approve_status},
        });
      }
      yield put({
        type: 'changeProjectFinanceTasksLoading',
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
    saveOperationRecords(state, action) {
      return {
        ...state,
        operationRecords: action.payload,
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
    saveDarenTasks(state, action) {
      return {
        ...state,
        darenTask: action.payload,
      };
    },
    changeDarenTasksLoading(state, action) {
      return {
        ...state,
        darenTaskLoading: action.payload,
      };
    },
    saveTeamTasks(state, action) {
      return {
        ...state,
        teamTask: action.payload,
      };
    },
    changeTeamTasksLoading(state, action) {
      return {
        ...state,
        teamTaskLoading: action.payload,
      };
    },
    saveProjectFinanceTasks(state, action) {
      return {
        ...state,
        projectFinanceTask: action.payload,
      };
    },
    changeProjectFinanceTasksLoading(state, action) {
      return {
        ...state,
        projectFinanceTaskLoading: action.payload,
      };
    },
    showDockPanel(state, action) {
      return {
        ...state,
        dockPanel: {
          ...state.dockPanel,
          ...action.payload,
          visible: true,
        },
      };
    },
    hideDockPanel(state, action) {
      return {
        ...state,
        dockPanel: {
          ...state.dockPanel,
          visible: false,
          _id: '',
        },
      };
    },
    changeDockPanelActiveKey(state, action) {
      return {
        ...state,
        dockPanel: {
          ...state.dockPanel,
          activeKey: action.payload.activeKey,
        },
      };
    },
  },
};
