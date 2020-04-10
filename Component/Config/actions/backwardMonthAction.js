import { BACKWARD_MONTH } from "./types";

export default () => dispatch => {
  dispatch({
    type: BACKWARD_MONTH
  });
};
