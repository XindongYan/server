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
