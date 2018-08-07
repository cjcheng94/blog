import {USER_LOGIN} from '../actions/user';

const initialUserState = {
  authorized: false,
  token: ''
}
export default function (state=initialUserState, action){
  switch (action.type) {
    case USER_LOGIN:
      return {
        ...state,
        authorized: true,
        token: action.payload.data.token
      }
    default:
      return state;
  }
}