import React, { Component } from "react";
import Header from "../containers/Header";
import PostNew from "../containers/Post_new";
import PostIndex from "../containers/Post_index";
import PostDetails from "../containers/Post_details";
import PostUpdate from "../containers/Post_update";
import Login from "../containers/Login";
import Signup from "../containers/Signup";
import UserProfile from "../containers/UserProfile";
import Alert from "react-s-alert";

import { Route, withRouter } from "react-router-dom";
import {connect} from 'react-redux';

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
    exact: true,
    sidebar: Header,
    main: UserProfile
  },
  {
    path: "/",
    exact: true,
    sidebar: Header,
    main: PostIndex
  }
];
class App extends Component {
  render() {
    return (
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
    );
  }
}
//FLAG!
export default withRouter(connect(null)(App));
