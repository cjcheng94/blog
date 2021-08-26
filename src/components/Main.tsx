import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { createStyles, makeStyles } from "@material-ui/core";
import { LoadingOverlay } from "@components";

const PostIndex = React.lazy(() => import("../routes/PostIndex"));
const PostNew = React.lazy(() => import("../routes/PostNew"));
const PostDetails = React.lazy(() => import("../routes/PostDetails"));
const PostUpdate = React.lazy(() => import("../routes/PostUpdate"));
const Login = React.lazy(() => import("../routes/Login"));
const Signup = React.lazy(() => import("../routes/Signup"));
const NoMatch = React.lazy(() => import("../routes/NoMatch"));
const UserProfile = React.lazy(() => import("../routes/UserProfile"));

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      fontFamily: "Roboto, sans-serif"
    },
    pageComponent: {
      padding: 24
    }
  })
);

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
    path: "/user/profile/:userId",
    main: UserProfile
  },
  {
    main: NoMatch
  }
];

const Main: React.FC = props => {
  const classes = useStyles();
  return (
    <main className={classes.pageComponent}>
      <Suspense fallback={<LoadingOverlay />}>
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
      </Suspense>
    </main>
  );
};

export default Main;
