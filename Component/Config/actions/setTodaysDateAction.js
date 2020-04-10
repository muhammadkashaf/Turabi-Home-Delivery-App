import { SET_TODAYS_DATE } from "./types";

export default () => dispatch => {
  dispatch({
    type: SET_TODAYS_DATE,
    payload: {}
  });
};
