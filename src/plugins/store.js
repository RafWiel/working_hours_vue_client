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
    locale: null,
    isUserLoggedIn: false,
    routePath: null,
  },
  mutations: {
    setToken(state, value) {
      state.token = value;
      state.isUserLoggedIn = !!value;
    },
    setUsername(state, value) {
      state.username = value;
    },
    setUserType(state, value) {
      state.userType = value;
    },
    setLocale(state, value) {
      state.locale = value;
    },
    setRoutePath(state, value) {
      state.routePath = value;
    },
  },
  actions: {
    setUser({ commit }, user) {
      // console.log('setUser: ', user.username);
      commit('setToken', user.token);
      commit('setUsername', user.username);
      commit('setUserType', user.userType);
      commit('setLocale', user.locale);
    },
    resetUser({ commit }) {
      commit('setToken', null);
      commit('setUsername', null);
      commit('setUserType', null);
      commit('setLocale', null);
    },
    setRoutePath({ commit }, value) {
      commit('setRoutePath', value);
    },
  },
});
