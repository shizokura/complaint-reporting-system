import { boot } from 'quasar/wrappers'

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

import notification from 'src/mixins/notification';

const firebaseConfig =
{
  apiKey: "AIzaSyD7_uVDQTVABnLWGbQei9-6bDU3Vt-Jh20",
  authDomain: "online-crs.firebaseapp.com",
  projectId: "online-crs",
  storageBucket: "online-crs.appspot.com",
  messagingSenderId: "525223230952",
  appId: "1:525223230952:web:ad1c036ed5eba95fbcf85d",
  measurementId: "G-8X49ZLZV6F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export default boot(({ app }) => 
{
  app.config.globalProperties.$db = db;
  app.config.globalProperties.$auth = auth;
  app.config.globalProperties.$storage = storage;

  app.mixin(notification);
})
