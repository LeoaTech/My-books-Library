import { useEffect, useState } from 'react';
import { requestForToken, onMessage, messaging } from '../../../firebase/firebaseConfig';
import { BASE_URL } from '../../../utils/baseAPIURL';
import { useAuthContext } from '../../../hooks/useAuthContext';


// Saving  Device(browser)Token in the DB table
const fetchTokenToBackend = async (fcmToken, userId) => {
  try {
    const response = await fetch(`${BASE_URL}/users/update-devicetoken`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fcmToken, userId }),
    });

    if (!response.ok) throw new Error('Failed to save token');
    console.log('Token saved to backend!');
  } catch (err) {
    console.error('Save token error:', err);
  }
};

function PushNotificationHandler() {
  const { auth } = useAuthContext();
  const [notification, setNotification] = useState(null); //foreground message
  useEffect(() => {
    if (!auth?.id) return;

    requestForToken().then(fcmToken => {
      if (fcmToken) fetchTokenToBackend(fcmToken, auth.id);
    });

    const unsubscribe = onMessage(messaging, (payload) => {
      // console.log('Foreground message received:', payload);
      setNotification({
        title: payload.notification?.title || 'New Notification',
        body: payload.notification?.body,
      });
    });

    return () => unsubscribe();
  }, [auth])

  if (notification) {
    return (
      <div>
        <h4>{notification.title}</h4>
        <p>{notification.body}</p>
      </div>
    );
  }

  return null;
}


export default PushNotificationHandler;