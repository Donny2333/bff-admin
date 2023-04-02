
const user = {
  state: {
    token: null,
    user: null, 
    roleId:null, //技术运营 2  商务运营 3 供应商4
    userId:null,
    userName:null,
    roleName:null,
    firstName:null,
    isLogin: false
  },
  getters: {
    getToken (state) {
      return state.token
    },   
    getUser (state) {
      return state.user
    },
    getRoleId(state){
      return state.roleId
    },
    getRoleName(state){
      return state.roleName
    },
    getFirstName(state){
      return state.firstName
    },
    getUserId(state){
      return state.userId
    },
    getUserName(state){
      return state.userName
    },
    getIsLogin (state) {
      return state.token !== null && state.user !== null 
    }
  },
  mutations: {
    SetToken (state, token) {
      state.token = token
    },
    LoginIn (state, user) {
      state.user = user
      state.roleId = user.roleId
      state.roleName = user.roleName 
      state.userId= user.id
      state.firstName = user.userName.length? user.userName.substr(0,1):''
      state.userName = user.userName
      state.isLogin = true
    },
    LoginOut: state => {
      state.token = null
      state.user = null
      state.roleId = null
      state.roleName = null
      state.userId= null
      state.userName = null
      state.isLogin = false
    }
  },
  actions: {
    SetToken (context, token) {
      context.commit('SetToken', token)
    },
    LoginIn (context, user) {
      context.commit('LoginIn', user)
    },
    LoginOut (context) {
      context.commit('LoginOut')
    }
  }
 
}
export default user
 