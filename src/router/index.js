import Vue from 'vue'
import Router from 'vue-router'
import Bus from '@/bus'
import { SetDefaultHeader } from '_common/http'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'layouts',
      redirect: '/monitor/manage/map',
      component: () => import('@/layouts'),
      children: [
        {
          path: '/monitor/manage',
          name: 'monitor_manage',
          component: () => import('_views/monitor_manage'),
          redirect: '/monitor/manage/map',
          meta: {
            title: '监控管理',
          },
          children: [
            {
              path: 'meter',
              name: 'meter',
              component: () => import('_views/monitor_manage/meter'),
              meta: {
                title: '仪表模式',
              },
            },
            {
              path: 'map',
              name: 'map',
              component: () => import('_views/monitor_manage/map'),
              meta: {
                title: '地图模式',
              },
            },
          ],
        },
        {
          path: '/monitor/manage/meter_add',
          name: 'meter_add',
          component: () => import('_views/monitor_manage/meter_add'),
          meta: {
            title: '添加数据看板',
          },
        },
        {
          path: '/device/manage',
          name: 'device_manage',
          component: () => import('_views/device_manage'),
          meta: {
            title: '设备管理',
          },
        },
        {
          path: '/police/manage',
          name: 'police_manage',
          component: () => import('_views/police_manage'),
          meta: {
            title: '报警管理',
          },
        },
        {
          path: '/police/manage/notice',
          name: 'police_manage_notice',
          component: () => import('_views/police_manage/police_notice'),
          meta: {
            title: '报警通知',
          },
        },
        {
          path: '/police/manage/detail',
          name: 'police_manage_detail',
          component: () => import('_views/police_manage/police_detail'),
          meta: {
            title: '报警详情',
          },
        },
        {
          path: '/data/analyse',
          name: 'data_analyse',
          component: () => import('_views/data_analyse'),
          meta: {
            title: '数据分析',
          },
        },
        {
          path: '/data/detail',
          name: 'data_detail',
          component: () => import('_views/data_analyse/data_detail'),
          meta: {
            title: '数据分析',
          },
        },
        {
          path: '/data/add',
          name: 'data_add',
          component: () => import('_views/data_analyse/data_add'),
          meta: {
            title: '数据分析',
          },
        },
        {
          path: '/data/board',
          name: 'data_board',
          component: () => import('_views/data_analyse/data_board'),
          meta: {
            title: '数据分析',
          },
        },
        {
          path: '/data/predict',
          name: 'data_predict',
          component: () => import('_views/data_analyse/data_predict'),
          meta: {
            title: '数据分析',
          },
        },
        {
          path: '/data/history',
          name: 'data_history',
          component: () => import('_views/data_history'),
          meta: {
            title: '历史数据',
          },
        },
        {
          path: '/system_setting',
          name: 'setting',
          component: () => import('_views/system_setting'),
          meta: {
            title: '系统设置',
          },
        },
        {
          path: '/client_manage',
          name: 'client',
          component: () => import('_views/client_manage'),
          meta: {
            title: '客户管理',
          },
        },
        {
          path: '/client_manage/detail',
          name: 'detail',
          component: () => import('_views/client_manage/detail'),
          meta: {
            title: '客户详情',
          },
        },
        {
          path: '/client_manage/site',
          name: 'site',
          component: () => import('_views/client_manage/site'),
          meta: {
            title: '客户站点',
          },
        },
        {
          path: '/authority_manage',
          name: 'authority',
          component: () => import('_views/authority_manage'),
          meta: {
            title: '权限管理',
          },
        },
        {
          path: '/log_manage',
          name: 'log',
          component: () => import('_views/log_manage'),
          meta: {
            title: '日志管理',
          },
        },
        {
          path: '/service_manual',
          name: 'serviceManual',
          component: () => import('_views/service_manual'),
          meta: {
            title: '使用手册',
          },
        },
      ],
    },
    {
      path: '/login_signup',
      component: () => import('_views/login_signup'),
      name: '登录注册',
      meta: {
        title: '登录注册',
      },
    },
  ],
  linkActiveClass: 'active',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0,
      }
    }
  },
})
/**
 * 路由拦截
 * 不是所有版块都需要鉴权的,所以需要鉴权的在路由meta添加添加一个字段needLogin,
 * 设置为true的时候就必须走鉴权,像登录页这些不要,是可以直接访问的!
 */
router.beforeEach((to, from, next) => {
  // 路由发生变化修改页面title
  if (to.meta.title) {
    document.title = to.meta.title
  }

  if (to.path === '/login_signup' || to.path === '/home' || to.path === '/') {
    next()
    return
  }
  let authorization = to.query.token || localStorage.getItem('Authorization')
  let phone = to.query.phone
  let username = to.query.name || phone
  if (authorization) {
    localStorage.setItem('Authorization', authorization)
    SetDefaultHeader('Authorization', authorization)
    if (phone) {
      localStorage.setItem('Phone', phone)
      localStorage.setItem('UserName', username)
    }
    next()
  } else {
    localStorage.clear()
    Bus.$message.error('登录失效')
    next({
      path: '/login_signup?isLogin=1&from=' + to.fullPath,
    })
  }
  // next()
})

export default router
