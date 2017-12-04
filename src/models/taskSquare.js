import { queryProjectTasks, queryTask, takeTask, deliverTask } from '../services/task';
import { queryTaskSquareProjects, queryProject } from '../services/project';
export default {
  namespace: 'taskSquare',

  state: {
    projects: {
      list: [],
      pagination: {},
    },
    projectsLoading: true,
    project: {},
    tasks: {
      list: [],
      pagination: {},
    },
    tasksLoading: true,
    task: {},
  },

  effects: {
    *fetchProjects({ payload }, { call, put }) {
      yield put({
        type: 'changeProjectsLoading',
        payload: true,
      });
      const response = yield call(queryTaskSquareProjects, payload);
      if (!response.error) {
        yield put({
          type: 'saveProjects',
          payload: response,
        });
      }
      yield put({
        type: 'changeProjectsLoading',
        payload: false,
      });
    },
    *fetchProject({ payload }, { call, put }) {
      const response = yield call(queryProject, payload);
      if (!response.error) {
        yield put({
          type: 'saveProject',
          payload: response.project,
        });
      }
    },
    *fetchProjectTasks({ payload }, { call, put }) {
      yield put({
        type: 'changeTasksLoading',
        payload: true,
      });
      const response = yield call(queryProjectTasks, payload);
      if (!response.error) {
        yield put({
          type: 'saveTasks',
          payload: response,
        });
      }
      yield put({
        type: 'changeTasksLoading',
        payload: false,
      });
    },
    *clearProjectTasks(_, { call, put }) {
      yield put({
        type: 'saveTasks',
        payload: {
          list: [],
          pagination: {},
        },
      });
    },
    *fetchTask({ payload }, { call, put }) {
      const response = yield call(queryTask, payload);
      yield put({
        type: 'saveTask',
        payload: response.task || {},
      });
    },
    *takeTask({ payload, callback }, { call, put }) {
      const response = yield call(takeTask, payload);
      if (!response.error) {
        yield put({
          type: 'saveTakeTask',
          payload: { _id: payload._id },
        });
      }
      if (callback) callback(response);
    },
    *deliverTask({ payload, callback }, { call, put }) {
      const response = yield call(deliverTask, payload);
      if (callback) callback(response);
    },
    *responseTasken({ payload }, { call, put }) {
      yield put({
        type: 'saveTakeTask',
        payload: { _id: payload._id },
      });
    },
  },

  reducers: {
    saveProjects(state, action) {
      return {
        ...state,
        projects: action.payload,
      };
    },
    changeProjectsLoading(state, action) {
      return {
        ...state,
        projectsLoading: action.payload,
      };
    },
    saveProject(state, action) {
      return {
        ...state,
        project: action.payload,
      };
    },
    saveTasks(state, action) {
      return {
        ...state,
        tasks: action.payload,
      };
    },
    changeTasksLoading(state, action) {
      return {
        ...state,
        tasksLoading: action.payload,
      };
    },
    saveTask(state, action) {
      return {
        ...state,
        task: action.payload,
      };
    },
    saveTakeTask(state, action) {
      const tasks = [...state.tasks.list];
      const index = tasks.findIndex(item => item._id === action.payload._id);
      tasks[index].approve_status = -1;
      return {
        ...state,
        tasks: { ...state.tasks, list: tasks },
      };
    },
  },
};
