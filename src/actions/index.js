import axios from "axios";

const FETCH_POSTS = 'FETCH_POSTS'
const FETCH_POST = 'FETCH_POST'

export const FETCH_POSTS_FULFILLED = "FETCH_POSTS_FULFILLED";
export const FETCH_POST_FULFILLED = "FETCH_POST_FULFILLED";
export const CREATE_POST = "CREATE_POST";
export const DELETE_POST = "DELETE_POST";
export const UPDATE_POST = "UPDATE_POST";

const ROOT_URL = "https://alexsapiblog.herokuapp.com";

export function fetchPosts() {
	const request = axios.get(`${ROOT_URL}/posts`);
	return {
		type: FETCH_POSTS,
		payload: request
	};
}

export function fetchPost(_id) {
	const request = axios.get(`${ROOT_URL}/posts/${_id}`);
	return {
		type: FETCH_POST,
		payload: request
	};
}

export function createPost(values, callback) {
	const request = axios
		.post(`${ROOT_URL}/posts`, values)
		.then(() => callback());
	return {
		type: CREATE_POST,
		payload: request
	};
}

export function deletePost(_id, callback) {
	const request = axios
		.delete(`${ROOT_URL}/posts/${_id}`)
		.then(() => callback());

	return {
		type: DELETE_POST,
		payload: request
	};
}

export function updatePost(_id, values, callback) {
	const request = axios
		.patch(`${ROOT_URL}/posts/${_id}`, values)
		.then(() => callback());
	return {
		type: UPDATE_POST,
		payload: request
	};
}
