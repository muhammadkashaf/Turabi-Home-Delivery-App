import moment from "moment";
import {
  SET_CALENDAR_DATE,
  SET_TODAYS_DATE,
  FORWARD_MONTH,
  BACKWARD_MONTH,
  FORWARD_WEEK,
  BACKWARD_WEEK
} from "../actions/types";
const currentDate = new Date();
const initialState = {
  activeDate: currentDate,
  currentDate: currentDate
};
export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CALENDAR_DATE:
      return {
        ...state,
        ...action.payload // date objects
      };
    case SET_TODAYS_DATE:
      return {
        ...state,
        ...initialState
      };
    case FORWARD_MONTH: {
      const { currentDate } = state;
      const newCurrentDate = moment(currentDate)
        .date(1)
        .add(1, "months")
        .toDate();
      let newActiveDate = newCurrentDate;
      if (newActiveDate.getDay() === 0) {
        newActiveDate = moment(newActiveDate)
          .add(1, "days")
          .toDate();
      } else if (newActiveDate.getDay() === 6) {
        newActiveDate = moment(newActiveDate)
          .add(2, "days")
          .toDate();
      }
      return {
        ...state,
        currentDate: newCurrentDate,
        activeDate: newActiveDate
      };
    }

    case FORWARD_WEEK: {
      const { currentDate } = state;
      const newCurrentDate = moment(currentDate)
        .subtract(currentDate.getDay() - 1, "days")
        .add(1, "weeks")
        .toDate();
      let newActiveDate = newCurrentDate;
      if (newActiveDate.getDay() === 0) {
        newActiveDate = moment(newActiveDate)
          .add(1, "days")
          .toDate();
      } else if (newActiveDate.getDay() === 6) {
        newActiveDate = moment(newActiveDate)
          .add(2, "days")
          .toDate();
      }
      return {
        ...state,
        currentDate: newCurrentDate,
        activeDate: newActiveDate
      };
    }

    case BACKWARD_MONTH: {
      const { currentDate } = state;
      const newCurrentDate = moment(currentDate)
        .date(1)
        .subtract(1, "months")
        .toDate();
      let newActiveDate = newCurrentDate;
      if (newActiveDate.getDay() === 0) {
        newActiveDate = moment(newActiveDate)
          .add(1, "days")
          .toDate();
      } else if (newActiveDate.getDay() === 6) {
        newActiveDate = moment(newActiveDate)
          .add(2, "days")
          .toDate();
      }
      return {
        ...state,
        currentDate: newCurrentDate,
        activeDate: newActiveDate
      };
    }

    case BACKWARD_WEEK: {
      const { currentDate } = state;
      const newCurrentDate = moment(currentDate)
        .subtract(currentDate.getDay() - 1, "days")
        .subtract(1, "weeks")
        .toDate();
      let newActiveDate = newCurrentDate;
      if (newActiveDate.getDay() === 0) {
        newActiveDate = moment(newActiveDate)
          .add(1, "days")
          .toDate();
      } else if (newActiveDate.getDay() === 6) {
        newActiveDate = moment(newActiveDate)
          .add(2, "days")
          .toDate();
      }
      return {
        ...state,
        currentDate: newCurrentDate,
        activeDate: newActiveDate
      };
    }
    default:
      return state;
  }
};
