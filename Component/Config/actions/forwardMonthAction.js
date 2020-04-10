import { FORWARD_MONTH } from "./types";

export default () => dispatch => {
  dispatch({
    type: FORWARD_MONTH
  });
};
