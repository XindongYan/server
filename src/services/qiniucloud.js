import { stringify } from 'qs';
import request from '../utils/request';

export async function getUptoken() {
  return request(`/api/qiniucloud/uptoken`);
}