import { combineReducers } from "redux";
import { USER_LOGOUT } from "../actions/types";

const appReducer = combineReducers({
  auth: "ff",
});

const totalReducer = (state, action) => {
  if (action.type === USER_LOGOUT) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default totalReducer;
