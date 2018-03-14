import { stringify } from 'qs';
import request from '../utils/request';

export async function queryStatisticsList(params) {
  return request(`/api/task/team/statistics/list?${stringify(params)}`);
}

export async function queryStatisticsTotal(params) {
  return request(`/api/task/team/statistics/total?${stringify(params)}`);
}
