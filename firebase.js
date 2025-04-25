import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // apiKey: "AIzaSyCU6R-8UusO-g2qhqxmfC19nkS92gMHcEwKRINAL",
  apiKey: "AIzaSyCU6R-8UusO-g2qhqxmfC19nkS92gMHcEw",
  authDomain: "clone-f330b.firebaseapp.com",
  projectId: "clone-f330b",
  storageBucket: "clone-f330b.firebasestorage.app",
  messagingSenderId: "151485167085",
  appId: "1:151485167085:web:cac6be40ffdb94ffeaa3e4",
  measurementId: "G-GFLH8F5C5P"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };