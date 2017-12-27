import { stringify } from 'qs';
import request from '../utils/request';

export async function searchStatistic(params) {
  return request('/api/spider/search/statistic', {
    method: 'POST',
    body: params,
  });
}

export async function searchNew7(params) {
  return request(`/api/spider/title.detail.taobao?${stringify(params)}`);
}

export async function queryAlimamaOrders(params) {
  return request(`/api/alimama/orders?${stringify(params)}`);
}