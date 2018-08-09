import axios from "axios";

const FETCH_POSTS = "FETCH_POSTS";
const FETCH_POST = "FETCH_POST";
const CREATE_POST = "CREATE_POST";
const DELETE_POST = "DELETE_POST";
const UPDATE_POST = "UPDATE_POST";

export const FETCH_POSTS_FULFILLED = "FETCH_POSTS_FULFILLED";
export const FETCH_POST_FULFILLED = "FETCH_POST_FULFILLED";
// export const CREATE_POST_FULFILLED = "CREATE_POST_FULFILLED";
// export const UPDATE_POST_FULFILLED = "UPDATE_POST_FULFILLED";
// export const DELETE_POST_FULFILLED = "DELETE_POST_FULFILLED";

export const FETCH_POSTS_PENDING = "FETCH_POSTS_PENDING";
export const FETCH_POST_PENDING = "FETCH_POST_PENDING";
export const CREATE_POST_PENDING = "CREATE_POST_PENDING";
export const UPDATE_POST_PENDING = "UPDATE_POST_PENDING";
export const DELETE_POST_PENDING = "DELETE_POST_PENDING";

export const FETCH_POSTS_REJECTED = "FETCH_POSTS_REJECTED";
export const FETCH_POST_REJECTED = "FETCH_POST_REJECTED";
export const CREATE_POST_REJECTED = "CREATE_POST_REJECTED";
export const UPDATE_POST_REJECTED = "UPDATE_POST_REJECTED";
export const DELETE_POST_REJECTED = "DELETE_POST_REJECTED";

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

// protected requests
export function createPost(values, callback) {
  const token = localStorage.getItem("token");
  return dispatch => {
    const request = axios({
      baseURL: ROOT_URL,
      url: "/posts",
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      data: values
    });
    return dispatch({
      type: CREATE_POST,
      payload: request
    }).then(() => callback());
  };
}

export function deletePost(_id, callback) {
  const token = localStorage.getItem("token");
  return dispatch => {
    const request = axios({
      baseURL: ROOT_URL,
      url: `/posts/${_id}`,
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    return dispatch({
      type: DELETE_POST,
      payload: request
    }).then(() => callback());
  };
}

export function updatePost(_id, values, callback) {
  const token = localStorage.getItem("token");
  return dispatch => {
    const request = axios({
      baseURL: ROOT_URL,
      url: `/posts/${_id}`,
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      data: values
    });
    return dispatch({
      type: UPDATE_POST,
      payload: request
    }).then(() => callback());
  };
}
