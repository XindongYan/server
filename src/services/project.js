import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjects(params) {
  return request(`/api/task/projects?${stringify(params)}`);
}

export async function addProject(params) {
  return request('/api/task/project', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateProject(params) {
  return request('/api/task/project', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function publishProject(params) {
  return request('/api/task/project/publish', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function removeProject(params) {
  return request('/api/task/project', {
    method: 'DELETE',
    body: {
      ...params,
    },
  });
}

export async function queryProject(params) {
  return request(`/api/task/project?${stringify(params)}`);
}

export async function queryTaskSquareProjects(params) {
  return request(`/api/task/projects/taskSquare?${stringify(params)}`);
}