import { asyncRouterMap, constantRoutes } from '../../router'

function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.indexOf(roles) >= 0
  } else {
    return true
  }
}

const permission = {
  state: {
    routers: constantRoutes,
    addRoutes: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRoutes = routers
      state.routers = constantRoutes.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      console.log('modules' + data)
      return new Promise(resolve => {
        const { roles } = data
        const accessedRouters = asyncRouterMap.filter(v => {
          // if (roles.indexOf(0) >= 0) return true
          if (hasPermission(roles, v)) {
            if (v.children && v.children.length > 0) {
              v.children = v.children.filter(child => {
                if (hasPermission(roles, child)) {
                  return child
                }
                return false
              })
              return v
            } else {
              return v
            }
          }
          return false
        })
        commit('SET_ROUTERS', accessedRouters)
        resolve(accessedRouters)
      })
    }
  }
}

export default permission;
