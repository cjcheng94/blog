import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import registerServiceWorker from './registerServiceWorker';
import configureStore from "./configureStore";
import App from "./components/app";
// import 'materialize-css/dist/css/materialize.min.css';
// import 'materialize-css/dist/js/materialize.min.js';

ReactDOM.render(
  <Provider store={configureStore()}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
registerServiceWorker();