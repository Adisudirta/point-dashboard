import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import firebaseConfig from "~/firebase/firebase-config.json";

const app = initializeApp(firebaseConfig);

export const authClient = getAuth(app);
