import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { App } from "@components";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { relayStylePagination } from "@apollo/client/utilities";
import {
  darkModeVar,
  loadingVar,
  searchOverlayVar,
  drawerVar,
  sortLatestFirstVar,
  accountDialogTypeVar,
  draftUpdatingVar,
  draftErrorVar,
  imageMapVar
} from "./api/cache";
import { StyledEngineProvider } from "@mui/material/styles";
import { inject } from "@vercel/analytics";

inject();

import "@fontsource/notable/400.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "@fontsource/source-serif-pro/400.css";
import "@fontsource/source-serif-pro/700.css";

const httpLink = createHttpLink({
  uri: import.meta.env.DEV
    ? import.meta.env.VITE_BACKEND_CYCLIC_URL
    : import.meta.env.VITE_BACKEND_RAILWAY_URL
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("currentUserToken");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isDarkMode: {
            read() {
              return darkModeVar();
            }
          },
          isLoading: {
            read() {
              return loadingVar();
            }
          },
          showSearchOverlay: {
            read() {
              return searchOverlayVar();
            }
          },
          showDrawer: {
            read() {
              return drawerVar();
            }
          },
          sortLatestFirst: {
            read() {
              return sortLatestFirstVar();
            }
          },
          accountDialogType: {
            read() {
              return accountDialogTypeVar();
            }
          },
          draftUpdating: {
            read() {
              return draftUpdatingVar();
            }
          },
          draftError: {
            read() {
              return draftErrorVar();
            }
          },
          imageMap: {
            read() {
              return imageMapVar();
            }
          },
          posts: relayStylePagination()
        }
      }
    }
  })
});

ReactDOM.render(
  <StyledEngineProvider injectFirst>
    <ApolloProvider client={client}>
      <Router>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </Router>
    </ApolloProvider>
  </StyledEngineProvider>,
  document.getElementById("root") as HTMLElement
);
