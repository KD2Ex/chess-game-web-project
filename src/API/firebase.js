import firebase from "firebase/app";
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDsAeehGDYAj_iSgHBAU10RqlyY3J__vY8",
    authDomain: "chess-game-web-project.firebaseapp.com",
    projectId: "chess-game-web-project",
    storageBucket: "chess-game-web-project.appspot.com",
    messagingSenderId: "9212172548",
    appId: "1:9212172548:web:7372b8aec7b92779471851"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();
export default firebase;