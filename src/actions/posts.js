import axios from "axios";

const FETCH_POSTS = "FETCH_POSTS";
const FETCH_POST = "FETCH_POST";
const CREATE_POST = "CREATE_POST";
const DELETE_POST = "DELETE_POST";
const UPDATE_POST = "UPDATE_POST";
const FETCH_PROFILE = "FETCH_PROFILE";

export const FETCH_POSTS_FULFILLED = "FETCH_POSTS_FULFILLED";
export const FETCH_POST_FULFILLED = "FETCH_POST_FULFILLED";
export const CREATE_POST_FULFILLED = "CREATE_POST_FULFILLED";
export const UPDATE_POST_FULFILLED = "UPDATE_POST_FULFILLED";
export const DELETE_POST_FULFILLED = "DELETE_POST_FULFILLED";
export const FETCH_PROFILE_FULFILLED = "FETCH_PROFILE_FULFILLED";

export const FETCH_POSTS_PENDING = "FETCH_POSTS_PENDING";
export const FETCH_POST_PENDING = "FETCH_POST_PENDING";
export const CREATE_POST_PENDING = "CREATE_POST_PENDING";
export const UPDATE_POST_PENDING = "UPDATE_POST_PENDING";
export const DELETE_POST_PENDING = "DELETE_POST_PENDING";
export const FETCH_PROFILE_PENDING = "FETCH_PROFILE_PENDING";

export const FETCH_POSTS_REJECTED = "FETCH_POSTS_REJECTED";
export const FETCH_POST_REJECTED = "FETCH_POST_REJECTED";
export const CREATE_POST_REJECTED = "CREATE_POST_REJECTED";
export const UPDATE_POST_REJECTED = "UPDATE_POST_REJECTED";
export const DELETE_POST_REJECTED = "DELETE_POST_REJECTED";
export const FETCH_PROFILE_REJECTED = "FETCH_PROFILE_REJECTED";

const ROOT_URL = "https://alexsapiblog.herokuapp.com";

//Fetchs all posts
export function fetchPosts() {
  const request = axios.get(`${ROOT_URL}/posts`);
  return {
    type: FETCH_POSTS,
    payload: request
  };
}

//Fetchs one post by id
export function fetchPost(_id) {
  const request = axios.get(`${ROOT_URL}/posts/${_id}`);
  return {
    type: FETCH_POST,
    payload: request
  };
}

//Fetchs posts written by a specific user
export function fetchUserPosts(username) {
  const request = axios.get(`${ROOT_URL}/user/${username}`);
  return {
    type: FETCH_PROFILE,
    payload: request
  };
}

// -----------------protected actions-----------------
//Creates new post
export function createPost(values, callback) {
  const token = localStorage.getItem("token");
  const request = axios({
    baseURL: ROOT_URL,
    url: "/posts",
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    data: values
  }).then(() => callback());
  return {
    type: CREATE_POST,
    payload: request
  };
}

//Deletes one post by id
export function deletePost(_id, callback) {
  const token = localStorage.getItem("token");
  const request = axios({
    baseURL: ROOT_URL,
    url: `/posts/${_id}`,
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  }).then(() => callback());
  return {
    type: DELETE_POST,
    payload: request
  };
}

//Updates post
export function updatePost(_id, values, callback) {
  const token = localStorage.getItem("token");
  const request = axios({
    baseURL: ROOT_URL,
    url: `/posts/${_id}`,
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    data: values
  }).then(() => callback());
  return {
    type: UPDATE_POST,
    payload: request
  };
}
