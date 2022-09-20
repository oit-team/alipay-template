import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const plugins = process.env.NODE_ENV !== 'production' ? [Vuex.createLogger()] : []

export default new Vuex.Store({
  plugins,

  state: {
    userInfo: {},
  },
})
