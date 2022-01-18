import jwtDecode from "jwt-decode";

export default function checkIfExpired() {
  const currentUserToken = localStorage.getItem("currentUserToken");
  if (!currentUserToken) {
    // return false if token is somehow deleted from localStorage
    return true;
  }
  const decoded = jwtDecode(currentUserToken);
  //get current time in utc format, avoiding timezone problems
  const currentTime = new Date().valueOf() / 1000;
  if (currentTime > decoded.exp) {
    // return true if expired
    return true;
  }
  return false;
}
