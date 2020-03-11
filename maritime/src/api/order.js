import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/api/cms/order/search',
    method: 'post',
    data
  })
}
