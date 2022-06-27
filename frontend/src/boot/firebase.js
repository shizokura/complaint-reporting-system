import Firebase from 'firebase/app';
import { firestorePlugin } from 'vuefire';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/functions';
import 'firebase/storage';
import 'firebase/analytics';
import config from 'app/settings';

Firebase.initializeApp(config);

export default ({ Vue }) => {
  Vue.use(firestorePlugin);
}

let FUNCTIONS;

if(process.env.NODE_ENV == 'development')
{
	Firebase.functions().useFunctionsEmulator(`http://${window.location.hostname}:5000`);
	FUNCTIONS = Firebase.functions();
}
else
{
	FUNCTIONS  = Firebase.app().functions('asia-northeast1');
}

Firebase.firestore().enablePersistence({
    synchronizeTabs:true
})
  .catch(function(err) {
      console.log(err);
  });

const DB          = Firebase.firestore();
const AUTH        = Firebase.auth();
const FIREBASE_AUTH = Firebase.auth;
const STORAGE     = Firebase.storage;
const STORAGEREF  = Firebase.storage().ref();
const FIELD_VALUE = Firebase.firestore.FieldValue;
const FIELD_PATH  = Firebase.firestore.FieldPath;
const TIME_STAMP  = Firebase.firestore.Timestamp;
const ANALYTICS   = Firebase.analytics();

export
{
    ANALYTICS,
    DB,
    AUTH,
    FIREBASE_AUTH,
    FUNCTIONS,
    STORAGE,
    STORAGEREF,
    FIELD_VALUE,
    FIELD_PATH,
    TIME_STAMP
}