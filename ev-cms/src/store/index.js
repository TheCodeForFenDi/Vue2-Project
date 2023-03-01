import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 全局用户信息
    userInfo: {},
  },
  getters: {
  },
  mutations: {
    // 接受数据并传到 state.userInfo
    updateUserInfo(state, value){
      state.userInfo = value
    }
  },
  actions: {
    // 获取数据请求
    getUserInfo(ctx){
      axios.get('/my/userinfo').then(res =>{                                         /* 成功回调 */
        console.log(res.data)
        if(res.data.code === 0){
          ctx.commit('updateUserInfo', res.data.data)         /* updateUserInfo 返回res.data.data数据 */
        }
      }).catch(()=>{                                          /* 失败回调 */
          console.log('请求数据失败了，请重试!')
      })
    }
  },
  modules: {
  }
})
