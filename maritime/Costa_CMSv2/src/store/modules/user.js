import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, getName, setName, removeName } from '@/utils/auth'
import { resetRouter } from '@/router'
import sha256 from 'crypto-js/sha256'
import Base64 from 'crypto-js/enc-base64'
import StorageDB from '@/utils/storageDB'

const privateKey = '0llldmxy0llljstt'

const state = {
  token: getToken(),
  name: '',
  avatar: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    const hmacDigest = Base64.stringify(sha256(password, privateKey))
    const paramData = {
      requestData: {
        username: username.trim(),
        password: hmacDigest
      }
    }
    return new Promise((resolve, reject) => {
      login(paramData).then(response => {
        const { data } = response
        const roles = data.shops.length > 0 ? data.shops[0].roleType : 0
        data.roleType = roles
        StorageDB.setItem('userInfo', data)
        commit('SET_TOKEN', data.token)
        commit('SET_NAME', data.username)
        setToken(data.token)
        setName(data.username)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        StorageDB.removeItem('userInfo')
        commit('SET_TOKEN', '')
        removeToken()
        removeName()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      StorageDB.removeItem('userInfo')
      commit('SET_TOKEN', '')
      removeName()
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

