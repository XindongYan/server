import { stringify } from 'qs';
import request from '../utils/request';

// export async function queryProjectNotice() {
//   return request('/api/project/notice');
// }

// export async function queryActivities() {
//   return request('/api/activities');
// }

// export async function removeRule(params) {
//   return request('/api/rule', {
//     method: 'POST',
//     body: {
//       ...params,
//       method: 'delete',
//     },
//   });
// }

// export async function updateUser(params) {
//   return request('/api/admin/user', {
//     method: 'PUT',
//     body: {
//       ...params,
//       method: 'put',
//     },
//   });
// }

// export async function fakeSubmitForm(params) {
//   return request('/api/forms', {
//     method: 'POST',
//     body: params,
//   });
// }

// export async function fakeChartData() {
//   return request('/api/fake_chart_data');
// }

// export async function queryTags() {
//   return request('/api/tags');
// }

// export async function queryBasicProfile() {
//   return request('/api/profile/basic');
// }

// export async function queryAdvancedProfile() {
//   return request('/api/profile/advanced');
// }

// export async function queryFakeList(params) {
//   return request(`/api/fake_list?${stringify(params)}`);
// }

export async function accountLogout() {
  return request('/api/user/logout', {
    method: 'DELETE',
  });
}

export async function getSmsCode(params) {
  return request('/api/sms/send', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/user/signup', {
    method: 'POST',
    body: params,
  });
}

// export async function queryNotices() {
//   return request('/api/notices');
// }
