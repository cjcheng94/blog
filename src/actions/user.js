import axios from "axios";

const ROOT_URL = "https://alexsapiblog.herokuapp.com";

export const USER_LOGIN = 'user_login';
export const USER_SIGNUP = 'user_signup';

export function userLogin(loginData,cb){
  const request = axios({
    baseURL: ROOT_URL,
    url: '/user/login',
    method: 'POST',
    data: loginData
  });
  request.then(()=>cb());
  return {
    type: USER_LOGIN,
    payload: request
  }
}

export function userSignup(signUpData, cb){
  const request = axios({
    baseURL: ROOT_URL,
    url: '/user/signup',
    method: 'POST',
    data: signUpData
  }).then(()=>cb());
  return {
    type: USER_SIGNUP,
    payload: request
  }
}
