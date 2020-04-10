import { DELETE_COMMENT } from "./types";

export default (studentId, date) => dispatch => {
  dispatch({
    type: DELETE_COMMENT,
    payload: { studentId, date }
  });
};
