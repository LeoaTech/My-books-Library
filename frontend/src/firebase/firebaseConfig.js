import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

// Request For Token
export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: VAPID_KEY,
    });
    if (currentToken) {
      return currentToken;
    } else {
      // console.log(
      //   "No registration token available. Request permission to generate one."
      // );
    }
  } catch (err) {
    // console.log("An error occurred while retrieving token. ", err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
export { messaging, getToken, onMessage, analytics };
