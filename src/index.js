import Alert from "react-s-alert";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import promiseMiddleware from "redux-promise-middleware";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";

import reducers from "./reducers";
import Header from "./containers/Header";
import PostNew from "./containers/Post_new";
import PostIndex from "./containers/Post_index";
import PostDetails from "./containers/Post_details";
import PostUpdate from "./containers/Post_update";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import UserProfile from "./containers/UserProfile";

import "materialize-css/dist/js/materialize.min.js";
import "materialize-css/dist/css/materialize.min.css";
import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/slide.css";
import "./style/style.css";

const middlewares = [promiseMiddleware(), thunk];
if (process.env.NODE_ENV === "development") {
  middlewares.push(createLogger());
}
const createStoreWithMiddleWare = applyMiddleware(...middlewares)(createStore);

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
    main: UserProfile
  },
  {
    path: "/",
    exact: true,
    sidebar: Header,
    main: PostIndex
  }
];

ReactDOM.render(
  <Provider store={createStoreWithMiddleWare(reducers)}>
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
  </Provider>,
  document.querySelector("#root")
);
