import jwt from "jsonwebtoken";

export default function checkIfExpired(token) {
  if (!token) {
    // return false if token is somehow deleted from localStorage
    return true;
  }
  const decoded = jwt.decode(token, { complete: true });
  //get current time in utc format, avoiding timezone problems
  const currentTime = new Date().valueOf() / 1000;
  if (currentTime > decoded.payload.exp) {
    // return true if expired
    return true;
  }
  return false;
}
