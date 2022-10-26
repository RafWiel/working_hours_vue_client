import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    token: null,
    userName: null,
    isAccountManager: false,
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
    setUserName(state, value) {
      state.userName = value;
    },
    setAccountManager(state, value) {
      state.isAccountManager = value;
    },
  },
  actions: {
    setToken({ commit }, value) {
      commit('setToken', value);
    },
    setUserName({ commit }, value) {
      commit('setUserName', value);
    },
    setAccountManager({ commit }, value) {
      commit('setAccountManager', value);
    },
  },
});
