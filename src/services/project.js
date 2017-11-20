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

export async function removeProject(params) {
  console.log(params);
  return request('/api/task/project', {
    method: 'DELETE',
    body: {
      ...params,
    },
  });
}
