import { MARK_ALL_SELECTED_ATTENDANCE } from "./types";

export default (studentId, date, attendanceType) => dispatch => {
  dispatch({
    type: MARK_ALL_SELECTED_ATTENDANCE,
    payload: { studentId, date, attendanceType }
  });
};
