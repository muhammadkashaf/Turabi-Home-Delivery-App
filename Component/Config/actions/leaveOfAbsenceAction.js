import { LEAVE_OF_ABSENCE } from "./types";

export default (studentId, date, comment) => dispatch => {
	// console.log(studentId, date, comment)
  dispatch({
    type: LEAVE_OF_ABSENCE,
    payload: { studentId, date, comment }
  });
};