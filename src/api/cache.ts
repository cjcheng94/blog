import { makeVar } from "@apollo/client";

export const darkModeVar = makeVar(false);
export const loadingVar = makeVar(false);
export const searchOverlayVar = makeVar(false);
export const drawerVar = makeVar(false);
export const sortLatestFirstVar = makeVar(true);
export const accountDialogTypeVar = makeVar<"" | "login" | "signup">("");
export const draftUpdatingVar = makeVar(false);
export const draftErrorVar = makeVar(false);
export const imageMapVar = makeVar<{ [id: string]: ArrayBuffer }>({});
