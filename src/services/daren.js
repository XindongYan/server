import { stringify } from 'qs';
import request from '../utils/request';

export async function queryDarens(params) {
  return request(`/api/daren/list?${stringify(params)}`);
}