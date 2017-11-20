import { stringify } from 'qs';
import request from '../utils/request';

export async function queryTeamUsers(params) {
  return request(`/api/task/team/users?${stringify(params)}`);
}