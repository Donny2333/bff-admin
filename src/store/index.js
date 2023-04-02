
import { createStore } from 'vuex'
// 引入vuex持久化方法createPersistedState
import createPersistedState from 'vuex-persistedstate'
import user from './modules/user'
 
export default createStore({
  state: {},
  mutations: {},
  actions: {},
  getters: {},
  modules: {
    // 模块化数据
    user,
  },
  plugins: [
    // veux持久化配置
    createPersistedState({
      key: 'store-client',
      paths: ['user']
    })
  ]

})
