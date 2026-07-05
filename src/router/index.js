import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const Home = () => import('@/views/Home.vue')
const Timeline = () => import('@/views/Timeline.vue')
const Milestones = () => import('@/views/Milestones.vue')
const Diaries = () => import('@/views/Diaries.vue')
const DiaryDetail = () => import('@/views/DiaryDetail.vue')
const Growth = () => import('@/views/Growth.vue')
const Messages = () => import('@/views/Messages.vue')
const About = () => import('@/views/About.vue')
const Login = () => import('@/views/Login.vue')
const Register = () => import('@/views/Register.vue')
const Admin = () => import('@/views/Admin.vue')
const AdminSelect = () => import('@/views/AdminSelect.vue')

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/timeline',
    name: 'timeline',
    component: Timeline
  },
  {
    path: '/milestones',
    name: 'milestones',
    component: Milestones
  },
  {
    path: '/diaries',
    name: 'diaries',
    component: Diaries
  },
  {
    path: '/diaries/:id',
    name: 'diary-detail',
    component: DiaryDetail
  },
  {
    path: '/growth',
    name: 'growth',
    component: Growth
  },
  {
    path: '/messages',
    name: 'messages',
    component: Messages
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin-select',
    name: 'admin-select',
    component: AdminSelect,
    meta: { requiresAdmin: true }
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  console.log('[DEBUG] 路由守卫:', 'from:', from.path, 'to:', to.path)
  let user = null
  try {
    const userStr = localStorage.getItem('user')
    console.log('[DEBUG] 路由守卫: localStorage.user:', userStr)
    if (userStr) {
      user = JSON.parse(userStr)
    }
  } catch (e) {
    console.error('[DEBUG] 路由守卫: JSON.parse异常:', e)
    user = null
  }
  
  if (to.meta.requiresAdmin) {
    if (user && (user.role === 'admin' || user.is_admin)) {
      console.log('[DEBUG] 路由守卫: 管理员权限通过')
      next()
    } else {
      console.log('[DEBUG] 路由守卫: 非管理员，重定向到 /login')
      next('/login')
    }
  } else if (to.meta.requiresGuest) {
    if (user) {
      if (user.role === 'admin' || user.is_admin) {
        console.log('[DEBUG] 路由守卫: 已登录管理员，重定向到 /admin-select')
        next('/admin-select')
      } else {
        console.log('[DEBUG] 路由守卫: 已登录普通用户，重定向到 /home')
        next('/home')
      }
    } else {
      console.log('[DEBUG] 路由守卫: 未登录，允许访问')
      next()
    }
  } else {
    console.log('[DEBUG] 路由守卫: 无需权限检查，允许访问')
    next()
  }
})

router.afterEach((to, from) => {
  console.log('[DEBUG] 路由跳转完成:', 'from:', from.path, 'to:', to.path)
  console.log('[DEBUG] 当前URL:', window.location.href)
})

export default router