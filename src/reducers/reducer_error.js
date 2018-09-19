// Concise rewrite:
const errorReducer = (state = {}, action) => {
  switch (true) {
    case action.type.includes("REJECTED"):
      return {
        ...state,
        status: action.payload.response.status,
        statusText: action.payload.response.statusText,
        message: action.payload.response.data.message
      };
    case action.type.includes("FULFILLED"):
    case action.type.includes("PENDING"):
    case action.type === "CLEAR_ERROR":
      return {
        ...state,
        status: null,
        statusText: null,
        message: null
      };
    default:
      return state;
  }
};
export default errorReducer;

// Verbose version:

// import {
//   FETCH_POSTS_FULFILLED,
//   FETCH_POST_FULFILLED,
//   CREATE_POST_FULFILLED,
//   UPDATE_POST_FULFILLED,
//   DELETE_POST_FULFILLED,
//   FETCH_PROFILE_FULFILLED,
//   FETCH_POSTS_PENDING,
//   FETCH_POST_PENDING,
//   CREATE_POST_PENDING,
//   UPDATE_POST_PENDING,
//   DELETE_POST_PENDING,
//   FETCH_PROFILE_PENDING,
//   FETCH_POSTS_REJECTED,
//   FETCH_POST_REJECTED,
//   CREATE_POST_REJECTED,
//   UPDATE_POST_REJECTED,
//   DELETE_POST_REJECTED,
//   FETCH_PROFILE_REJECTED
// } from "../actions/posts";

// import {
//   USER_LOGIN_PENDING,
//   USER_LOGIN_FULFILLED,
//   USER_LOGIN_REJECTED,
//   USER_SIGNUP_PENDING,
//   USER_SIGNUP_FULFILLED,
//   USER_SIGNUP_REJECTED
// } from "../actions/user";

// import { CLEAR_ERROR } from "../actions/clearError";

// const errorReducer = (state = {}, action) => {
//   switch (action.type) {
//     case FETCH_POSTS_REJECTED:
//     case FETCH_POST_REJECTED:
//     case CREATE_POST_REJECTED:
//     case UPDATE_POST_REJECTED:
//     case DELETE_POST_REJECTED:
//     case USER_LOGIN_REJECTED:
//     case USER_SIGNUP_REJECTED:
//     case FETCH_PROFILE_REJECTED:
//       return {
//         ...state,
//         status: action.payload.response.status,
//         statusText: action.payload.response.statusText,
//         message: action.payload.response.data.message
//       };
//     case FETCH_POSTS_FULFILLED:
//     case FETCH_POST_FULFILLED:
//     case CREATE_POST_FULFILLED:
//     case UPDATE_POST_FULFILLED:
//     case DELETE_POST_FULFILLED:
//     case USER_SIGNUP_FULFILLED:
//     case USER_LOGIN_FULFILLED:
//     case FETCH_PROFILE_FULFILLED:
//     case FETCH_POSTS_PENDING:
//     case FETCH_POST_PENDING:
//     case CREATE_POST_PENDING:
//     case UPDATE_POST_PENDING:
//     case DELETE_POST_PENDING:
//     case USER_SIGNUP_PENDING:
//     case USER_LOGIN_PENDING:
//     case FETCH_PROFILE_PENDING:
//     case CLEAR_ERROR:
//       return {
//         ...state,
//         status: null,
//         statusText: null,
//         message: null
//       };
//     default:
//       return state;
//   }
// };
// export default errorReducer;
