import {
  USER_LOGIN_FULFILLED,
  USER_LOGIN_PENDING,
  USER_LOGIN_REJECTED,
  USER_LOGOUT,
  GET_ALL_USERNAME_FULFILLED,
  USER_SIGNUP_REJECTED
} from "../actions/user";
import checkIfExpired from "../middlewares/checkTokenExpired";

const initialUserState = {
  isAuthenticated:
    localStorage.getItem("token") && !checkIfExpired() ? true : false,
  isPending: false,
  username: localStorage.getItem("username")
};
export default function(state = initialUserState, action) {
  switch (action.type) {
    case USER_LOGIN_PENDING:
      return {
        ...state,
        isPending: true
      };
    case USER_LOGIN_REJECTED:
      return {
        ...state,
        isAuthenticated: false,
        isPending: false
        // error: action.payload
      };
    case USER_LOGIN_FULFILLED:
      return {
        ...state,
        isAuthenticated: true,
        isPending: false,
        username: action.payload.data.username
      };
    case USER_SIGNUP_REJECTED:
      return {
        ...state,
        isPending: false
      };
    case USER_LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        isPending: false,
        username: null
      };
    case GET_ALL_USERNAME_FULFILLED:
      return {
        ...state,
        userList: action.payload.data.usernameList
      };
    default:
      return state;
  }
}
