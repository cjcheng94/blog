import { combineReducers } from "redux";

import {
  FETCH_POSTS_FULFILLED,
  FETCH_POST_FULFILLED,
  CREATE_POST_FULFILLED,
  UPDATE_POST_FULFILLED,
  DELETE_POST_FULFILLED,
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

// const initialPostsState = {
//   isPending: false,
//   postsData: {}
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

function isPendingReducer(state = false, action) {
  switch (action.type) {
    case FETCH_POSTS_PENDING:
    case FETCH_POST_PENDING:
    case CREATE_POST_PENDING:
    case UPDATE_POST_PENDING:
    case DELETE_POST_PENDING:
      return true;
    case FETCH_POSTS_FULFILLED:
    case FETCH_POST_FULFILLED:
    case CREATE_POST_FULFILLED:
    case UPDATE_POST_FULFILLED:
    case DELETE_POST_FULFILLED:
    case FETCH_POSTS_REJECTED:
    case FETCH_POST_REJECTED:
    case CREATE_POST_REJECTED:
    case UPDATE_POST_REJECTED:
    case DELETE_POST_REJECTED:
      return false;
    default:
      return state;
  }
}

const postReducer = combineReducers({
  postData: postDataReducer,
  isPending: isPendingReducer
});

export default postReducer;
