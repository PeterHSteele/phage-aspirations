//import { FIREBASE_KEY } from '../config'

import * as firebase from 'firebase';
import { config } from '../config';

firebase.initializeApp(config);

export { firebase };