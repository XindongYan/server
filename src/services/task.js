import { stringify } from 'qs';
import request from '../utils/request';

export async function queryTasks(params) {
  return request(`/api/task/list/create?${stringify(params)}`);
}

