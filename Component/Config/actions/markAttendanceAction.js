import { MARK_ATTENDANCE } from "./types";

export default (studentId, date, attendanceType) => dispatch => {
  dispatch({
    type: MARK_ATTENDANCE,
    payload: { studentId, date, attendanceType }
  });
};
