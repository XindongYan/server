import { stringify } from 'qs';
import request from '../utils/request';

// export async function queryProjectNotice() {
//   return request('/api/project/notice');
// }

// export async function queryActivities() {
//   return request('/api/activities');
// }

export async function queryPhotos(params) {
  return request(`/api/photos?${stringify(params)}`);
}