import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

import { getDatabase, ref, get, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBDNAh5CJBZO5VRrbfpX1e0gOpTd6vahJM",
  authDomain: "surf-app-auth.firebaseapp.com",
  projectId: "surf-app-auth",
  storageBucket: "surf-app-auth.appspot.com",
  messagingSenderId: "696151062124",
  appId: "1:696151062124:web:90643f1bfad5bd670b8a49",
  measurementId: "G-NBJ8CCQLBM",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  console.log('signing in with google !!!')
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log('snapshot', result.user)

    const db = getDatabase();
    set(ref(db, 'users/' + user.uid), {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
    });

  } catch (error) {
    console.error("Error signing in with Google:", error.message);
    alert("Google sign-in failed. Please try again.");
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    const db = getDatabase();
    console.log('name', name)
    set(ref(db, 'users/' + user.uid), {
      uid: user.uid,
      name: name,
      email: user.email,
    });
    
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
