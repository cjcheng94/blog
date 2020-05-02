import axios from "axios";
import mapKeys from "lodash/mapKeys";
import { Dispatch } from "../store";

const ROOT_URL = "https://alexsblogapi.herokuapp.com";

export type Post = {
  _id: string;
  author: string;
  content: string;
  date: string;
  title: string;
  request: {
    type: string;
    url: string;
  };
};
export type PostsList = [Post];
export type PostsState = {
  [_id: string]: Post;
};

export type CreatePostPayload = {
  values: { title: string; content: string };
  callback: () => {};
};
export type DeletePostPayload = {
  _id: string;
  callback: () => {};
};
export type UpdatePostPayload = {
  _id: string;
  callback: () => {};
  requestBody: { propName: string; value: string }[];
};

export const posts = {
  state: {},
  reducers: {
    updatePostsInState: (state: PostsState, payload: PostsList) =>
      mapKeys(payload, "_id"),

    updateOnePostInState: (state: PostsState, payload: Post) => ({
      ...state,
      [payload._id]: payload
    })
  },
  effects: (dispatch: Dispatch) => ({
    async fetchPosts(payload: any, state: PostsState) {
      dispatch.isPending.setIsPending(true);

      const { data } = await axios.get(`${ROOT_URL}/posts`);
      const posts: PostsList = data.post;

      dispatch.isPending.setIsPending(false);
      dispatch.posts.updatePostsInState(posts);
    },

    async fetchPost({ _id }: { _id: string }, state: PostsState) {
      dispatch.isPending.setIsPending(true);

      const { data }: { data: Post } = await axios.get(
        `${ROOT_URL}/posts/${_id}`
      );

      dispatch.isPending.setIsPending(false);
      dispatch.posts.updateOnePostInState(data);
    },

    async fetchUserPosts(
      { username }: { username: string },
      state: PostsState
    ) {
      dispatch.isPending.setIsPending(true);

      const { data } = await axios.get(`${ROOT_URL}/user/${username}`);
      const posts: PostsList = data.posts;

      dispatch.isPending.setIsPending(false);
      dispatch.posts.updatePostsInState(posts);
    },

    // -----------------protected actions-----------------

    //Creates new post
    async createPost(payload: CreatePostPayload, state: PostsState) {
      const values = payload.values;
      const callback = payload.callback;
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
    async deletePost(payload: DeletePostPayload, state: PostsState) {
      const { _id, callback } = payload;
      const token = localStorage.getItem("token");
      dispatch.isPending.setIsPending(true);

      await axios({
        baseURL: ROOT_URL,
        url: `/posts/${_id}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      dispatch.isPending.setIsPending(false);
      callback();
    },

    //Updates post
    async updatePost(payload: UpdatePostPayload, state: PostsState) {
      const { _id, requestBody, callback } = payload;
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
