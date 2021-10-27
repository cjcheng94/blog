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
import { darkModeVar, loadingVar, searchOverlayVar, drawerVar } from "./cache";

const httpLink = createHttpLink({
  uri: "https://blog-gql.herokuapp.com"
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
          }
        }
      }
    }
  })
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <App />
    </Router>
  </ApolloProvider>,
  document.getElementById("root") as HTMLElement
);
