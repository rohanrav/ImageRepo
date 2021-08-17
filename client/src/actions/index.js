import axios from "axios";

import { USER_LOGOUT, FETCH_HOME_IMAGES, FETCH_USER_PROFILE } from "./types";
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
      dispatch(signOut());
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
    dispatch(signOut());
  }
};
