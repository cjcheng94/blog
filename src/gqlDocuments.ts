import { gql } from "@apollo/client";

export const USER_LOGIN = gql`
  query userLogin($username: String!, $password: String!) {
    userLogin(username: $username, password: $password) {
      token
      username
      userId
    }
  }
`;

export const USER_SIGNUP = gql`
  query userSignup($username: String!, $password: String!) {
    userSignup(username: $username, password: $password) {
      _id
      username
    }
  }
`;

export const GET_ALL_POSTS = gql`
  query getAllPosts {
    posts {
      _id
      title
      content
      date
      authorInfo {
        _id
        username
      }
    }
  }
`;

export const CREATE_NEW_POST = gql`
  mutation createPost($title: String!, $content: String!) {
    createPost(title: $title, content: $content) {
      _id
      title
      content
      authorInfo {
        _id
        username
      }
      date
    }
  }
`;

export const GET_USER_POSTS = gql`
  query getUserPosts($_id: String!) {
    getUserPosts(_id: $_id) {
      _id
      title
      authorInfo {
        _id
        username
      }
      content
      date
    }
  }
`;

export const GET_CURRENT_POST = gql`
  query getCurrentPost($_id: String!) {
    getPostById(_id: $_id) {
      _id
      title
      authorInfo {
        _id
        username
      }
      content
      date
    }
  }
`;

export const GET_CACHED_POST_FRAGMENT = gql`
  fragment MyPost on Post {
    _id
    title
    content
    date
    authorInfo {
      _id
      username
    }
  }
`;

export const UPDATE_POST = gql`
  mutation updatePost($_id: String!, $title: String!, $content: String!) {
    updatePost(_id: $_id, title: $title, content: $content) {
      _id
      title
      authorInfo {
        _id
        username
      }
      content
      date
    }
  }
`;

export const DELETE_POST = gql`
  mutation deletePost($_id: String!) {
    deletePost(_id: $_id) {
      _id
    }
  }
`;

export const GET_IS_DARK_MODE = gql`
  query getIsDarkMode {
    isDarkMode @client
  }
`;

export const GET_IS_LOADING = gql`
  query getIsLoading {
    isLoading @client
  }
`;
