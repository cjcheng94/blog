import React, { Component } from "react";
import Alert from "react-s-alert";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/slide.css";
import "../style/style.css";

import asyncComponent from "./AsyncComponent";
const AsyncHeader = asyncComponent(() => import("../containers/Header"));
const AsyncPostNew = asyncComponent(() => import("../containers/Post_new"));
const AsyncPostIndex = asyncComponent(() => import("../containers/Post_index"));
const AsyncPostDetails = asyncComponent(() => import("../containers/Post_details"));
const AsyncPostUpdate = asyncComponent(() => import("../containers/Post_update"));
const AsyncLogin = asyncComponent(() => import("../containers/Login"));
const AsyncSignup = asyncComponent(() => import("../containers/Signup"));
const AsyncUserProfile = asyncComponent(() => import("../containers/UserProfile"));

const routes = [
  {
    path: "/posts/detail/:_id",
    sidebar: AsyncHeader,
    main: AsyncPostDetails
  },
  {
    path: "/posts/new",
    sidebar: AsyncHeader,
    main: AsyncPostNew
  },
  {
    path: "/posts/edit/:_id",
    sidebar: AsyncHeader,
    main: AsyncPostUpdate
  },
  {
    path: "/user/login",
    sidebar: AsyncHeader,
    main: AsyncLogin
  },
  {
    path: "/user/signup",
    sidebar: AsyncHeader,
    main: AsyncSignup
  },
  {
    path: "/user/profile/:username",
    exact: true,
    sidebar: AsyncHeader,
    main: AsyncUserProfile
  },
  {
    path: "/",
    exact: true,
    sidebar: AsyncHeader,
    main: AsyncPostIndex
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
          <Alert stack={{ limit: 1 }} />
        </div>
      </Router>
    );
  }
}
