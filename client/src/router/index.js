import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import Middleware from './middleware'

import DefaultLayout from '../layouts/default'
import AuthLayout from '../layouts/auth'

import AuthLogin from '../views/auth/Login.vue'
import AuthRegister from '../views/auth/Register.vue'

import Home from '../views/Home.vue'
import UserProfile from '../views/user/Profile.vue'
import Account from '../views/Account.vue'

import Group from '../views/group/Index.vue'
import GroupProfile from '../views/group/Profile.vue'
import GroupList from '../views/group/List.vue'
import GroupChat from '../views/group/Chat.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        {
          path: 'login',
          name: 'AuthLogin',
          component: AuthLogin,
          meta: {
            title: 'Login',
            guest: true
          }
        },
        {
          path: 'register',
          name: 'AuthRegister',
          component: AuthRegister,
          meta: {
            title: 'Register',
            guest: true
          }
        }
      ]
    },
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '/',
          name: 'Home',
          component: Home,
          meta: { title: 'Home' }
        },
        {
          path: '/account',
          name: 'Account',
          component: Account,
          meta: { title: 'Account' }
        },
        {
          path: '/user/:id',
          name: 'UserProfile',
          component: UserProfile,
          meta: { title: 'User Profile' }
        },
        {
          path: '/groups',
          component: Group,
          children: [
            {
              path: '/',
              name: 'GroupList',
              component: GroupList,
              meta: { title: 'Group List' }
            },
            {
              path: ':id',
              name: 'GroupProfile',
              component: GroupProfile,
              meta: { title: 'Group Profile' }
            },
            {
              path: ':id/chat',
              name: 'GroupChat',
              component: GroupChat,
              meta: { title: 'Chat' }
            }
          ]
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - GroupChat.app`
  if (to.name) NProgress.start()
  next();
})

router.beforeEach(Middleware)

router.afterEach((to, from) => NProgress.done())

export default router