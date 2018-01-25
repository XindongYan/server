import { stringify } from 'qs';
import request from '../utils/request';

export async function queryDarens(params) {
  return request(`/api/daren/list?${stringify(params)}`);
}

export async function queryDarenLives(params) {
  return request(`/api/daren/live/list?${stringify(params)}`);
}
