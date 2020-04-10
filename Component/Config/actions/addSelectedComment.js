import { ADD_SELECTED_COMMENT } from "./types";

export default (studentId, date, comment) => dispatch => {
  dispatch({
    type: ADD_SELECTED_COMMENT,
    payload: { studentId, date, comment }
  });
};
