import { stringify } from 'qs';
import request from '../utils/request';

export async function queryStatisticsList(params) {
  return request(`/api/statistics/task/list?${stringify(params)}`);
}
