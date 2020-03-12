import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/homePage',
    meta: { title: 'Home', icon: 'example' },
    children: [{
      path: 'homePage',
      name: 'HomePage',
      component: () => import('@/views/homePage/index'),
      meta: { title: 'HomePage', icon: 'example' }
    }
    ]
  },
  {
    path: '/upload',
    redirect: 'noRedirect', // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
    component: Layout,
    name: 'Upload',
    meta:
      { title: 'Upload', icon: 'example' },
    children: [
      {
        path: '/upload/upload',
        name: 'Ports Data Upload',
        component: () => import('@/views/upload/upload'),
        meta: { title: 'Ports Data Upload', icon: 'form' }
      }
    ]
  },
  {
    path: '/ports',
    component: Layout,
    name: 'Ports',
    meta:
      { title: 'Ports', icon: 'scanning' },
    children: [
      {
        path: '/ports/ports',
        name: 'PortsDistance',
        component: () => import('@/views/upload/history'),
        meta: { title: 'Ports Distance update', icon: 'tree' }
      },
      {
        path: '/ports/port',
        name: 'Port',
        component: () => import('@/views/upload/port'),
        meta: { title: 'Ship/Maneuver time update', icon: 'tree' }
      }
    ]
  }
]

/**
 * asyncRouter
 * @type {Array}
 */
export const asyncRouterMap = [

]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  // mode: 'history',
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
