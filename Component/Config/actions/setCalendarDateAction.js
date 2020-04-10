import { SET_CALENDAR_DATE } from "./types";

export default calenderDates => dispatch => {
  dispatch({
    type: SET_CALENDAR_DATE,
    payload: { ...calenderDates }
  });
};
