import { combineReducers } from "redux";
import { USER_LOGOUT } from "../actions/types";

import homeImagesReducer from "./homeImages.reducer";
import userProfileReducer from "./userProfile.reducer";

const appReducer = combineReducers({
  userProfile: userProfileReducer,
  homeImages: homeImagesReducer,
});

const totalReducer = (state, action) => {
  if (action.type === USER_LOGOUT) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default totalReducer;
