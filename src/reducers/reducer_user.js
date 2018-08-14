import {
  USER_LOGIN_FULFILLED,
  USER_LOGIN_REJECTED,
  USER_LOGOUT,
} from "../actions/user";

import checkIfExpired from "../middlewares/checkTokenExpired";

const initialUserState = {
  isAuthenticated:
    localStorage.getItem("token") && !checkIfExpired() ? true : false,
  username: localStorage.getItem("username")
};

 const userReducer = (state = initialUserState, action)=> {
  switch (action.type) {
    case USER_LOGIN_REJECTED:
      return {
        ...state,
        isAuthenticated: false,
      };
    case USER_LOGIN_FULFILLED:
      return {
        ...state,
        isAuthenticated: true,
        username: action.payload.data.username
      };
    case USER_LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        username: null
      };
    default:
      return state;
  }
}
export default userReducer;