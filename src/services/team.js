import { stringify } from 'qs';
import request from '../utils/request';

export async function queryTeamUsers(params) {
  return request(`/api/task/team/users?${stringify(params)}`);
}

export async function updateUser(params) {
  return request('/api/task/team/user', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function removeTeamUser(params) {
  return request('/api/task/team/user', {
    method: 'DELETE',
    body: {
      ...params,
    },
  });
}

export async function queryTeamUsersByPhone(params) {
  return request(`/api/task/users/by/phone?${stringify(params)}`);
}

export async function createTeamUser(params) {
  return request('/api/task/team/user', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryTeamUsersByRole(params) {
  return request(`/api/task/teamUsers/by/role?${stringify(params)}`);
}