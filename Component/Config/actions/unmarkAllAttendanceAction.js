import { MARK_ALL_ATTENDANCE } from "./types";

export default date => dispatch => {
  dispatch({
    type: MARK_ALL_ATTENDANCE,
    payload: { date }
  });
};
