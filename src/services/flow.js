import { stringify } from 'qs';
import request from '../utils/request';

export async function queryFlows(params) {
  return request(`/api/task/flows?${stringify(params)}`);
}

export async function addFlow(params) {
  return request('/api/task/flow', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateFlow(params) {
  return request('/api/task/flow', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function removeFlow(params) {
  console.log(params);
  return request('/api/task/flow', {
    method: 'DELETE',
    body: {
      ...params,
    },
  });
}

export async function queryApproveRoles(params) {
  return request(`/api/task/flow/roles?${stringify(params)}`);
}

export async function addApproveRole(params) {
  return request('/api/task/flow/role', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}