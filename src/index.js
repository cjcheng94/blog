import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import registerServiceWorker from './registerServiceWorker';
import configureStore from "./configureStore";
import App from "./components/app";

ReactDOM.render(
  <Provider store={configureStore()}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
registerServiceWorker();