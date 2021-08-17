import { FETCH_USER_PROFILE } from "../actions/types";

const userProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_USER_PROFILE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default userProfileReducer;
