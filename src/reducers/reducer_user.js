import {
  USER_LOGIN_FULFILLED,
  USER_LOGIN_PENDING,
  USER_LOGIN_REJECTED,
  USER_LOGOUT,
  GET_ALL_USERNAME_FULFILLED,
  USER_SIGNUP_REJECTED
} from "../actions/user";

const initialUserState = {
  isAuthenticated: localStorage.getItem('token')?true:false,
  isFetching: false, 
  username: localStorage.getItem('username'),
  // error: null
};
export default function(state = initialUserState, action) {
  switch (action.type) {
    case USER_LOGIN_PENDING:
      return {
        ...state,
        isFetching: true,
      }
    case USER_LOGIN_REJECTED:
      return {
        ...state,
        isAuthenticated: false,
        isFetching: false,
        // error: action.payload
      };
    case USER_LOGIN_FULFILLED:
      return {
        ...state,
        isAuthenticated: true,
        isFetching: false,
        username: action.payload.data.username
      };
    case USER_SIGNUP_REJECTED:
      return {
        ...state,
        isFetching: false
      }
    case USER_LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        isFetching: false,
        username: null
      }
    case GET_ALL_USERNAME_FULFILLED:
      return {
        ...state,
        userList: action.payload.data.usernameList
      }
    default:
      return state;
  }
}
