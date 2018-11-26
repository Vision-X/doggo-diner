import firebase from 'firebase';
import dotenv from 'dotenv';
const config = {
  apiKey: process.env.REACT_APP_CONFIG_APIKEY,
  authDomain: process.env.REACT_APP_CONFIG_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_CONFIG_DBURL,
  projectId: process.env.REACT_APP_CONFIG_PID,
  storageBucket: process.env.REACT_APP_CONFIG_SB,
  messagingSenderId: process.env.REACT_APP_CONFIG_MSID
};
const fire = firebase.initializeApp(config)
export { fire }
