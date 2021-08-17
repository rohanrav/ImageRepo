import { FETCH_HOME_IMAGES } from "../actions/types";

const homeImagesReducer = (state = [], action) => {
  switch (action.type) {
    case FETCH_HOME_IMAGES:
      return action.payload;
    default:
      return state;
  }
};

export default homeImagesReducer;
