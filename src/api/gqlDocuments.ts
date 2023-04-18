import { gql } from "../gql";

// User Documents
export const USER_LOGIN = gql(/* GraphQL */ `
  query userLogin($username: String!, $password: String!) {
    userLogin(username: $username, password: $password) {
      token
      username
      userId
    }
  }
`);

export const USER_SIGNUP = gql(/* GraphQL */ `
  query userSignup($username: String!, $password: String!) {
    userSignup(username: $username, password: $password)
  }
`);

// Post Documents
export const GET_ALL_POSTS = gql(/* GraphQL */ `
  query getAllPosts($first: Int, $last: Int, $before: String, $after: String) {
    posts(first: $first, last: $last, before: $before, after: $after) {
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
      }
      edges {
        cursor
        node {
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
    }
  }
`);

export const GET_CURRENT_POST = gql(/* GraphQL */ `
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
`);

export const GET_USER_POSTS = gql(/* GraphQL */ `
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
`);

export const GET_POSTS_BY_TAGS = gql(/* GraphQL */ `
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
`);

export const CREATE_NEW_POST = gql(/* GraphQL */ `
  mutation createPost(
    $title: String!
    $content: String!
    $contentText: String!
    $tagIds: [ID]!
    $thumbnailUrl: String
  ) {
    createPost(
      title: $title
      content: $content
      contentText: $contentText
      tagIds: $tagIds
      thumbnailUrl: $thumbnailUrl
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
`);

export const UPDATE_POST = gql(/* GraphQL */ `
  mutation updatePost(
    $_id: String!
    $title: String!
    $content: String!
    $contentText: String!
    $tagIds: [ID]!
    $thumbnailUrl: String
  ) {
    updatePost(
      _id: $_id
      title: $title
      content: $content
      contentText: $contentText
      tagIds: $tagIds
      thumbnailUrl: $thumbnailUrl
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
`);

export const DELETE_POST = gql(/* GraphQL */ `
  mutation deletePost($_id: String!) {
    deletePost(_id: $_id) {
      _id
    }
  }
`);

// Search Document
export const SEARCH = gql(/* GraphQL */ `
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
`);

// Tag Documents
export const GET_ALL_TAGS = gql(/* GraphQL */ `
  query getAllTags {
    tags {
      _id
      name
    }
  }
`);

export const GET_TAG_BY_ID = gql(/* GraphQL */ `
  query getTagsById($_id: ID!) {
    tag(_id: $_id) {
      _id
      name
    }
  }
`);

export const CREATE_TAG = gql(/* GraphQL */ `
  mutation createTag($name: String!) {
    createTag(name: $name) {
      _id
      name
    }
  }
`);

export const DELETE_TAG = gql(/* GraphQL */ `
  mutation deleteTag($tagId: ID!) {
    deleteTag(tagId: $tagId) {
      _id
      name
    }
  }
`);

// Draft Documents
export const GET_DRAFT_BY_ID = gql(/* GraphQL */ `
  query getDraftById($_id: String!) {
    getDraftById(_id: $_id) {
      _id
      postId
      title
      author
      content
      contentText
      thumbnailUrl
      date
      tagIds
      tags {
        _id
        name
      }
    }
  }
`);

export const GET_DRAFT_BY_POSTID = gql(/* GraphQL */ `
  query getDraftByPostId($postId: ID!) {
    getDraftByPostId(postId: $postId) {
      _id
      postId
      title
      author
      content
      contentText
      thumbnailUrl
      date
      tagIds
      tags {
        _id
        name
      }
    }
  }
`);

export const GET_USER_DRAFTS = gql(/* GraphQL */ `
  query getUserDrafts {
    getUserDrafts {
      _id
      postId
      title
      author
      content
      contentText
      thumbnailUrl
      date
      tagIds
      tags {
        _id
        name
      }
    }
  }
`);

export const CREATE_DRAFT = gql(/* GraphQL */ `
  mutation createDraft(
    $title: String!
    $content: String!
    $contentText: String!
    $thumbnailUrl: String
    $tagIds: [ID]!
    $postId: ID
  ) {
    createDraft(
      title: $title
      content: $content
      contentText: $contentText
      thumbnailUrl: $thumbnailUrl
      tagIds: $tagIds
      postId: $postId
    ) {
      _id
      postId
      title
      author
      content
      contentText
      thumbnailUrl
      date
      tagIds
      tags {
        _id
        name
      }
    }
  }
`);

export const UPDATE_DRAFT = gql(/* GraphQL */ `
  mutation updateDraft(
    $_id: String!
    $title: String!
    $content: String!
    $contentText: String!
    $thumbnailUrl: String
    $tagIds: [ID]!
    $postId: ID
  ) {
    updateDraft(
      _id: $_id
      title: $title
      content: $content
      contentText: $contentText
      thumbnailUrl: $thumbnailUrl

      tagIds: $tagIds
      postId: $postId
    ) {
      _id
      postId
      title
      author
      content
      contentText
      thumbnailUrl
      date
      tagIds
      tags {
        _id
        name
      }
    }
  }
`);

export const DELETE_DRAFT = gql(/* GraphQL */ `
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
`);

// Local Documents
export const GET_CACHED_POST_FRAGMENT = gql(/* GraphQL */ `
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
`);

export const GET_CACHED_DRAFT_FRAGMENT = gql(/* GraphQL */ `
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
`);
