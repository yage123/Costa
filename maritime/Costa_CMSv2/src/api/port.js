import { searchPorts, fLogin } from '@/utils/request'

export function getPorts() {
  return searchPorts().get('/api/cms/getDistanceData')
}
export function getPort() {
  return searchPorts().get('/api/cms/getManeuverData')
}
export function updateHistory(data) {
  return searchPorts().post('/api/cms/updateDistanceById', data)
}
export function deleteHistory(data) {
  return searchPorts().post('/api/cms/deleteDistanceById', data)
}
export function updatePort(data) {
  return searchPorts().post('/api/cms/updateManeuverById', data)
}
export function deletePort(data) {
  return searchPorts().post('/api/cms/deleteManeuverTimeById', data)
}
export function login(data) {
  return fLogin().post('/api/v1/login', data)
}
export function pDeleteBatch(data) {
  return searchPorts().post('/api/cms/deleteManeuverTimeByIds', data)
}
export function hDeleteBatch(data) {
  return searchPorts().post('/api/cms/deleteDistanceByIds', data)
}
