import axios from "axios";
import mapKeys from "lodash/mapKeys";
import { Dispatch } from "../store";
import {
  Post,
  PostsList,
  PostsHub,
  CreatePostPayload,
  DeletePostPayload,
  UpdatePostPayload
} from "PostTypes";

const ROOT_URL = "https://alexsblogapi.herokuapp.com";

type Posts = {
  state: PostsHub;
  reducers: {
    [key: string]: (state: PostsHub, payload: any) => PostsHub;
  };
  effects: (
    dispatch: Dispatch
  ) => {
    [key: string]: (payload: any, state: PostsHub) => Promise<void>;
  };
};

export const posts: Posts = {
  state: {},
  reducers: {
    updatePostsInState: (state: PostsHub, payload: PostsList): PostsHub =>
      mapKeys(payload, "_id"),

    updateOnePostInState: (state: PostsHub, payload: Post) => ({
      ...state,
      [payload._id]: payload
    })
  },
  effects: (dispatch: Dispatch) => ({
    async fetchPosts(payload: any, state: PostsHub) {
      dispatch.isPending.setIsPending(true);
      try {
        const { data } = await axios.get(`${ROOT_URL}/posts`);
        const posts: PostsList = data.post;
        dispatch.posts.updatePostsInState(posts);
      } catch (error) {
        dispatch.error.setError({
          status: error.response.status,
          statusText: error.response.statusText,
          message: error.message
        });
      }
      dispatch.isPending.setIsPending(false);
    },

    async fetchPost({ _id }: { _id: string }, state: PostsHub) {
      dispatch.isPending.setIsPending(true);
      try {
        const { data }: { data: Post } = await axios.get(
          `${ROOT_URL}/posts/${_id}`
        );
        dispatch.posts.updateOnePostInState(data);
      } catch (error) {
        dispatch.error.setError({
          status: error.response.status,
          statusText: error.response.statusText,
          message: error.message
        });
      }
      dispatch.isPending.setIsPending(false);
    },

    async fetchUserPosts({ username }: { username: string }, state: PostsHub) {
      dispatch.isPending.setIsPending(true);
      try {
        const { data } = await axios.get(`${ROOT_URL}/user/${username}`);
        const posts: PostsList = data.posts;
        dispatch.posts.updatePostsInState(posts);
      } catch (error) {
        dispatch.error.setError({
          status: error.response.status,
          statusText: error.response.statusText,
          message: error.message
        });
      }
      dispatch.isPending.setIsPending(false);
    },

    // -----------------protected actions-----------------

    //Creates new post
    async createPost(payload: CreatePostPayload, state: PostsHub) {
      const values = payload.values;
      const callback = payload.callback;
      const token = localStorage.getItem("token");

      dispatch.isPending.setIsPending(true);
      try {
        await axios({
          baseURL: ROOT_URL,
          url: "/posts",
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          data: values
        });
        callback();
      } catch (error) {
        dispatch.error.setError({
          status: error.response.status,
          statusText: error.response.statusText,
          message: error.message
        });
      }
      dispatch.isPending.setIsPending(false);
    },

    //Deletes one post by id
    async deletePost(payload: DeletePostPayload, state: PostsHub) {
      const { _id, callback } = payload;
      const token = localStorage.getItem("token");
      dispatch.isPending.setIsPending(true);
      try {
        await axios({
          baseURL: ROOT_URL,
          url: `/posts/${_id}`,
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        callback();
      } catch (error) {
        dispatch.error.setError({
          status: error.response.status,
          statusText: error.response.statusText,
          message: error.message
        });
      }
      dispatch.isPending.setIsPending(false);
    },

    //Updates post
    async updatePost(payload: UpdatePostPayload, state: PostsHub) {
      const { _id, requestBody, callback } = payload;
      const token = localStorage.getItem("token");
      dispatch.isPending.setIsPending(true);
      try {
        await axios({
          baseURL: ROOT_URL,
          url: `/posts/${_id}`,
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          data: requestBody
        });
        callback();
      } catch (error) {
        dispatch.error.setError({
          status: error.response.status,
          statusText: error.response.statusText,
          message: error.message
        });
      }
      dispatch.isPending.setIsPending(false);
    }
  })
};
