import {
  GET_ALL_PRODUCTS,
  // MARK_ATTENDANCE,
  // MARK_ALL_ATTENDANCE,
  // UNMARK_ATTENDANCE,
  // UNMARK_ALL_ATTENDANCE,
  // ADD_COMMENT,
  // DELETE_COMMENT,
  // LEAVE_OF_ABSENCE,
  // MARK_ALL_SELECTED_ATTENDANCE,
  // ADD_SELECTED_COMMENT,
  // UNMARK_SELECTED_ATTENDANCE
} from "../actions/types";
import moment from 'moment';

const initialState = {
  allDataProducts: [] // array
};
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_PRODUCTS:
      return {
        allDataProducts: action.payload // array
      };

    // case MARK_ATTENDANCE: {
    //   const { studentId, date, attendanceType } = action.payload; // object
    //   // console.log(date, attendanceType, studentId)
    //   let newDate = moment(date).format('YYYY-MM-DD')
    //   const students = state.students.map(student => {
    //     // console.log('maark', student)
    //     if (student.id === studentId) {
    //       console.log(student)
    //       student = { ...student };
    //       student.attendance = {
    //         ...student.attendance,
    //         [newDate]: attendanceType
    //       };
    //       // console.log(student)
    //       fetch('https://attendance-app-hnh.herokuapp.com/mark-attendance', {
    //         method: 'PUT',
    //         headers: {
    //           'content-type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //           "_id": student._id,
    //           "date": newDate,
    //           "message": attendanceType
    //         })
    //       })
    //         .then(response => response.json())
    //         .catch(error => console.error('Error:', error))
    //         .then(response => console.log('Success:', JSON.stringify(response)));


    //     }
    //     return student;
    //   });

    //   return {
    //     students
    //   };
    // }

    // case MARK_ALL_ATTENDANCE: {
    //   const { date, attendanceType } = action.payload; // object
    //   let newDate = moment(date).format('YYYY-MM-DD')
    //   const students = state.students.map(student => {
    //     student = { ...student };
    //     student.attendance = {
    //       ...student.attendance,
    //       [newDate]: attendanceType
    //     };
    //     fetch('https://attendance-app-hnh.herokuapp.com/all-mark-attendance', {
    //       method: 'PUT',
    //       headers: {
    //         'content-type': 'application/json'
    //       },
    //       body: JSON.stringify({
    //         "date": newDate,
    //         "message": attendanceType
    //       })
    //     })
    //       .then(response => response.json())
    //       .catch(error => console.error('Error:', error))
    //       .then(response => console.log('Success:', JSON.stringify(response)));
    //     return student;
    //   });

    //   return {
    //     students
    //   };
    // }

    // case MARK_ALL_SELECTED_ATTENDANCE: {
    //   const { studentId, date, attendanceType } = action.payload;
    //   let newDate = moment(date).format('YYYY-MM-DD')
    //   console.log("newDate", "attendanceType", "studentId")
    //   console.log(newDate, attendanceType, studentId)

    //   const students = state.students.map(student => {
    //     // console.log('maark', student)
    //     studentId.map((id, i) => {
    //       student = { ...student };
    //       if (student._id === id) {
    //         // console.log(student)

    //         student.attendance = {
    //           ...student.attendance,
    //           [newDate]: attendanceType
    //         };
    //         console.log(student)

    //         fetch('https://attendance-app-hnh.herokuapp.com/mark-attendance', {
    //           method: 'PUT',
    //           headers: {
    //             'content-type': 'application/json'
    //           },
    //           body: JSON.stringify({
    //             "_id": id,
    //             "date": newDate,
    //             "message": attendanceType
    //           })
    //         })
    //           .then(response => response.json())
    //           .catch(error => console.error('Error:', error))
    //           .then(response => console.log('Success:', JSON.stringify(response)));

    //       }

    //     })
    //     return student

    //   });
    //   // console.log(students)
    //   return {
    //     students
    //   };
    // }


    // case UNMARK_ATTENDANCE: {
    //   const { studentId, date } = action.payload; // object
    //   let newDate = moment(date).format('YYYY-MM-DD')
    //   console.log("from unmark attendance ============> ", newDate)
    //   const students = state.students.map(student => {
    //     if (student._id === studentId) {
    //       student = { ...student };
    //       student.attendance = {
    //         ...student.attendance
    //       };
    //       delete student.attendance[newDate];
    //       fetch('https://attendance-app-hnh.herokuapp.com/unmark-attendance', {
    //         method: 'PUT',
    //         headers: {
    //           'content-type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //           "_id": student._id,
    //           "date": newDate
    //         })
    //       })
    //         .then(response => response.json())
    //         .catch(error => console.error('Error:', error))
    //         .then(response => console.log('Success:', JSON.stringify(response)));

    //     }
    //     return student;
    //   });

    //   return {
    //     students
    //   };
    // }

    // case UNMARK_SELECTED_ATTENDANCE: {
    //   const { studentId, date } = action.payload; // object
    //   let newDate = moment(date).format('YYYY-MM-DD')
    //   // console.log("from unmark attendance ============> ", newDate)
    //   const students = state.students.map(student => {
    //     studentId.map((id, i) => {
    //       if (student._id === id) {
    //         student = { ...student };

    //         // delete attendance

    //         student.attendance = {
    //           ...student.attendance
    //         };

    //         delete student.attendance[newDate];

    //         fetch('https://attendance-app-hnh.herokuapp.com/unmark-attendance', {
    //           method: 'PUT',
    //           headers: {
    //             'content-type': 'application/json'
    //           },
    //           body: JSON.stringify({
    //             "_id": student._id,
    //             "date": newDate
    //           })
    //         })
    //           .then(response => response.json())
    //           .catch(error => console.error('Error:', error))
    //           .then(response => console.log('Success:', JSON.stringify(response)));

    //         // delete comments

    //         // student.comments = {
    //         //   ...student.comments,
    //         // };

    //         // delete student.comments[newDate];

    //         // fetch('https://attendance-app-hnh.herokuapp.com/delete-comment', {
    //         //   method: 'PUT',
    //         //   headers: {
    //         //     'content-type': 'application/json'
    //         //   },
    //         //   body: JSON.stringify({
    //         //     "_id": student._id,
    //         //     "date": newDate
    //         //   })
    //         // })
    //         //   .then(response => response.json())
    //         //   .catch(error => console.error('Error:', error))
    //         //   .then(response => console.log('Success:', JSON.stringify(response)));

    //       }
    //     })
    //     return student;
    //   });

    //   return {
    //     students
    //   };
    // }

    // case UNMARK_ALL_ATTENDANCE: {
    //   const { date } = action.payload; // object
    //   let newDate = moment(date).format('YYYY-MM-DD')
    //   const students = state.students.map(student => {
    //     student = { ...student };
    //     student.attendance = {
    //       ...student.attendance
    //     };
    //     delete student.attendance[newDate];
    //     fetch('https://attendance-app-hnh.herokuapp.com/all-unmark-attendance', {
    //       method: 'PUT',
    //       headers: {
    //         'content-type': 'application/json'
    //       },
    //       body: JSON.stringify({
    //         "date": newDate
    //       })
    //     })
    //       .then(response => response.json())
    //       .catch(error => console.error('Error:', error))
    //       .then(response => console.log('Success:', JSON.stringify(response)));
    //     return student;
    //   });

    //   return {
    //     students
    //   };
    // }

    // case ADD_COMMENT: {
    //   const { studentId, date, comment } = action.payload; // object
    //   // console.log(typeof studentId)
    //   let newDate = moment(date).format('YYYY-MM-DD')
    //   const students = state.students.map(student => {
    //     if (student.id === studentId) {
    //       student = { ...student };
    //       student.comments = {
    //         ...student.comments,
    //         [newDate]: comment
    //       };
    //       console.log(student)
    //       fetch('https://attendance-app-hnh.herokuapp.com/add-comment', {
    //         method: 'Post',
    //         headers: {
    //           'content-type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //           "_id": student._id,
    //           "date": newDate,
    //           "message": comment
    //         })
    //       })
    //         .then(response => response.json())
    //         .then(response => console.log('Success:', JSON.stringify(response)))
    //         .catch(error => console.error('Error:', error))

    //     }
    //     return student;
    //   });

    //   return {
    //     students
    //   };
    // }

    // case ADD_SELECTED_COMMENT: {
    //   const { studentId, date, comment } = action.payload; // object
    //   console.log(studentId)
    //   let newDate = moment(date).format('YYYY-MM-DD')
    //   const students = state.students.map(student => {
    //     studentId.map((id, i) => {
    //       if (student._id === id) {
    //         student = { ...student };
    //         student.comments = {
    //           ...student.comments,
    //           [newDate]: comment
    //         };
    //         // console.log(student)
    //         fetch('https://attendance-app-hnh.herokuapp.com/add-comment', {
    //           method: 'Post',
    //           headers: {
    //             'content-type': 'application/json'
    //           },
    //           body: JSON.stringify({
    //             "_id": student._id,
    //             "date": newDate,
    //             "message": comment
    //           })
    //         })
    //           .then(response => response.json())
    //           .then(response => console.log('Success:', JSON.stringify(response)))
    //           .catch(error => console.error('Error:', error))

    //       }
    //     })
    //     return student;
    //   });

    //   return {
    //     students
    //   };
    // }

    // case DELETE_COMMENT: {
    //   const { studentId, date } = action.payload; // object
    //   let newDate = moment(date).format('YYYY-MM-DD')
    //   const students = state.students.map(student => {
    //     if (student.id === studentId) {
    //       student = { ...student };
    //       delete student.comments[newDate];
    //       student.comments = {
    //         ...student.comments
    //       };

    //       fetch('https://attendance-app-hnh.herokuapp.com/delete-comment', {
    //         method: 'PUT',
    //         headers: {
    //           'content-type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //           "_id": student._id,
    //           "date": newDate
    //         })
    //       })
    //         .then(response => response.json())
    //         .catch(error => console.error('Error:', error))
    //         .then(response => console.log('Success:', JSON.stringify(response)));

    //     }
    //     return student;
    //   });

    //   return {
    //     students
    //   };
    // }

    // case LEAVE_OF_ABSENCE: {
    //   const { studentId } = action.payload; // object
    //   const { datesBetween, comment, endDate, message, startDate } = action.payload.comment;
    //   // console.log(studentId, comment)
    //   //       let newDate = moment(date).format('YYYY-MM-DD')
    //   // console.log(comment)
    //   const students = state.students.map(student => {
    //     if (student.id === studentId) {
    //       student = { ...student };
    //       student.comments = {
    //         ...student.comments,
    //         [startDate]: comment,
    //         [endDate]: comment
    //       };
    //       student.attendance = {
    //         ...student.attendance,
    //         [startDate]: message,
    //         [endDate]: message
    //       };
    //       // console.log(student)
    //       if (startDate && endDate) {
    //         student.comments = {
    //           ...student.comments,
    //           [startDate]: comment,
    //           [endDate]: comment
    //         };
    //         student.attendance = {
    //           ...student.attendance,
    //           [startDate]: message,
    //           [endDate]: message
    //         };

    //         datesBetween.map(val => {
    //           student.comments = {
    //             ...student.comments,
    //             [val]: comment,
    //           };
    //           student.attendance = {
    //             ...student.attendance,
    //             [val]: message,
    //           };
    //         })
    //         fetch('https://attendance-app-hnh.herokuapp.com/leave-of-absence', {
    //           method: 'PUT',
    //           headers: {
    //             'content-type': 'application/json'
    //           },
    //           body: JSON.stringify({
    //             "_id": student._id,
    //             "startDate": startDate,
    //             "message": message,
    //             "endDate": endDate,
    //             "datesBetween": datesBetween,
    //             "comment": comment
    //           })
    //         })
    //           .then(response => response.json())
    //           .then(response => {
    //             // var data = JSON.stringify(response)
    //             // console.log(response)
    //             // student.comments = response.message.comments
    //             // student.attendance = response.message.attendance
    //             // console.log('fetch student ===> ', student)
    //             // return student
    //           })
    //           .catch(error => console.error('Error:', error))
    //         // return student
    //       } else { alert("Please select start date and end date first") }
    //     }
    //     console.log(student)
    //     return student;
    //   });
    //   console.log(students)
    //   return {
    //     students
    //   };
    // }

    default:
      return state;
  }
};
