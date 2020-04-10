import { GET_ALL_PRODUCTS } from "./types";
import firebase from '../Firebase'

var allDataProduct = []
// const studentsData = [
//   {
//     id: 1,
//     name: "Angel Yu",
//     attendance: {
//       "2019-08-07": "PRESENT"
//     },
//     comments: {}
//   },
//   {
//     id: 2,
//     name: "Benedict Wong",
//     attendance: {
//       "2019-08-07": "PRESENT"
//     },
//     comments: {
//       "2019-08-07": "PRESENT"
//     }
//   },
//   {
//     id: 3,
//     name: "Careen Yee",
//     attendance: {
//       "2019-08-07": "PRESENT"
//     },
//     comments: {}
//   },
//   {
//     id: 4,
//     name: "Darren Ng",
//     attendance: {
//       "2019-08-07": "PRESENT"
//     },
//     comments: {}
//   },
//   {
//     id: 5,
//     name: "Michael Yan",
//     attendance: {
//       "2019-08-06": "PRESENT",
//       "2019-08-07": "PRESENT"
//     },
//     comments: {}
//   },
//   {
//     id: 6,
//     name: "Joseph Zargoza",
//     attendance: {
//       "2019-08-07": "PRESENT"
//     },
//     comments: {}
//   },
//   {
//     id: 7,
//     name: "Jose Rizal",
//     attendance: {
//       "2019-08-07": "EARLY_DEPARTURE"
//     },
//     comments: {
//       "2019-08-07": "EARLY_DEPARTURE"
//     }
//   },
//   {
//     id: 8,
//     name: "Emilio Aguinaldo",
//     attendance: {
//       "2019-08-07": "PRESENT"
//     },
//     comments: {}
//   },
//   {
//     id: 9,
//     name: "Lim Dan",
//     attendance: {
//       "2019-08-07": "LATE"
//     },
//     comments: {}
//   },
//   {
//     id: 10,
//     name: "Peter Gregory",
//     attendance: {
//       "2019-08-07": "ABSENT"
//     },
//     comments: {}
//   },
//   {
//     id: 11,
//     name: "Richard Henley",
//     attendance: {
//       "2019-08-07": "PRESENT"
//     },
//     comments: {}
//   },
// ];

// fetch('http://localhost:3000/students')
// .then(res => res.json())
// .then(result => {
// 	console.log(result)
//   for(var key in result){
//     let user = result[key]
//     studentsData.push(user)
//     console.log(user)
//   }
// })
// .catch(err => console.log('err', err))


// console.log(studentsData)
export const fetchProducts = dispatch => {
  console.log('dispatch  ====> ', dispatch)
  return {
    type: GET_ALL_PRODUCTS,
    payload: dispatch
  }
};

export const fetchAllStudents = () => {
  
  return (dispatch) => {
    console.log('dispatch  ====> ', dispatch)
    return firebase.database().ref('/data/').on('child_added', snap => {
      let values = snap.val()
      allDataProduct.push(values)
      // this.setState({ data })
      return dispatch(fetchProducts(allDataProduct))
    })
  };
};
