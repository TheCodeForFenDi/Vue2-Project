// ! axios

import axios from 'axios'
import router from '@/router/index'

// 为请求设置根路径
axios.defaults.baseURL='http://www.liulongbin.top:3008'

// request 请求拦截器（/my开头的都给他统一加一个 header 请求头，避免每次手动添加 header）
axios.interceptors.request.use(function(config){
    // 请求成功 --- 判断请求的 url 地址，如果是以 /my 开头的，需要添加一个 Authorization 请求头，传有本地 token
    // console.log('请求拦截器config', config)
    if(config.url.startsWith('/my')){                                       /* startsWith() 字符串方法，判断以...开头 */
        config.headers.Authorization = localStorage.getItem('token')        /* 本地 token 传给请求头 */
    }
    return config
}, function(error){
    return Promise.reject(error)
})
// response 响应拦截器（当 token 值不正确时，请求失败变为 401，同时跳转到登录页面进行登录）
axios.interceptors.response.use(function(response){
    return response
}, function(error){
    // 请求失败 401，
    // console.log('响应拦截器error',error)
    if(error.response.status === 401){
        localStorage.removeItem('token')                                    /* 清空 token */
        router.push('/login')                                               /* 跳转到登录页 */
    }
    return Promise.reject(error)
})

// 暴露 axios
export default axios
