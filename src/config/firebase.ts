import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDywam0ZpB_PeXcz9wW1fpORA26AxkY2o0",
  authDomain: "project7-5b0f8.firebaseapp.com",
  projectId: "project7-5b0f8",
  storageBucket: "project7-5b0f8.appspot.com",
  messagingSenderId: "660836034274",
  appId: "1:660836034274:web:f9b293b36f515ec87160bb",
  measurementId: "G-CVJE2G2VBN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth setup
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account', // 👈 forces popup to choose account
});

// Optional: Enable analytics
if (typeof window !== 'undefined') {
  getAnalytics(app);
}
