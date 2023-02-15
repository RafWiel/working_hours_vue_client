import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    token: null,
    userName: null,
    userType: null,
    isUserLoggedIn: false,
  },
  mutations: {
    setToken(state, value) {
      state.token = value;
      state.isUserLoggedIn = !!value;
    },
    setUserName(state, value) {
      state.userName = value;
    },
    setUserType(state, value) {
      state.userType = value;
    },
  },
  actions: {
    setToken({ commit }, value) {
      commit('setToken', value);
    },
    setUserName({ commit }, value) {
      commit('setUserName', value);
    },
    setUserType({ commit }, value) {
      commit('setUserType', value);
    },
  },
});