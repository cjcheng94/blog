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
      # content
      contentText
      date
      tagIds
      thumbnailUrl
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
      contentText
      date
      tagIds
      thumbnailUrl
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
      contentText
      date
      tagIds
      thumbnailUrl
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
      contentText
      date
      tagIds
      thumbnailUrl
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
  mutation createPost(
    $title: String!
    $content: String!
    $contentText: String!
    $tagIds: [ID]!
  ) {
    createPost(
      title: $title
      content: $content
      contentText: $contentText
      tagIds: $tagIds
    ) {
      _id
      title
      content
      contentText
      date
      tagIds
      thumbnailUrl
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
    $contentText: String!
    $tagIds: [ID]!
  ) {
    updatePost(
      _id: $_id
      title: $title
      content: $content
      contentText: $contentText
      tagIds: $tagIds
    ) {
      _id
      title
      content
      contentText
      date
      tagIds
      thumbnailUrl
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
      contentText
      date
      tagIds
      thumbnailUrl
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

// Draft Documents
export const GET_DRAFT_BY_ID = gql`
  query getDraftById($_id: String!) {
    getDraftById(_id: $_id) {
      _id
      postId
      title
      author
      content
      contentText
      date
      tagIds
      tags {
        _id
        name
      }
    }
  }
`;

export const GET_DRAFT_BY_POSTID = gql`
  query getDraftByPostId($postId: ID!) {
    getDraftByPostId(postId: $postId) {
      _id
      postId
      title
      author
      content
      contentText
      date
      tagIds
      tags {
        _id
        name
      }
    }
  }
`;

export const GET_USER_DRAFTS = gql`
  query getUserDrafts {
    getUserDrafts {
      _id
      postId
      title
      author
      content
      contentText
      date
      tagIds
      tags {
        _id
        name
      }
    }
  }
`;

export const CREATE_DRAFT = gql`
  mutation createDraft(
    $title: String!
    $content: String!
    $contentText: String!
    $tagIds: [ID]!
    $postId: ID
  ) {
    createDraft(
      title: $title
      content: $content
      contentText: $contentText
      tagIds: $tagIds
      postId: $postId
    ) {
      _id
      postId
      title
      author
      content
      contentText
      date
      tagIds
      tags {
        _id
        name
      }
    }
  }
`;

export const UPDATE_DRAFT = gql`
  mutation updateDraft(
    $_id: String!
    $title: String!
    $content: String!
    $contentText: String!
    $tagIds: [ID]!
    $postId: ID
  ) {
    updateDraft(
      _id: $_id
      title: $title
      content: $content
      contentText: $contentText
      tagIds: $tagIds
      postId: $postId
    ) {
      _id
      postId
      title
      author
      content
      contentText
      date
      tagIds
      tags {
        _id
        name
      }
    }
  }
`;

export const DELETE_DRAFT = gql`
  mutation deleteDraft($_id: String!) {
    deleteDraft(_id: $_id) {
      _id
      title
      author
      content
      contentText
      date
      tagIds
      tags {
        _id
        name
      }
    }
  }
`;

// Image Document
export const GET_IMAGE = gql`
  query getImage($_id: ID!) {
    image(_id: $_id) {
      _id
      caption
    }
  }
`;

export const CREATE_IMAGE = gql`
  mutation createImage($caption: String!) {
    createImage(caption: $caption) {
      _id
      caption
    }
  }
`;

export const UPDATE_IMAGE = gql`
  mutation updateImage($_id: ID!, $caption: String!) {
    updateImage(_id: $_id, caption: $caption) {
      _id
      caption
    }
  }
`;

export const DELETE_IMAGE = gql`
  mutation deleteImage($_id: ID!) {
    deleteImage(_id: $_id) {
      _id
      caption
    }
  }
`;

// Local Documents
export const GET_CACHED_POST_FRAGMENT = gql`
  fragment MyPost on Post {
    _id
    title
    content
    contentText
    date
    tagIds
    thumbnailUrl
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

export const GET_CACHED_DRAFT_FRAGMENT = gql`
  fragment MyDraft on Draft {
    _id
    postId
    title
    author
    content
    contentText
    date
    tagIds
    tags {
      _id
      name
    }
  }
`;
