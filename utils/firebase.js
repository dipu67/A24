require("dotenv").config();
const {initializeApp} = require('firebase/app')
const {getFirestore,} = require('firebase/firestore')
const {getStorage} = require('firebase/storage')

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket:process.env.storageBucket ,
    messagingSenderId:process.env.messagingSenderId ,
    appId: process.env.appId,
    measurementId: process.env.measurementId
  };

  // Initialize Firebase 

  const app = initializeApp(firebaseConfig)

  const db = getFirestore(app)
  const storage = getStorage(app)

  module.exports = {db,storage}