import { stringify } from 'qs';
import request from '../utils/request';

export async function queryApproveTasks(params) {
  return request(`/api/task/list/approve?${stringify(params)}`);
}

export async function queryTask(params) {
  return request(`/api/task?${stringify(params)}`);
}

export async function addTask(params) {
  return request('/api/task', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateTask(params) {
  return request('/api/task/update', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function queryProjectTasks(params) {
  return request(`/api/task/list/project?${stringify(params)}`);
}

export async function queryTakerTasks(params) {
  return request(`/api/task/list/taker?${stringify(params)}`);
}
