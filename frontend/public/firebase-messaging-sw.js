importScripts(
  "https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging-compat.js"
);
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // console.log("Received background message: ", payload);

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message.",
    // icon: "/logo.png",
    vibrate: [100, 50, 100],
    data: payload.data,
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener("notificationclick", (event) => {
  console.log(event, "Clicked the Notification");

  event.notification.close();
  const url = event.notification.data?.clickAction || "http://localhost:5173";
  event.waitUntil(clients.openWindow(url));
});
