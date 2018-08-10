import {combineReducers} from 'redux';

import PostReducer from './reducer_posts';
import UserReducer from './reducer_user';
import ErrorReducer from './reducer_error';
import {reducer as formReducer} from 'redux-form';

const rootReducer = combineReducers({
	user: UserReducer,
	posts: PostReducer,
	form: formReducer,
	error: ErrorReducer
});

export default rootReducer;