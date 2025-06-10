import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";
//import Ajax from "@/scripts/axios";
// import { useToast } from "vue-toast-notification";
// import "vue-toast-notification/dist/theme-sugar.css";

const ls = new SecureLS({ isCompression: false });

const defaultState = {
  user: {},
  token: null,
  loading: {},
  resetEmail: null,
};

const persistedState = createPersistedState({
  storage: {
    getItem: (key) => ls.get(key),
    setItem: (key, value) => ls.set(key, value),
    removeItem: (key) => ls.remove(key),
  },
});

const state = () => ({ ...defaultState });

const mutations = {
  setUser(state, payload) {
    state.user = payload;
  },
  setToken(state, payload) {
    state.token = payload;
  },
  setLoading(state, payload) {
    state.loading[payload] = true;
  },
  stopLoading(state, payload) {
    state.loading[payload] = false;
  },
  clearLoading(state) {
    state.loading = {};
  }, 
  resetState(state) {
    Object.assign(state, defaultState);
  },
  setMainLoading(state) {
    state.loading["main"] = true;
  },
  clearMainLoading(state) {
    state.loading["main"] = false;
  },
  setResetEmail(state, email) {
    state.resetEmail = email;
  },
  clearResetEmail(state) {
    state.resetEmail = null;
  },
};

const actions = {

};

const getters = {

};

export default createStore({
  plugins: [persistedState],
  state,
  mutations,
  actions,
  getters,
});
