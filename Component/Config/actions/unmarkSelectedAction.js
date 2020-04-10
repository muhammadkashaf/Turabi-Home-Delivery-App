import { UNMARK_SELECTED_ATTENDANCE } from "./types";

export default (studentId, date) => dispatch => {
  dispatch({
    type: UNMARK_SELECTED_ATTENDANCE,
    payload: { studentId, date }
  });
};