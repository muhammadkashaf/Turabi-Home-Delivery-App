import { UNMARK_ATTENDANCE } from "./types";

export default (studentId, date) => dispatch => {
  dispatch({
    type: UNMARK_ATTENDANCE,
    payload: { studentId, date }
  });
};
