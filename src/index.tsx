import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import registerServiceWorker from "./registerServiceWorker";
import { store } from "./store";
import { App } from "@components";
import { currentUsernameVar, tokenVar } from "./cache";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "https://blog-gql.herokuapp.com"
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");
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
      Post: {
        keyFields: ["_id"]
      },
      User: {
        fields: {
          token: {
            read() {
              return localStorage.getItem("token") || tokenVar();
            }
          },
          currentUsername: {
            read() {
              return (
                localStorage.getItem("currentUsername") || currentUsernameVar()
              );
            }
          }
        }
      }
    }
  })
});

ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <Router>
        <App />
      </Router>
    </ApolloProvider>
  </Provider>,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
