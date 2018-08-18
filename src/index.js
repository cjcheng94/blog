import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import promiseMiddleware from "redux-promise-middleware";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";

import App from './components/app'
import reducers from "./reducers";

const middlewares = [promiseMiddleware(), thunk];
if (process.env.NODE_ENV === "development") {
  middlewares.push(createLogger());
}
const createStoreWithMiddleWare = applyMiddleware(...middlewares)(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleWare(reducers)}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
