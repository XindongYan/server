import { stringify } from 'qs';
import request from '../utils/request';

export async function queryCurrent() {
  return request('/api/user/currentUser');
}

export async function updateUser(params) {
  return request('/api/user', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function queryUserBySms(params) {
  return request(`/api/user/by/sms_code?${stringify(params)}`);
}

export async function setUserAgent(params) {
  return request('/api/user/user_agent', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
