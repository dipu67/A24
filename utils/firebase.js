const {initializeApp} = require('firebase/app')
const {getFirestore,} = require('firebase/firestore')
const {getStorage} = require('firebase/storage')

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDYuZNhtgbSmX3jba_MtoAuIyqMCUC-Q6M",
    authDomain: "a24-chat.firebaseapp.com",
    databaseURL: "https://a24-chat-default-rtdb.firebaseio.com",
    projectId: "a24-chat",
    storageBucket: "a24-chat.appspot.com",
    messagingSenderId: "642408926202",
    appId: "1:642408926202:web:8fc432117dbc880e8d7243",
    measurementId: "G-RNB4NQP0KG"
  };

  // Initialize Firebase 

  const app = initializeApp(firebaseConfig)

  const db = getFirestore(app)
  const storage = getStorage(app)

  module.exports = {db,storage}