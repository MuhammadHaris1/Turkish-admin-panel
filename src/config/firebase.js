import * as firebase from 'firebase';


var firebaseConfig = {
  apiKey: "AIzaSyBOjnT0mC9QRQ1Sr_riMxfjZyUyhh3GG3Q",
  authDomain: "turkish-tv-urdu.firebaseapp.com",
  databaseURL: "https://turkish-tv-urdu.firebaseio.com",
  projectId: "turkish-tv-urdu",
  storageBucket: "turkish-tv-urdu.appspot.com",
  messagingSenderId: "33438796554",
  appId: "1:33438796554:web:d44b3c376931fb5ed688f3",
  measurementId: "G-DVDPYD42YW"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();


  export default firebase