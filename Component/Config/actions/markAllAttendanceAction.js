import { MARK_ALL_ATTENDANCE } from "./types";

export default (date, attendanceType) => dispatch => {
  dispatch({
    type: MARK_ALL_ATTENDANCE,
    payload: { date, attendanceType }
  });
};
