import { reducer as formReducer } from "redux-form";
import { init, RematchRootState, RematchDispatch } from "@rematch/core";

import { models, RootModel } from "./models";

export const store = init({
  redux: {
    reducers: { form: formReducer }
  },
  models
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type iRootState = RematchRootState<RootModel>;
