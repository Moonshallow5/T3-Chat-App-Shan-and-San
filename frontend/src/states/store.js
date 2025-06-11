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
  session_id: null,
  pageTitle: "",
  chatSessions: [],
  messages: [],
  sessions: [],
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
  setMessages(state, payload) {
    state.messages = payload;
  },
  clearLoading(state) {
    state.loading = {};
  },
  appendMessage(state, payload) {
    state.messages = [...state.messages, payload];
  },
  appendChatSessions(state, payload) {
    state.chatSessions = [payload, ...state.chatSessions];
  },
  clearMessage(state) {
    state.messages = [];
  },
  clearPageTitle(state) {
    state.pageTitle = '' ;
  },
  setChatSessions(state, payload) {
    state.chatSessions = payload;
  },
  setMessages(state, payload) {
    state.messages = payload;
  },
  setSessionId(state, payload) {
    state.session_id = payload;
  },
  clearSessionId(state) {
    state.session_id = null;
  },
  setSessions(state, payload) {
    state.sessions = payload;
  },
  setPageTitle(state, payload) {
    state.pageTitle = payload;
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
