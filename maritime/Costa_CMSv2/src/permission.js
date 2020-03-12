import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)
  // determine whether the user has logged in
  // const hasToken = getToken()
  const hasToken = sessionStorage.getItem('token')
  if (hasToken) {
    console.log('permission beforeEach')
    // const userInfo = StorageDB.getItem('userInfo')
    // const roles = userInfo.roleType
    // if ((roles == 2 || roles == 1) && router.options.routes.length == 8) {
    //   next()
    // } else if (roles == 0 && router.options.routes.length == 4) {
    //   next()
    // } else {
    // store.dispatch('GenerateRoutes', { roles }).then((res) => { // 生成可访问的路由表
    //   router.addRoutes(store.getters.addRoutes) // 动态添加可访问路由表
    //   router.options.routes = store.getters.routers
    // next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
    // next({ ...to, replace: true })
    next()
    // })
    // }
    // const hasGetUserInfo = store.getters.name
    // if (hasGetUserInfo) {
    //   next()
    // } else {
    //   try {
    //     // get user info
    //     await store.dispatch('user/getInfo')
    //
    //     next()
    //   } catch (error) {
    //     // remove token and go to login page to re-login
    //     await store.dispatch('user/resetToken')
    //     Message.error(error || 'Has Error')
    //     next(`/login?redirect=${to.path}`)
    //     NProgress.done()
    //   }
    // }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
