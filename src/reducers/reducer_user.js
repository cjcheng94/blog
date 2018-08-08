import {
  USER_LOGIN_FULFILLED,
  USER_LOGIN_PENDING,
  USER_LOGIN_REJECTED,
  USER_LOGOUT
} from "../actions/user";

const initialUserState = {
  isAuthenticated: localStorage.getItem('token')?true:false,
  isFetching: false, 
  username: localStorage.getItem('username')
  // error: null
};
export default function(state = initialUserState, action) {
  switch (action.type) {
    case USER_LOGIN_PENDING:
      return {
        ...state,
        isFetching: true
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
        isFetching: false
      };
    case USER_LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        isFetching: false
      }
    default:
      return state;
  }
}
