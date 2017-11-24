import { stringify } from 'qs';
import request from '../utils/request';

export async function queryPhotos(params) {
  return request(`/api/photos?${stringify(params)}`);
}

export async function addPhoto(params) {
  return request(`/api/photo`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function removePhoto(params) {
  return request(`/api/photo`, {
    method: 'DELETE',
    body: {
      ...params,
    },
  });
}