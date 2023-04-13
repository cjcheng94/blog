/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query userLogin($username: String!, $password: String!) {\n    userLogin(username: $username, password: $password) {\n      token\n      username\n      userId\n    }\n  }\n": types.UserLoginDocument,
    "\n  query userSignup($username: String!, $password: String!) {\n    userSignup(username: $username, password: $password)\n  }\n": types.UserSignupDocument,
    "\n  query getAllPosts($first: Int = 10, $after: String) {\n    posts(first: $first, after: $after) {\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n      edges {\n        cursor\n        node {\n          _id\n          title\n          # content\n          contentText\n          date\n          tagIds\n          thumbnailUrl\n          tags {\n            _id\n            name\n          }\n          authorInfo {\n            _id\n            username\n          }\n        }\n      }\n    }\n  }\n": types.GetAllPostsDocument,
    "\n  query getCurrentPost($_id: String!) {\n    getPostById(_id: $_id) {\n      _id\n      title\n      content\n      contentText\n      date\n      tagIds\n      thumbnailUrl\n      tags {\n        _id\n        name\n      }\n      authorInfo {\n        _id\n        username\n      }\n    }\n  }\n": types.GetCurrentPostDocument,
    "\n  query getUserPosts($_id: String!) {\n    getUserPosts(_id: $_id) {\n      _id\n      title\n      content\n      contentText\n      date\n      tagIds\n      thumbnailUrl\n      tags {\n        _id\n        name\n      }\n      authorInfo {\n        _id\n        username\n      }\n    }\n  }\n": types.GetUserPostsDocument,
    "\n  query getPostsByTags($tagIds: [ID]!) {\n    getPostsByTags(tagIds: $tagIds) {\n      _id\n      title\n      content\n      contentText\n      date\n      tagIds\n      thumbnailUrl\n      tags {\n        _id\n        name\n      }\n      authorInfo {\n        _id\n        username\n      }\n    }\n  }\n": types.GetPostsByTagsDocument,
    "\n  mutation createPost(\n    $title: String!\n    $content: String!\n    $contentText: String!\n    $tagIds: [ID]!\n    $thumbnailUrl: String\n  ) {\n    createPost(\n      title: $title\n      content: $content\n      contentText: $contentText\n      tagIds: $tagIds\n      thumbnailUrl: $thumbnailUrl\n    ) {\n      _id\n      title\n      content\n      contentText\n      date\n      tagIds\n      thumbnailUrl\n      tags {\n        _id\n        name\n      }\n      authorInfo {\n        _id\n        username\n      }\n    }\n  }\n": types.CreatePostDocument,
    "\n  mutation updatePost(\n    $_id: String!\n    $title: String!\n    $content: String!\n    $contentText: String!\n    $tagIds: [ID]!\n    $thumbnailUrl: String\n  ) {\n    updatePost(\n      _id: $_id\n      title: $title\n      content: $content\n      contentText: $contentText\n      tagIds: $tagIds\n      thumbnailUrl: $thumbnailUrl\n    ) {\n      _id\n      title\n      content\n      contentText\n      date\n      tagIds\n      thumbnailUrl\n      tags {\n        _id\n        name\n      }\n      authorInfo {\n        _id\n        username\n      }\n    }\n  }\n": types.UpdatePostDocument,
    "\n  mutation deletePost($_id: String!) {\n    deletePost(_id: $_id) {\n      _id\n    }\n  }\n": types.DeletePostDocument,
    "\n  query search($searchTerm: String!, $tagIds: [ID]) {\n    search(searchTerm: $searchTerm, tagIds: $tagIds) {\n      _id\n      title\n      content\n      contentText\n      date\n      tagIds\n      thumbnailUrl\n      tags {\n        _id\n        name\n      }\n      authorInfo {\n        _id\n        username\n      }\n    }\n  }\n": types.SearchDocument,
    "\n  query getAllTags {\n    tags {\n      _id\n      name\n    }\n  }\n": types.GetAllTagsDocument,
    "\n  query getTagsById($_id: ID!) {\n    tag(_id: $_id) {\n      _id\n      name\n    }\n  }\n": types.GetTagsByIdDocument,
    "\n  mutation createTag($name: String!) {\n    createTag(name: $name) {\n      _id\n      name\n    }\n  }\n": types.CreateTagDocument,
    "\n  mutation deleteTag($tagId: ID!) {\n    deleteTag(tagId: $tagId) {\n      _id\n      name\n    }\n  }\n": types.DeleteTagDocument,
    "\n  query getDraftById($_id: String!) {\n    getDraftById(_id: $_id) {\n      _id\n      postId\n      title\n      author\n      content\n      contentText\n      thumbnailUrl\n      date\n      tagIds\n      tags {\n        _id\n        name\n      }\n    }\n  }\n": types.GetDraftByIdDocument,
    "\n  query getDraftByPostId($postId: ID!) {\n    getDraftByPostId(postId: $postId) {\n      _id\n      postId\n      title\n      author\n      content\n      contentText\n      thumbnailUrl\n      date\n      tagIds\n      tags {\n        _id\n        name\n      }\n    }\n  }\n": types.GetDraftByPostIdDocument,
    "\n  query getUserDrafts {\n    getUserDrafts {\n      _id\n      postId\n      title\n      author\n      content\n      contentText\n      thumbnailUrl\n      date\n      tagIds\n      tags {\n        _id\n        name\n      }\n    }\n  }\n": types.GetUserDraftsDocument,
    "\n  mutation createDraft(\n    $title: String!\n    $content: String!\n    $contentText: String!\n    $thumbnailUrl: String\n    $tagIds: [ID]!\n    $postId: ID\n  ) {\n    createDraft(\n      title: $title\n      content: $content\n      contentText: $contentText\n      thumbnailUrl: $thumbnailUrl\n      tagIds: $tagIds\n      postId: $postId\n    ) {\n      _id\n      postId\n      title\n      author\n      content\n      contentText\n      thumbnailUrl\n      date\n      tagIds\n      tags {\n        _id\n        name\n      }\n    }\n  }\n": types.CreateDraftDocument,
    "\n  mutation updateDraft(\n    $_id: String!\n    $title: String!\n    $content: String!\n    $contentText: String!\n    $thumbnailUrl: String\n    $tagIds: [ID]!\n    $postId: ID\n  ) {\n    updateDraft(\n      _id: $_id\n      title: $title\n      content: $content\n      contentText: $contentText\n      thumbnailUrl: $thumbnailUrl\n\n      tagIds: $tagIds\n      postId: $postId\n    ) {\n      _id\n      postId\n      title\n      author\n      content\n      contentText\n      thumbnailUrl\n      date\n      tagIds\n      tags {\n        _id\n        name\n      }\n    }\n  }\n": types.UpdateDraftDocument,
    "\n  mutation deleteDraft($_id: String!) {\n    deleteDraft(_id: $_id) {\n      _id\n      title\n      author\n      content\n      contentText\n      date\n      tagIds\n      tags {\n        _id\n        name\n      }\n    }\n  }\n": types.DeleteDraftDocument,
    "\n  fragment MyPost on Post {\n    _id\n    title\n    content\n    contentText\n    date\n    tagIds\n    thumbnailUrl\n    tags {\n      _id\n      name\n    }\n    authorInfo {\n      _id\n      username\n    }\n  }\n": types.MyPostFragmentDoc,
    "\n  fragment MyDraft on Draft {\n    _id\n    postId\n    title\n    author\n    content\n    contentText\n    date\n    tagIds\n    tags {\n      _id\n      name\n    }\n  }\n": types.MyDraftFragmentDoc,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query userLogin($username: String!, $password: String!) {\n    userLogin(username: $username, password: $password) {\n      token\n      username\n      userId\n    }\n  }\n"): (typeof documents)["\n  query userLogin($username: String!, $password: String!) {\n    userLogin(username: $username, password: $password) {\n      token\n      username\n      userId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query userSignup($username: String!, $password: String!) {\n    userSignup(username: $username, password: $password)\n  }\n"): (typeof documents)["\n  query userSignup($username: String!, $password: String!) {\n    userSignup(username: $username, password: $password)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getAllPosts($first: Int = 10, $after: String) {\n    posts(first: $first, after: $after) {\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n      edges {\n        cursor\n        node {\n          _id\n          title\n          # content\n          contentText\n          date\n          tagIds\n          thumbnailUrl\n          tags {\n            _id\n            name\n          }\n          authorInfo {\n            _id\n            username\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query getAllPosts($first: Int = 10, $after: String) {\n    posts(first: $first, after: $after) {\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n      edges {\n        cursor\n        node {\n          _id\n          title\n          # content\n          contentText\n          date\n          tagIds\n          thumbnailUrl\n          tags {\n            _id\n            name\n          }\n          authorInfo {\n            _id\n            username\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getCurrentPost($_id: String!) {\n    getPostById(_id: $_id) {\n      _id\n      title\n      content\n      contentText\n      date\n      tagIds\n      thumbnailUrl\n      tags {\n        _id\n        name\n      }\n      authorInfo {\n        _id\n        username\n      }\n    }\n  }\n"): (typeof documents)["\n  query getCurrentPost($_id: String!) {\n    getPostById(_id: $_id) {\n      _id\n      title\n      content\n      contentText\n      date\n      tagIds\n      thumbnailUrl\n      tags {\n        _id\n        name\n      }\n      authorInfo {\n        _id\n        username\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getUserPosts($_id: String!) {\n    getUserPosts(_id: $_id) {\n      _id\n      title\n      content\n      contentText\n      date\n      tagIds\n      thumbnailUrl\n      tags {\n        _id\n        name\n      }\n      authorInfo {\n        _id\n        username\n      }\n    }\n  }\n"): (typeof documents)["\n  query getUserPosts($_id: String!) {\n    getUserPosts(_id: $_id) {\n      _id\n      title\n      content\n      contentText\n      date\n      tagIds\n      thumbnailUrl\n      tags {\n        _id\n        name\n      }\n      authorInfo {\n        _id\n        username\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getPostsByTags($tagIds: [ID]!) {\n    getPostsByTags(tagIds: $tagIds) {\n      _id\n      title\n      content\n      contentText\n      date\n      tagIds\n      thumbnailUrl\n      tags {\n        _id\n        name\n      }\n      authorInfo {\n        _id\n        username\n      }\n    }\n  }\n"): (typeof documents)["\n  query getPostsByTags($tagIds: [ID]!) {\n    getPostsByTags(tagIds: $tagIds) {\n      _id\n      title\n      content\n      contentText\n      date\n      tagIds\n      thumbnailUrl\n      tags {\n        _id\n        name\n      }\n      authorInfo {\n        _id\n        username\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation createPost(\n    $title: String!\n    $content: String!\n    $contentText: String!\n    $tagIds: [ID]!\n    $thumbnailUrl: String\n  ) {\n    createPost(\n      title: $title\n      content: $content\n      contentText: $contentText\n      tagIds: $tagIds\n      thumbnailUrl: $thumbnailUrl\n    ) {\n      _id\n      title\n      content\n      contentText\n      date\n      tagIds\n      thumbnailUrl\n      tags {\n        _id\n        name\n      }\n      authorInfo {\n        _id\n        username\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation createPost(\n    $title: String!\n    $content: String!\n    $contentText: String!\n    $tagIds: [ID]!\n    $thumbnailUrl: String\n  ) {\n    createPost(\n      title: $title\n      content: $content\n      contentText: $contentText\n      tagIds: $tagIds\n      thumbnailUrl: $thumbnailUrl\n    ) {\n      _id\n      title\n      content\n      contentText\n      date\n      tagIds\n      thumbnailUrl\n      tags {\n        _id\n        name\n      }\n      authorInfo {\n        _id\n        username\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation updatePost(\n    $_id: String!\n    $title: String!\n    $content: String!\n    $contentText: String!\n    $tagIds: [ID]!\n    $thumbnailUrl: String\n  ) {\n    updatePost(\n      _id: $_id\n      title: $title\n      content: $content\n      contentText: $contentText\n      tagIds: $tagIds\n      thumbnailUrl: $thumbnailUrl\n    ) {\n      _id\n      title\n      content\n      contentText\n      date\n      tagIds\n      thumbnailUrl\n      tags {\n        _id\n        name\n      }\n      authorInfo {\n        _id\n        username\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation updatePost(\n    $_id: String!\n    $title: String!\n    $content: String!\n    $contentText: String!\n    $tagIds: [ID]!\n    $thumbnailUrl: String\n  ) {\n    updatePost(\n      _id: $_id\n      title: $title\n      content: $content\n      contentText: $contentText\n      tagIds: $tagIds\n      thumbnailUrl: $thumbnailUrl\n    ) {\n      _id\n      title\n      content\n      contentText\n      date\n      tagIds\n      thumbnailUrl\n      tags {\n        _id\n        name\n      }\n      authorInfo {\n        _id\n        username\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation deletePost($_id: String!) {\n    deletePost(_id: $_id) {\n      _id\n    }\n  }\n"): (typeof documents)["\n  mutation deletePost($_id: String!) {\n    deletePost(_id: $_id) {\n      _id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query search($searchTerm: String!, $tagIds: [ID]) {\n    search(searchTerm: $searchTerm, tagIds: $tagIds) {\n      _id\n      title\n      content\n      contentText\n      date\n      tagIds\n      thumbnailUrl\n      tags {\n        _id\n        name\n      }\n      authorInfo {\n        _id\n        username\n      }\n    }\n  }\n"): (typeof documents)["\n  query search($searchTerm: String!, $tagIds: [ID]) {\n    search(searchTerm: $searchTerm, tagIds: $tagIds) {\n      _id\n      title\n      content\n      contentText\n      date\n      tagIds\n      thumbnailUrl\n      tags {\n        _id\n        name\n      }\n      authorInfo {\n        _id\n        username\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getAllTags {\n    tags {\n      _id\n      name\n    }\n  }\n"): (typeof documents)["\n  query getAllTags {\n    tags {\n      _id\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getTagsById($_id: ID!) {\n    tag(_id: $_id) {\n      _id\n      name\n    }\n  }\n"): (typeof documents)["\n  query getTagsById($_id: ID!) {\n    tag(_id: $_id) {\n      _id\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation createTag($name: String!) {\n    createTag(name: $name) {\n      _id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation createTag($name: String!) {\n    createTag(name: $name) {\n      _id\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation deleteTag($tagId: ID!) {\n    deleteTag(tagId: $tagId) {\n      _id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation deleteTag($tagId: ID!) {\n    deleteTag(tagId: $tagId) {\n      _id\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getDraftById($_id: String!) {\n    getDraftById(_id: $_id) {\n      _id\n      postId\n      title\n      author\n      content\n      contentText\n      thumbnailUrl\n      date\n      tagIds\n      tags {\n        _id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query getDraftById($_id: String!) {\n    getDraftById(_id: $_id) {\n      _id\n      postId\n      title\n      author\n      content\n      contentText\n      thumbnailUrl\n      date\n      tagIds\n      tags {\n        _id\n        name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getDraftByPostId($postId: ID!) {\n    getDraftByPostId(postId: $postId) {\n      _id\n      postId\n      title\n      author\n      content\n      contentText\n      thumbnailUrl\n      date\n      tagIds\n      tags {\n        _id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query getDraftByPostId($postId: ID!) {\n    getDraftByPostId(postId: $postId) {\n      _id\n      postId\n      title\n      author\n      content\n      contentText\n      thumbnailUrl\n      date\n      tagIds\n      tags {\n        _id\n        name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getUserDrafts {\n    getUserDrafts {\n      _id\n      postId\n      title\n      author\n      content\n      contentText\n      thumbnailUrl\n      date\n      tagIds\n      tags {\n        _id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query getUserDrafts {\n    getUserDrafts {\n      _id\n      postId\n      title\n      author\n      content\n      contentText\n      thumbnailUrl\n      date\n      tagIds\n      tags {\n        _id\n        name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation createDraft(\n    $title: String!\n    $content: String!\n    $contentText: String!\n    $thumbnailUrl: String\n    $tagIds: [ID]!\n    $postId: ID\n  ) {\n    createDraft(\n      title: $title\n      content: $content\n      contentText: $contentText\n      thumbnailUrl: $thumbnailUrl\n      tagIds: $tagIds\n      postId: $postId\n    ) {\n      _id\n      postId\n      title\n      author\n      content\n      contentText\n      thumbnailUrl\n      date\n      tagIds\n      tags {\n        _id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation createDraft(\n    $title: String!\n    $content: String!\n    $contentText: String!\n    $thumbnailUrl: String\n    $tagIds: [ID]!\n    $postId: ID\n  ) {\n    createDraft(\n      title: $title\n      content: $content\n      contentText: $contentText\n      thumbnailUrl: $thumbnailUrl\n      tagIds: $tagIds\n      postId: $postId\n    ) {\n      _id\n      postId\n      title\n      author\n      content\n      contentText\n      thumbnailUrl\n      date\n      tagIds\n      tags {\n        _id\n        name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation updateDraft(\n    $_id: String!\n    $title: String!\n    $content: String!\n    $contentText: String!\n    $thumbnailUrl: String\n    $tagIds: [ID]!\n    $postId: ID\n  ) {\n    updateDraft(\n      _id: $_id\n      title: $title\n      content: $content\n      contentText: $contentText\n      thumbnailUrl: $thumbnailUrl\n\n      tagIds: $tagIds\n      postId: $postId\n    ) {\n      _id\n      postId\n      title\n      author\n      content\n      contentText\n      thumbnailUrl\n      date\n      tagIds\n      tags {\n        _id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation updateDraft(\n    $_id: String!\n    $title: String!\n    $content: String!\n    $contentText: String!\n    $thumbnailUrl: String\n    $tagIds: [ID]!\n    $postId: ID\n  ) {\n    updateDraft(\n      _id: $_id\n      title: $title\n      content: $content\n      contentText: $contentText\n      thumbnailUrl: $thumbnailUrl\n\n      tagIds: $tagIds\n      postId: $postId\n    ) {\n      _id\n      postId\n      title\n      author\n      content\n      contentText\n      thumbnailUrl\n      date\n      tagIds\n      tags {\n        _id\n        name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation deleteDraft($_id: String!) {\n    deleteDraft(_id: $_id) {\n      _id\n      title\n      author\n      content\n      contentText\n      date\n      tagIds\n      tags {\n        _id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation deleteDraft($_id: String!) {\n    deleteDraft(_id: $_id) {\n      _id\n      title\n      author\n      content\n      contentText\n      date\n      tagIds\n      tags {\n        _id\n        name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment MyPost on Post {\n    _id\n    title\n    content\n    contentText\n    date\n    tagIds\n    thumbnailUrl\n    tags {\n      _id\n      name\n    }\n    authorInfo {\n      _id\n      username\n    }\n  }\n"): (typeof documents)["\n  fragment MyPost on Post {\n    _id\n    title\n    content\n    contentText\n    date\n    tagIds\n    thumbnailUrl\n    tags {\n      _id\n      name\n    }\n    authorInfo {\n      _id\n      username\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment MyDraft on Draft {\n    _id\n    postId\n    title\n    author\n    content\n    contentText\n    date\n    tagIds\n    tags {\n      _id\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment MyDraft on Draft {\n    _id\n    postId\n    title\n    author\n    content\n    contentText\n    date\n    tagIds\n    tags {\n      _id\n      name\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;