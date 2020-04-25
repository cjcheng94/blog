import * as React from "react";
import * as ReactDOM from "react-dom";
// import { BrowserRouter as Router } from "react-router-dom";
// import { Provider } from "react-redux";
import registerServiceWorker from "./registerServiceWorker";
// import configureStore from "./configureStore";
// import App from "./components/App";

ReactDOM.render(
  <div>Initial Typescript Migration</div>,
  document.getElementById("root") as HTMLElement
);

// ReactDOM.render(
//   <Provider store={configureStore()}>
//     <Router>
//       <App />
//     </Router>
//   </Provider>,
//   document.getElementById("root") as HTMLElement
// );
registerServiceWorker();
