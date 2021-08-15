import axios from "axios";

import { USER_LOGOUT } from "./types";
import history from "../history";

export const signOut =
  (onError = false) =>
  async (dispatch) => {
    console.log("RAN");
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
