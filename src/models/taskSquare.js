import { queryProjectTasks, queryTask } from '../services/task';
import { queryTaskSquareProjects } from '../services/project';
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
    *fetchTask({ payload }, { call, put }) {
      const response = yield call(queryTask, payload);
      yield put({
        type: 'saveTask',
        payload: response.task || {},
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
  },
};
