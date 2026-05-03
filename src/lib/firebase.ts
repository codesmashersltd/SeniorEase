import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCyHNCYjvNk-p4-VJbS1UZ9dL5COLu0M2Q",
  authDomain: "gen-lang-client-0483352558.firebaseapp.com",
  projectId: "gen-lang-client-0483352558",
  storageBucket: "gen-lang-client-0483352558.firebasestorage.app",
  messagingSenderId: "743828876789",
  appId: "1:743828876789:web:b7c9fc139c1f03be2044bc",
};

const firestoreDatabaseId = "ai-studio-614a8b41-e35b-4410-ab4d-a8f0ed5278b6";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firestoreDatabaseId);
export const auth = getAuth(app);
