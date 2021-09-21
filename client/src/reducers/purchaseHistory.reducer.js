import { FETCH_PURCHASE_HISTORY } from "../actions/types";

const purchaseHistoryReducer = (state = [], action) => {
  switch (action.type) {
    case FETCH_PURCHASE_HISTORY:
      return action.payload;
    default:
      return state;
  }
};

export default purchaseHistoryReducer;
