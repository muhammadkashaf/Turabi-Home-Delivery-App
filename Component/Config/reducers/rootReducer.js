import { combineReducers } from "redux";
import studentsReducer from "./studentsReducer";
import calendarReducer from "./calendarReducer";

export default combineReducers({
  studentsReducer,
  calendarReducer
});
