import { FORWARD_WEEK } from "./types";

export default () => dispatch => {
  dispatch({
    type: FORWARD_WEEK
  });
};
