import { combineReducers } from "redux";
import deepFreeze from "deep-freeze";
import expect from 'expect'
import {
  FETCH_POSTS_FULFILLED,
  FETCH_POST_FULFILLED,
  FETCH_POSTS_PENDING,
  FETCH_POST_PENDING,
  CREATE_POST_PENDING,
  UPDATE_POST_PENDING,
  DELETE_POST_PENDING,
  FETCH_POSTS_REJECTED,
  FETCH_POST_REJECTED,
  CREATE_POST_REJECTED,
  UPDATE_POST_REJECTED,
  DELETE_POST_REJECTED
} from "../actions/posts";
import _ from "lodash";

//state design -> {_id: {post object}} ->
//{
//	5: {title: 'hello', author: 'John Doe', content: '...'},
//	12: {title: 'bye', author: 'Jane Doe', content: '...'},
//}
//for easier lookup/manipulation

// const initialPostsState = {
//   isFetching: true,
//   postsData: {},
//   error: null
// };

function postDataReducer(state = {}, action) {
  switch (action.type) {
    case FETCH_POSTS_FULFILLED:
      return _.mapKeys(action.payload.data.post, "_id");
    case FETCH_POST_FULFILLED:
      return { ...state, [action.payload.data._id]: action.payload.data };
    default:
      return state;
  }
}

function isFetchingReducer(state = false, action) {
  switch (action.type) {
    case FETCH_POSTS_PENDING:
    case FETCH_POST_PENDING:
    case CREATE_POST_PENDING:
    case UPDATE_POST_PENDING:
    case DELETE_POST_PENDING:
    //flag, not right here, FIX!
      return true;
    default:
      return state;
  }
}

function errorReducer(state = "", action) {
  return state;
}

const postReducer = combineReducers({
  postData: postDataReducer,
  isFetching: isFetchingReducer,
  error: errorReducer
});
//same as
// function postReducer(state.., action){
//   return {
//     postData: postDataReducer(state.., action),
//     isFetching: isFetchingReducer(state.., action),
//     ...
//   }
// }

export default postReducer;
