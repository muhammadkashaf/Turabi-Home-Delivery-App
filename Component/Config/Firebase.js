import * as firebase from 'firebase'

// Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDtHjQf3G6bwPZmRDVY2F0uFOd8lXA90JA",
    authDomain: "thds-7dee1.firebaseapp.com",
    databaseURL: "https://thds-7dee1.firebaseio.com",
    projectId: "thds-7dee1",
    storageBucket: "gs://thds-7dee1.appspot.com",
    messagingSenderId: "420962174626",
    appId: "1:420962174626:web:f2549c05c1cfaedf"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase