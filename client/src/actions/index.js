import axios from "axios";

import {
  USER_LOGOUT,
  FETCH_HOME_IMAGES,
  FETCH_USER_PROFILE,
  FETCH_OWN_IMAGES_FOR_SALE,
  FETCH_OWN_IMAGES_NOT_FOR_SALE,
  OWN_IMAGES,
  FETCH_PURCHASE_HISTORY,
  FETCH_IMAGES_BY_SEARCH,
  ADD_CREDITS,
} from "./types";
import history from "../history";

export const signOut =
  (onError = false) =>
  async (dispatch) => {
    try {
      await axios.get("/api/logout");
      dispatch({
        type: USER_LOGOUT,
      });

      if (onError) {
        history.push("/error");
      } else {
        history.push("/login");
      }
    } catch (e) {
      console.error("Unable to sign out: ", e);
    }
  };

export const fetchHomeImages =
  (num = 15) =>
  async (dispatch) => {
    try {
      const imagesRes = await axios.get(`/api/images/${num}`);
      dispatch({
        type: FETCH_HOME_IMAGES,
        payload: imagesRes.data.images,
      });
    } catch (e) {
      console.error("Error fetching /api/images/.../ from API: ", e);
      history.push("/login");
    }
  };

export const fetchUserData = () => async (dispatch) => {
  try {
    const userRes = await axios.get("/api/current-user-profile");
    dispatch({
      type: FETCH_USER_PROFILE,
      payload: userRes.data,
    });
  } catch (e) {
    console.error("Error fetching /api/current-user-profile/ from API: ", e);
    dispatch(signOut(true));
  }
};

export const fetchOwnImages =
  (type = OWN_IMAGES.QUERY_TYPE_NOT_FOR_SALE, num) =>
  async (dispatch) => {
    try {
      const imagesRes = await axios.get("/api/own-images", {
        params: {
          type,
          num,
        },
      });

      if (type === OWN_IMAGES.QUERY_TYPE_FOR_SALE) {
        dispatch({
          type: FETCH_OWN_IMAGES_FOR_SALE,
          payload: imagesRes.data,
        });
      } else {
        dispatch({
          type: FETCH_OWN_IMAGES_NOT_FOR_SALE,
          payload: imagesRes.data,
        });
      }
    } catch (e) {
      console.error("Error fetching /api/own-images/ from API: ", e);
      dispatch(signOut(true));
    }
  };

export const fetchPurchaseHistory = () => async (dispatch) => {
  try {
    const purchaseHistoryRes = await axios.get("/api/purchase-history");
    dispatch({
      type: FETCH_PURCHASE_HISTORY,
      payload: purchaseHistoryRes.data,
    });
  } catch (e) {
    console.error("Error fetching /api/purchase-history/ from API: ", e);
    dispatch(signOut(true));
  }
};

export const fetchImagesBySearch = (query) => async (dispatch) => {
  try {
    const searchRes = await axios.get("/api/search", { params: { q: query } });
    dispatch({
      type: FETCH_IMAGES_BY_SEARCH,
      payload: searchRes.data,
    });
  } catch (e) {
    console.error("Error fetching /api/search/ from API: ", e);
    dispatch(signOut(true));
  }
};

export const addCredits = () => async (dispatch) => {
  try {
    const addCreditsRes = await axios.get("/api/add-credits");
    dispatch({
      type: ADD_CREDITS,
      payload: addCreditsRes.data,
    });
  } catch (e) {
    console.error("Error adding credits from /api/add-credits/ from API: ", e);
    dispatch(signOut(true));
  }
};
