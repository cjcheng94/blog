import axios from "axios";
import mapKeys from "lodash/mapKeys";

const ROOT_URL = "https://alexsblogapi.herokuapp.com";

export const posts = {
  state: {},
  reducers: {
    updatePostsInState: (state, payload) => mapKeys(payload, "_id"),
    updateOnePostInState: (state, payload) => ({
      ...state,
      [payload._id]: payload
    })
  },
  effects: dispatch => ({
    async fetchPosts(payload, state) {
      dispatch.isPending.setIsPending(true);
      const {
        data: { post }
      } = await axios.get(`${ROOT_URL}/posts`);
      dispatch.isPending.setIsPending(false);
      dispatch.posts.updatePostsInState(post);
    },

    async fetchPost({ _id }, state) {
      dispatch.isPending.setIsPending(true);
      const { data } = await axios.get(`${ROOT_URL}/posts/${_id}`);
      dispatch.isPending.setIsPending(false);

      dispatch.posts.updateOnePostInState(data);
    },

    async fetchUserPosts(payload, state) {
      dispatch.isPending.setIsPending(true);
      const {
        data: { posts }
      } = axios.get(`${ROOT_URL}/user/${payload}`);
      dispatch.isPending.setIsPending(false);

      dispatch.posts.updatePostsInState(posts);
    },

    // -----------------protected actions-----------------

    //Creates new post
    async createPost({ values, callback }, state) {
      const token = localStorage.getItem("token");
      dispatch.isPending.setIsPending(true);
      await axios({
        baseURL: ROOT_URL,
        url: "/posts",
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        data: values
      });
      dispatch.isPending.setIsPending(false);

      callback();
    },

    //Deletes one post by id
    async deletePost({ _id, callback }, state) {
      const token = localStorage.getItem("token");
      dispatch.isPending.setIsPending(true);
      const request = axios({
        baseURL: ROOT_URL,
        url: `/posts/${_id}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch.isPending.setIsPending(false);
      callback();
    },

    //Updates post
    async updatePost({ _id, requestBody, callback }, state) {
      const token = localStorage.getItem("token");
      dispatch.isPending.setIsPending(true);
      await axios({
        baseURL: ROOT_URL,
        url: `/posts/${_id}`,
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        data: requestBody
      });
      dispatch.isPending.setIsPending(false);
      callback();
    }
  })
};
