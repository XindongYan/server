import { stringify } from 'qs';
import request from '../utils/request';

export async function queryInvitationCodes(params) {
  return request(`/api/task/team/invitationCodes?${stringify(params)}`);
}

export async function addInvitationCodes(params) {
  return request('/api/task/team/invitationCodes', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}