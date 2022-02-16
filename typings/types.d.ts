declare module "PostTypes" {
  export interface Tag {
    _id: string;
    name: string;
  }

  export interface HighlightText {
    value: string;
    type: string;
  }

  export interface Highlight {
    path: string;
    texts: [HighlightText];
    score: number;
  }

  export interface Post {
    _id: string;
    content: string;
    date: string;
    title: string;
    tagIds: string[];
    tags: Tag[];
    authorInfo: {
      _id: string;
      username: string;
    };
  }
  export interface Draft {
    _id: string;
    content: string;
    date: string;
    title: string;
    tagIds: string[];
    tags: Tag[];
    author: string;
  }
  export interface SearchResult extends Post {
    highlights: [Highlight];
  }

  export interface PostsHub {
    [_id: string]: Post;
  }

  // Request Variables
  export interface IdVars {
    _id: string;
  }

  export interface GetPostVars extends IdVars {}

  export interface DeletePostVars extends IdVars {}

  export interface GetUserPostVars extends IdVars {}

  export interface CreatePostVars {
    title: string;
    content: string;
    tagIds: [string];
  }

  export interface UpdatePostVars {
    _id: string;
    title?: string;
    content?: string;
    tagIds?: [string];
  }

  export interface SearchtVars {
    searchTerm: string;
  }
}

declare module "UserTypes" {
  export interface User {
    _id: string;
    username: string;
  }

  export interface LoginResponse {
    userId: string;
    username: string;
    token: string;
  }

  // Request Variables
  export interface GetUserVars {
    username: string;
  }

  export interface UserSignupVars extends User {}

  export interface UserLoginVars extends User {}
}
