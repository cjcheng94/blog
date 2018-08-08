import { FETCH_POSTS_FULFILLED, FETCH_POST_FULFILLED } from "../actions/index";
import _ from "lodash";

//state design -> {_id: {post object}} ->
//{
//	5: {title: 'hello', author: 'John Doe', content: '...'},
//	12: {title: 'bye', author: 'Jane Doe', content: '...'},
//}
//for easier lookup/manipulation

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_POSTS_FULFILLED:
      return _.mapKeys(action.payload.data.post, "_id");
    case FETCH_POST_FULFILLED:
      return { ...state, [action.payload.data._id]: action.payload.data };
    default:
      return state;
  }
}
