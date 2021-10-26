import { gql } from "@apollo/client";

// User Documents
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

// Post Documents
export const GET_ALL_POSTS = gql`
  query getAllPosts {
    posts {
      _id
      title
      content
      date
      tagIds
      tags {
        _id
        name
      }
      authorInfo {
        _id
        username
      }
    }
  }
`;

export const GET_CURRENT_POST = gql`
  query getCurrentPost($_id: String!) {
    getPostById(_id: $_id) {
      _id
      title
      content
      date
      tagIds
      tags {
        _id
        name
      }
      authorInfo {
        _id
        username
      }
    }
  }
`;

export const GET_USER_POSTS = gql`
  query getUserPosts($_id: String!) {
    getUserPosts(_id: $_id) {
      _id
      title
      content
      date
      tagIds
      tags {
        _id
        name
      }
      authorInfo {
        _id
        username
      }
    }
  }
`;

export const GET_POSTS_BY_TAGS = gql`
  query getPostsByTags($tagIds: [ID]!) {
    getPostsByTags(tagIds: $tagIds) {
      _id
      title
      content
      date
      tagIds
      tags {
        _id
        name
      }
      authorInfo {
        _id
        username
      }
    }
  }
`;

export const CREATE_NEW_POST = gql`
  mutation createPost($title: String!, $content: String!, $tagIds: [ID]!) {
    createPost(title: $title, content: $content, tagIds: $tagIds) {
      _id
      title
      content
      date
      tagIds
      tags {
        _id
        name
      }
      authorInfo {
        _id
        username
      }
    }
  }
`;

export const UPDATE_POST = gql`
  mutation updatePost(
    $_id: String!
    $title: String!
    $content: String!
    $tagIds: [ID]!
  ) {
    updatePost(_id: $_id, title: $title, content: $content, tagIds: $tagIds) {
      _id
      title
      content
      date
      tagIds
      tags {
        _id
        name
      }
      authorInfo {
        _id
        username
      }
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

// Search Document
export const SEARCH = gql`
  query search($searchTerm: String!, $tagIds: [ID]) {
    search(searchTerm: $searchTerm, tagIds: $tagIds) {
      _id
      title
      content
      date
      tagIds
      tags {
        _id
        name
      }
      authorInfo {
        _id
        username
      }
    }
  }
`;

// Tag Documents
export const GET_ALL_TAGS = gql`
  query getAllTags {
    tags {
      _id
      name
    }
  }
`;

export const GET_TAG_BY_ID = gql`
  query getTagsById($_id: ID!) {
    tag(_id: $_id) {
      _id
      name
    }
  }
`;

export const CREATE_TAG = gql`
  mutation createTag($name: String!) {
    createTag(name: $name) {
      _id
      name
    }
  }
`;

export const DELETE_TAG = gql`
  mutation deleteTag($tagId: ID!) {
    deleteTag(tagId: $tagId) {
      _id
      name
    }
  }
`;
// Local Documents
export const GET_CACHED_POST_FRAGMENT = gql`
  fragment MyPost on Post {
    _id
    title
    content
    date
    tagIds
    tags {
      _id
      name
    }
    authorInfo {
      _id
      username
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

export const GET_SHOW_SEARCH_OVERLAY = gql`
  query getShowSearchOverlay {
    showSearchOverlay @client
  }
`;
