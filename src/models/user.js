import checkIfExpired from "../middlewares/checkTokenExpired";
import axios from "axios";
const ROOT_URL = "https://alexsblogapi.herokuapp.com";

export const user = {
  state: {
    isAuthenticated: !checkIfExpired(),
    username: localStorage.getItem("username"),
    isDarkMode: false
  },
  reducers: {
    userLogin: (state, payload) => ({ ...state, ...payload }),
    userLogout: (state, payload) => ({
      ...state,
      isAuthenticated: false,
      username: null
    }),
    toggleDarkModeState: (state, payload) => ({
      ...state,
      isDarkMode: !state.isDarkMode
    }),
    setDarkModeState: (state, payload) => ({ ...state, isDarkMode: payload })
  },
  effects: dispatch => ({
    async userSignup({ signupData, callback }, state) {
      dispatch.isPending.setIsPending(true);
      await axios({
        baseURL: ROOT_URL,
        url: "/user/signup",
        method: "POST",
        data: signupData
      });
      dispatch.isPending.setIsPending(false);
      callback();
    },

    async login({ loginData, callback }, state) {
      dispatch.isPending.setIsPending(true);
      const { data } = await axios({
        baseURL: ROOT_URL,
        url: "/user/login",
        method: "POST",
        data: loginData
      });
      dispatch.isPending.setIsPending(false);

      dispatch.user.userLogin({
        username: data.username,
        isAuthenticated: true
      });
      localStorage.setItem("username", data.username);
      localStorage.setItem("token", data.token);
      callback();
    },

    //Simply remove token and username from localStorage
    logout({ callback }, state) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      dispatch.user.userLogout();
      callback();
    },

    toggleDarkMode(payload, state) {
      dispatch.user.toggleDarkModeState();
    },

    setDarkMode({ setting }, state) {
      dispatch.user.setDarkModeState(setting);
    }
  })
};
