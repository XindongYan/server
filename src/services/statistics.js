import { stringify } from 'qs';
import request from '../utils/request';

export async function queryStatisticsTask(params) {
  return request(`/api/statistics/task/list/task?${stringify(params)}`);
}

export async function queryStatisticsChannel(params) {
  return request(`/api/statistics/task/list/channel?${stringify(params)}`);
}

export async function queryStatisticsTaker(params) {
  return request(`/api/statistics/task/list/taker?${stringify(params)}`);
}