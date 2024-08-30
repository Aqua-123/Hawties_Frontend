// firebase.js
'use client';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth'; // For Authentication
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: 'AIzaSyDyH0LXgzkikiCTxgsw0ebEmjjQ0vkOl-w',
  authDomain: 'hawties-2a013.firebaseapp.com',
  projectId: 'hawties-2a013',
  storageBucket: 'hawties-2a013.appspot.com',
  messagingSenderId: '523392422092',
  appId: '1:523392422092:web:f63642ccc26c3888a1b269',
  measurementId: 'G-JCWEDXQL6W',
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

const waitForFirebaseAuth = () => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        resolve(user);
      } else {
        resolve(null);
      }
      unsubscribe();
    });
  });
};

export { auth, googleProvider, githubProvider, analytics, waitForFirebaseAuth };
