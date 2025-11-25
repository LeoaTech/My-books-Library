importScripts(
  "https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging-compat.js"
);
const firebaseConfig = {
  apiKey: "AIzaSyDXgrml3YLilt6g3scSB6QsP1M0GjkQrt8",
  authDomain: "library-app-60fbd.firebaseapp.com",
  projectId: "library-app-60fbd",
  storageBucket: "library-app-60fbd.firebasestorage.app",
  messagingSenderId: "647065725387",
  appId: "1:647065725387:web:6507cb5da4060d1deaee4e",
  measurementId: "G-ZGD0KEY3P9",
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // console.log("Received background message: ", payload);

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message.",
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
