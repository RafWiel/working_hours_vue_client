import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  getters: {},
  modules: {},
  strict: true,
  state: {
    token: null,
    username: null,
    userType: null,
    isUserLoggedIn: false,
  },
  mutations: {
    setToken(state, value) {
      state.token = value;

      if (value) {
        state.isUserLoggedIn = true;
      } else {
        state.isUserLoggedIn = false;
      }
    },
    setUsername(state, value) {
      state.username = value;
    },
    setUserType(state, value) {
      state.userType = value;
    },
  },
  actions: {
    setToken({ commit }, value) {
      commit('setToken', value);
    },
    setUsername({ commit }, value) {
      commit('setUsername', value);
    },
    setUserType({ commit }, value) {
      commit('setUserType', value);
    },
  },
});
