//Vuex 存储
import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    jwt: null
  },
  mutations: {
    setUser(state, { user, jwt }) {
      state.user = user
      state.jwt = jwt
      localStorage.setItem('jwt', jwt)
    },
    logout(state) {
      state.user = null
      state.jwt = null
      localStorage.removeItem('jwt')
    }
  }
})