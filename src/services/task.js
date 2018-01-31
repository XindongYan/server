import { stringify } from 'qs';
import request from '../utils/request';

export async function queryApproverTasks(params) {
  return request(`/api/v2/task/list/approver?${stringify(params)}`);
}

export async function queryTask(params) {
  return request(`/api/task?${stringify(params)}`);
}

export async function queryTaskOperationRecords(params) {
  return request(`/api/task/operationRecords?${stringify(params)}`);
}

export async function addTask(params) {
  return request('/api/v2/task', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function addTaskByWriter(params) {
  return request('/api/task', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function publishTask(params) {
  return request('/api/task/publish', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function updateTask(params) {
  return request('/api/task/update', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function takeTask(params) {
  return request('/api/task/take', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function handinTask(params) {
  return request('/api/task/handin', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function approveTask(params) {
  return request('/api/v2/task/approve', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function rejectTask(params) {
  return request('/api/task/reject', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function specifyTask(params) {
  return request('/api/task/specify', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function withdrawTask(params) {
  return request('/api/task/withdraw', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function passTask(params) {
  return request('/api/task/pass', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function removeTask(params) {
  return request('/api/task', {
    method: 'DELETE',
    body: {
      ...params,
    },
  });
}

export async function payoffTask(params) {
  return request('/api/task/payoff', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function queryProjectTasks(params) {
  return request(`/api/task/list/project?${stringify(params)}`);
}

export async function queryTakerTasks(params) {
  return request(`/api/task/list/taker?${stringify(params)}`);
}

export async function queryConvertedTasks(params) {
  return request(`/api/chrome/test.json?${stringify(params)}`);
}

export async function queryTeamTasks(params) {
  return request(`/api/task/list/team?${stringify(params)}`);
}

export async function queryProjectFinanceTasks(params) {
  return request(`/api/task/list/project/finance?${stringify(params)}`);
}

export async function queryYhhBody(params) {
  return request(`/api/task/yhh/body?${stringify(params)}`);
}
