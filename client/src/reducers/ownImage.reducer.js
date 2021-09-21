import { FETCH_OWN_IMAGES_FOR_SALE, FETCH_OWN_IMAGES_NOT_FOR_SALE } from "../actions/types";

const ownImagesReducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_OWN_IMAGES_FOR_SALE:
      return { ...state, forSale: action.payload };
    case FETCH_OWN_IMAGES_NOT_FOR_SALE:
      return { ...state, notForSale: action.payload };
    default:
      return state;
  }
};

export default ownImagesReducer;
