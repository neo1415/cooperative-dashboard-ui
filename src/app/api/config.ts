// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6ve70AEWk4o85CUn65PH47aFi3QIoFhU",
  authDomain: "cooperative-server.firebaseapp.com",
  projectId: "cooperative-server",
  storageBucket: "cooperative-server.appspot.com",
  messagingSenderId: "464916128315",
  appId: "1:464916128315:web:aef36dd1496ef50e82721e",
  measurementId: "G-VW6TY9YSBX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
export { auth };