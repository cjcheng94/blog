import jwt from 'jsonwebtoken';

export default function checkIfExpired(){

  const token = localStorage.getItem('token');

  //get current time in utc format, 
  const currentTime = new Date().valueOf() / 1000;

  const decoded = jwt.decode(token, {complete: true});

  if (currentTime > decoded.exp) {
    // return true if expired
    return true
  }
  return false
}