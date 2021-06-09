import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJET_ID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSANGINGSENDERID,
    appId: process.env.REACT_APP_APP_ID,
});

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();


  export { db, auth, storage };

  export default firebase;