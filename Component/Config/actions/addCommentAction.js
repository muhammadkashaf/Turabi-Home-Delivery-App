import { ADD_COMMENT } from "./types";

export default (studentId, date, comment) => dispatch => {
  dispatch({
    type: ADD_COMMENT,
    payload: { studentId, date, comment }
  });
};
