import {request}  from './requir'

export function getHomeMultidata (data) {        //Encapsulation
    console.log('Data sent to the backend when logging in', data)
    return request({
      url: '/login',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify(data),
    });
  }

export function updatePwd (data) {        //Encapsulation
  console.log('Data sent to the backend when logging in', data)
  return request({
    url: '/updatePwd',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(data),
  });
}


export function getMenusdata() {
  return request({
    url: "/menus",
    method: "get",
  });
}

export function getUsers(params) {
  return request({
    url: "/people",
    method: "get",
    params
  });
}

export function getAddUsers(data) {
  return request({
    url: "/people",
    method: "post",
    data
  });
}

export function getTasks(params) {
  return request({
    url: "/tasks",
    method: "get",
    params
  });
}

export function addTask(data) {
  return request({
    url: "/tasks",
    method: "post",
    data
  });
}

export function deleteTask(taskNumber) {
  return request({
    url: `/tasks/${taskNumber}`,
    method: 'delete',
  });
}
