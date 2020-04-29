// import { createStore, applyMiddleware, compose } from "redux";
// import promiseMiddleware from "redux-promise-middleware";
// import thunk from "redux-thunk";
// import rootReducer from "./reducers";

// const configureStore = () => {
//   const middlewares = [promiseMiddleware(), thunk];

//   //redux devtools config
//   const composeEnhancers =
//     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

//   const store = createStore(
//     rootReducer,
//     composeEnhancers(applyMiddleware(...middlewares))
//   );
//   return store;
// };

// export default configureStore;
// // //---------
import { reducer as formReducer } from "redux-form";
import { init } from "@rematch/core";

import models from "./models";

const store = init({ redux: { reducers: { form: formReducer } }, models });

export default store;
