import { combineReducers } from "redux";
import { USER_LOGOUT } from "../actions/types";

import homeImagesReducer from "./homeImage.reducer";
import userProfileReducer from "./userProfile.reducer";
import ownImagesReducer from "./ownImage.reducer";
import purchaseHistoryReducer from "./purchaseHistory.reducer";
import searchImagesReducer from "./search.reducer";

const appReducer = combineReducers({
  userProfile: userProfileReducer,
  homeImages: homeImagesReducer,
  ownImages: ownImagesReducer,
  purchaseHistory: purchaseHistoryReducer,
  search: searchImagesReducer,
});

const totalReducer = (state, action) => {
  if (action.type === USER_LOGOUT) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default totalReducer;
