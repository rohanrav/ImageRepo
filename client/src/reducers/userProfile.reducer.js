import { FETCH_USER_PROFILE, ADD_CREDITS } from "../actions/types";

const userProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_USER_PROFILE:
      return { ...state, ...action.payload };
    case ADD_CREDITS:
      return { ...state, credits: action.payload.credits };
    default:
      return state;
  }
};

export default userProfileReducer;
