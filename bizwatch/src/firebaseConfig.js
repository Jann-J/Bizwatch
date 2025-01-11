import {initializeApp} from 'firebase/app'

const firebaseConfig = {
    apiKey: "AIzaSyClVLmStGcbDuOEJah8SNMKSN8a30hY2QM",
    authDomain: "launchpad-69203.firebaseapp.com",
    projectId: "launchpad-69203",
    storageBucket: "launchpad-69203.firebasestorage.app",
    messagingSenderId: "339755992035",
    appId: "1:339755992035:web:6762ec4aacdf97a1b3d6d6",
    databaseURL: "https://launchpad-69203-default-rtdb.firebaseio.com" //URL of databse here change later with actual database
  };

 export const app = initializeApp(firebaseConfig);