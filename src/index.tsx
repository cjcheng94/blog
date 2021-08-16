import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import registerServiceWorker from "./registerServiceWorker";
import { store } from "./store";
import { App } from "@components";
import { currentUsernameVar, tokenVar } from "./cache";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://blog-gql.herokuapp.com",
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
