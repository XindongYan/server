import { stringify } from 'qs';
import request from '../utils/request';

export async function queryBpus(params) {
  return request(`/api/bpu/list?${stringify(params)}`);
}

export async function queryBpu(params) {
  return request(`/api/bpu?${stringify(params)}`);
}

export async function queryTaobaoShops(params) {
  return request(`/api/taobaoShop/list?${stringify(params)}`);
}