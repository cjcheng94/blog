import axios from "axios";

const ROOT_URL = "https://alexsapiblog.herokuapp.com";

const USER_LOGIN = "USER_LOGIN";
const USER_SIGNUP = "USER_SIGNUP";
export const USER_LOGOUT = "USER_LOGOUT";

export const USER_LOGIN_PENDING = "USER_LOGIN_PENDING";
export const USER_LOGIN_FULFILLED = "USER_LOGIN_FULFILLED";
export const USER_LOGIN_REJECTED = "USER_LOGIN_REJECTED";

export function userLogin(loginData, cb) {
  return dispatch => {
    const request = axios({
      baseURL: ROOT_URL,
      url: "/user/login",
      method: "POST",
      data: loginData
    });
    return dispatch({
      type: USER_LOGIN,
      payload: request,
      username: loginData.username
    }).then(resolved => {
      // resolved = {
      //   action:{type: "USER_LOGIN_FULFILLED", payload: {...}
      //   value: {same as action.payload on line above}
      // }
      localStorage.setItem('username', loginData.username);
      localStorage.setItem("token", resolved.value.data.token);
      cb();
    });
  };
}

export function userLogout(cb) {
  return dispatch => {
    dispatch({ type: USER_LOGOUT });
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    cb();
  };
}

export function userSignup(signUpData, cb) {
  const request = axios({
    baseURL: ROOT_URL,
    url: "/user/signup",
    method: "POST",
    data: signUpData
  }).then(() => cb());
  return {
    type: USER_SIGNUP,
    payload: request
  };
}
