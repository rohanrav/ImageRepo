import { FETCH_IMAGES_BY_SEARCH } from "../actions/types";

const searchImagesReducer = (state = [], action) => {
  switch (action.type) {
    case FETCH_IMAGES_BY_SEARCH:
      return action.payload;
    default:
      return state;
  }
};

export default searchImagesReducer;
