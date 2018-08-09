import axios from "axios";

const ROOT_URL = "https://alexsapiblog.herokuapp.com";

const USER_LOGIN = "USER_LOGIN";
const USER_SIGNUP = "USER_SIGNUP";
export const USER_LOGOUT = "USER_LOGOUT";

export const USER_LOGIN_PENDING = "USER_LOGIN_PENDING";
export const USER_LOGIN_FULFILLED = "USER_LOGIN_FULFILLED";
export const USER_LOGIN_REJECTED = "USER_LOGIN_REJECTED";

export function userLogin(loginData, callback) {
  return dispatch => {    
    const request = axios({
      baseURL: ROOT_URL,
      url: "/user/login",
      method: "POST",
      data: loginData
    });    
    return dispatch({
      type: USER_LOGIN,
      payload: request
    }).then(({value}) => {  
      //    ▼      ▼    
      // {
      //   action:{type: "USER_LOGIN_FULFILLED", payload: {...}
      //   value: {same as action.payload on line above}
      // }
      localStorage.setItem('username', value.data.username)
      localStorage.setItem("token", value.data.token);
      callback();
    });
  };
}

export function userLogout(callback) {
  return dispatch => {
    dispatch({ type: USER_LOGOUT });
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    callback();
  };
}

export function userSignup(signUpData, callback) {
  const request = axios({
    baseURL: ROOT_URL,
    url: "/user/signup",
    method: "POST",
    data: signUpData
  }).then(() => callback());
  return {
    type: USER_SIGNUP,
    payload: request
  };
}
