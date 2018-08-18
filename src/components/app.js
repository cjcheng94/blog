//Router configuration
import React, { Component } from "react";
import Alert from "react-s-alert";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/slide.css";
import "../style/style.css";

import Header from "../containers/Header";
import PostNew from "../containers/Post_new";
import PostIndex from "../containers/Post_index";
import PostDetails from "../containers/Post_details";
import PostUpdate from "../containers/Post_update";
import Login from "../containers/Login";
import Signup from "../containers/Signup";

import AsyncComponent from "./AsyncComponent";
//As this app is quite small, we don't need to unnassisarily split the code into too many chunks,
//but I'll leave AsyncUserProfile spit as a demonstration
const AsyncUserProfile = AsyncComponent(() => import("../containers/UserProfile"));

const routes = [
  {
    path: "/posts/detail/:_id",
    sidebar: Header,
    main: PostDetails
  },
  {
    path: "/posts/new",
    sidebar: Header,
    main: PostNew
  },
  {
    path: "/posts/edit/:_id",
    sidebar: Header,
    main: PostUpdate
  },
  {
    path: "/user/login",
    sidebar: Header,
    main: Login
  },
  {
    path: "/user/signup",
    sidebar: Header,
    main: Signup
  },
  {
    path: "/user/profile/:username",
    sidebar: Header,
    main: AsyncUserProfile
  },
  {
    path: "/",
    exact: true,
    sidebar: Header,
    main: PostIndex
  }
];

export default class App extends Component {
  render() {
    return (
      <Router>
        <div>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.sidebar}
            />
          ))}
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.main}
            />
          ))}
          {/* A light-weight 3rd party alert component*/}
          <Alert stack={{ limit: 1 }} />
        </div>
      </Router>
    );
  }
}
