//Router configuration
import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { withStyles } from "@material-ui/core";
import CssBaseline from '@material-ui/core/CssBaseline';

import Header from "../containers/Header";
import PostNew from "../containers/Post_new";
import PostIndex from "../containers/Post_index";
import PostDetails from "../containers/Post_details";
import PostUpdate from "../containers/Post_update";
import Login from "../containers/Login";
import Signup from "../containers/Signup";
import NoMatch from "../components/noMatch";

import AsyncComponent from "./AsyncComponent";

//As this app is quite small, we don't need to unnassisarily split the code into too many chunks,
//but I'll leave AsyncUserProfile spit as a demonstration
const AsyncUserProfile = AsyncComponent(() =>
  import("../containers/UserProfile")
);

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
  },
  {
    main: NoMatch
  }
];

const styles = {
  root: {
    fontFamily: "Roboto, sans-serif"
  },
  pageComponent: {
    padding: 24
  }
};

class App extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <CssBaseline />
        <Router>
          <div className={classes.root}>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                component={route.sidebar}
              />
            ))}
            <div className={classes.pageComponent}>
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
            </div>
          </div>
        </Router>
      </Fragment>
    );
  }
}
export default withStyles(styles)(App);
