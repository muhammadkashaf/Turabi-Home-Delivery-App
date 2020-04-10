import { BACKWARD_WEEK } from "./types";

export default () => dispatch => {
  dispatch({
    type: BACKWARD_WEEK
  });
};
