import Vue from 'vue'
import VueRouter from 'vue-router'
import Registered from '../views/Reg/Registered.vue'
import Login from '../views/Login/Login.vue'
import Main from '../views/Main/Main.vue'
import Home from '../views/Menus/Home/Home.vue'
import UserInfo from '../views/Menus/User/UserInfo.vue'
import UserAvatar from '../views/Menus/User/UserAvatar.vue'
import UserPwd from '../views/Menus/User/UserPwd.vue'
import ArtCate from '../views/Menus/Article/ArtCate.vue'
// import ArtList from '../views/Menus/Article/ArtList.vue'

Vue.use(VueRouter)
// 解决 多次接口请求产生的错误信息
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location){
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/Registered',
    name: 'Registered',
    component: Registered,
    meta: {
      title: '注册',
    }
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录',
    }
  },
  {
    path: '/',
    name: 'Main',
    component: Main,
    meta: {
      title: 'Main',
    },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: {
          title: '首页'
        }
      },
      {
        path: '/user-info',
        name: 'UserInfo',
        component: UserInfo,
        meta: {
          title: '基本资料'
        }
      },
      {
        path: '/user-avatar',
        name: 'UserAvatar',
        component: UserAvatar,
        meta: {
          title: '用户头像'
        }
      },
      {
        path: "/user-pwd",  
        name: "UserPwd",
        component: UserPwd,
        meta: {
          title: '修改密码'
        }
      },
      {
        path: '/art-cate',
        name: 'ArtCate',
        component: ArtCate,
        meta: {
          title: "文章分类"
        }
      },
      // {
      //   path: '/art-list',
      //   name: 'ArtList',
      //   component: ArtList,
      //   meta: {
      //     title: "文章列表"
      //   }
      // }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next)=>{
  // 只有后台主页 '/'路径 需要访问权限，
  if(to.path == '/'){
    const token = localStorage.getItem('token')
    if(token){                                            /* 如果本地存储有 token，直接放行 */
      next('/home')                                       /* 前往 /home 组件 */
    }else {
      next('/login')                                      /* 否则跳转登录页去登录 */
    }
  }else {
    next()
  }
})

router.afterEach((to, from)=>{
  console.log('后置路由守卫', {to, from})
  document.title = to.meta.title || 'Background management system'
  console.log(to.name, '路由组件')
})

export default router
