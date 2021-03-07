const firebase = require("firebase/app")
require("firebase/firestore")

const firebaseConfig = {
  apiKey: "AIzaSyCMzgcMeipoZEguxq44TLu8VXCio97h95Y",
  authDomain: "kiei-451-f6add.firebaseapp.com",
  projectId: "kiei-451-f6add",
  storageBucket: "kiei-451-f6add.appspot.com",
  messagingSenderId: "866116706947",
  appId: "1:866116706947:web:86830093f46602905a71b6"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

module.exports = firebase