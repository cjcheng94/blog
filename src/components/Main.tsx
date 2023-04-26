import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import makeStyles from "@mui/styles/makeStyles";
import { LoadingOverlay } from "@components";
import { useReactiveVar } from "@apollo/client";
import { drawerVar } from "../api/cache";

const PostIndex = React.lazy(() => import("../routes/PostIndex"));
const PostNew = React.lazy(() => import("../routes/PostNew"));
const PostDetails = React.lazy(() => import("../routes/PostDetails"));
const PostUpdate = React.lazy(() => import("../routes/PostUpdate"));
const DraftUpdate = React.lazy(() => import("../routes/DraftUpdate"));
const NoMatch = React.lazy(() => import("../routes/NoMatch"));
const SearchResults = React.lazy(() => import("../routes/SearchResults"));
const PostsByTags = React.lazy(() => import("../routes/PostsByTags"));
const Drafts = React.lazy(() => import("../routes/Drafts"));
const About = React.lazy(() => import("../routes/About"));

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
    [theme.breakpoints.down("sm")]: {
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
    path: "/drafts/edit/:_id",
    main: DraftUpdate
  },
  {
    path: "/posts/tags",
    main: PostsByTags
  },
  {
    path: "/results",
    main: SearchResults
  },
  {
    path: "/drafts",
    main: Drafts
  },
  {
    path: "/about",
    main: About
  },
  {
    main: NoMatch
  }
];

const Main: React.FC = props => {
  const showDrawer = useReactiveVar(drawerVar);
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
