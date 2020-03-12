import { getList } from '@/api/order'
import { resetRouter } from '@/router'
import StorageDB from '@/utils/storageDB'

const state = {
  token: '',
  name: '',
  avatar: ''
}

const mutations = {

}

const actions = {
  // 获取订单列表
  getList(paramData) {
    return new Promise((resolve, reject) => {
      getList(paramData).then(response => {
        const { data } = response
        console.log(response)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

