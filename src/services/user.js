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

export async function changePassword(params) {
  return request('/api/user/change/pwd', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function changePasswordBySms_code(params) {
  return request('/api/user/change/pwd/by/sms_code', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}