import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import { LoadingOverlay } from "@components";
import { useQuery } from "@apollo/client";
import { GET_SHOW_DRAWER } from "../gqlDocuments";

const PostIndex = React.lazy(() => import("../routes/PostIndex"));
const PostNew = React.lazy(() => import("../routes/PostNew"));
const PostDetails = React.lazy(() => import("../routes/PostDetails"));
const PostUpdate = React.lazy(() => import("../routes/PostUpdate"));
const Login = React.lazy(() => import("../routes/Login"));
const Signup = React.lazy(() => import("../routes/Signup"));
const NoMatch = React.lazy(() => import("../routes/NoMatch"));
const UserProfile = React.lazy(() => import("../routes/UserProfile"));
const SearchResults = React.lazy(() => import("../routes/SearchResults"));
const PostsByTags = React.lazy(() => import("../routes/PostsByTags"));

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: "Roboto, sans-serif"
  },
  pageContent: {
    padding: 24,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: 0
  },
  pageContentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: drawerWidth,
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0
    }
  }
}));

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
    path: "/posts/tags",
    main: PostsByTags
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
    path: "/results",
    main: SearchResults
  },

  {
    main: NoMatch
  }
];

const Main: React.FC = props => {
  const { data } = useQuery(GET_SHOW_DRAWER);
  const { showDrawer } = data;
  const classes = useStyles();

  const pageContentClass = showDrawer
    ? `${classes.pageContent} ${classes.pageContentShift}`
    : classes.pageContent;

  return (
    <main className={pageContentClass}>
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
