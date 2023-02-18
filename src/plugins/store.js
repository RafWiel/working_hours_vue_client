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
  },
  actions: {
    // setToken({ commit }, value) {
    //   commit('setToken', value);
    // },
    // setUsername({ commit }, value) {
    //   commit('setUsername', value);
    // },
    // setUserType({ commit }, value) {
    //   commit('setUserType', value);
    // },
    setLocale({ commit }, value) {
      commit('setLocale', value);
    },
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
  },
});
