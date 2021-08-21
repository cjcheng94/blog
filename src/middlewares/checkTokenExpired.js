import jwt from "jsonwebtoken";

export default function checkIfExpired() {
  const currentUserToken = localStorage.getItem("currentUserToken");
  if (!currentUserToken) {
    // return false if token is somehow deleted from localStorage
    return true;
  }
  const decoded = jwt.decode(currentUserToken, { complete: true });
  //get current time in utc format, avoiding timezone problems
  const currentTime = new Date().valueOf() / 1000;
  if (currentTime > decoded.payload.exp) {
    // return true if expired
    return true;
  }
  return false;
}
