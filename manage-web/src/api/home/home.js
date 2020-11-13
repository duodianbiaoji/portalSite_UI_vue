import request from '@/utils/request'

export function getSystemData() {
  return request({
    url: 'welcome/getSysOverview',
    method: 'get'
  })
}

export function getToDoList() {
  return request({
    url: 'welcome/getToDolist',
    method: 'get'
  })
}
