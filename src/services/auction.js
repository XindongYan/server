import { stringify } from 'qs';
import request from '../utils/request';

export async function queryChannels(params) {
  return request(`/jsons/taskChannel.json`);
}
