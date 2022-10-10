import { isAuthedVar } from "../api/cache";
import jwtDecode, { JwtPayload } from "jwt-decode";

type AuthInfo = {
  username: string;
  token: string;
  userId: string;
};

export const saveAuth = (authInfo: AuthInfo) => {
  isAuthedVar(true);

  const { token, username, userId } = authInfo;
  localStorage.setItem("currentUsername", username);
  localStorage.setItem("currentUserToken", token);
  localStorage.setItem("currentUserId", userId);
};

export const removeAuth = () => {
  isAuthedVar(false);

  localStorage.removeItem("currentUsername");
  localStorage.removeItem("currentUserToken");
  localStorage.removeItem("currentUserId");
};

export const checkLocalStorageAuth = () => {
  const currentUserToken = localStorage.getItem("currentUserToken");
  if (!currentUserToken) {
    // token is somehow deleted from localStorage
    isAuthedVar(false);
    return;
  }

  const decoded = jwtDecode<JwtPayload>(currentUserToken);
  //get current time in utc format, avoiding timezone problems
  const currentTime = new Date().valueOf() / 1000;

  // token expired
  if (currentTime > <number>decoded.exp) {
    isAuthedVar(false);
    return;
  }

  isAuthedVar(true);
};

export const handleLocalStorageAuthDeletion = (e: StorageEvent) => {
  if (!e.key) {
    return;
  }

  // Token is deleted from local storage, update auth state to false
  if (e.key === "currentUserToken" && !e.newValue) {
    isAuthedVar(false);
    console.log("Token was deleted from local storage");
  }
};
