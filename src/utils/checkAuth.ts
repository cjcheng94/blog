import jwtDecode, { JwtPayload } from "jwt-decode";

const checkAuth = () => {
  const currentUserToken = localStorage.getItem("currentUserToken");

  if (!currentUserToken) {
    // token is somehow deleted from localStorage
    return false;
  }

  const decoded = jwtDecode<JwtPayload>(currentUserToken);
  //get current time in utc format, avoiding timezone problems
  const currentTime = new Date().valueOf() / 1000;

  // token expired
  if (currentTime > <number>decoded.exp) {
    return false;
  }

  return true;
};

export default checkAuth;
