import { FETCH_POSTS, FETCH_POST } from "../actions/index";
import _ from "lodash";

export default function(state = {}, action) {
	switch (action.type) {
		case FETCH_POSTS:
		 return _.mapKeys(action.payload.data.post, "_id");
		case FETCH_POST:
			return {...state, [action.payload.data._id]:action.payload.data}
		default:
			return state;
	}
}
