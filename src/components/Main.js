import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { withStyles } from "@material-ui/core";

import PostNew from "../routes/Post_new";
import PostIndex from "../routes/Post_index";
import PostDetails from "../routes/Post_details";
import PostUpdate from "../routes/Post_update";
import Login from "../routes/Login";
import Signup from "../routes/Signup";
import NoMatch from "../routes/NoMatch";
import AsyncComponent from "./AsyncComponent";

//As this app is quite small, we don't need to unnassisarily split the code into too many chunks,
//but I'll leave AsyncUserProfile spit as a demonstration
const AsyncUserProfile = AsyncComponent(() => import("../routes/UserProfile"));

const styles = {
  root: {
    fontFamily: "Roboto, sans-serif"
  },
  pageComponent: {
    padding: 24
  }
};

const routes = [
  {
    path: "/",
    exact: true,
    main: PostIndex
  },
  {
    path: "/posts/new",
    main: PostNew
  },
  {
    path: "/posts/detail/:_id",
    main: PostDetails
  },
  {
    path: "/posts/edit/:_id",
    main: PostUpdate
  },
  {
    path: "/user/login",
    main: Login
  },
  {
    path: "/user/signup",
    main: Signup
  },
  {
    path: "/user/profile/:username",
    main: AsyncUserProfile
  },
  {
    main: NoMatch
  }
];
@withStyles(styles)
export default class Main extends Component {
  render() {
    const { classes } = this.props;
    return (
      <main className={classes.pageComponent}>
        <Switch>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.main}
            />
          ))}
        </Switch>
      </main>
    );
  }
}
