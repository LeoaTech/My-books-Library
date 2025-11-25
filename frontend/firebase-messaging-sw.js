import { firebaseConfig } from "./src/firebase/firebaseConfig";

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging-compat.js"
);

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
