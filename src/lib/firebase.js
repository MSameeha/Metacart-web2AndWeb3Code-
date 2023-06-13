import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import firebase1 from 'firebase';
// eslint-disable-next-line import/named
import { seedDatabase } from '../seed.js';

const config = {
};

const firebase = Firebase.initializeApp(config);
const { FieldValue } = Firebase.firestore;
const storage = firebase1.storage();

// seedDatabase(firebase);
export { storage, firebase, FieldValue };
