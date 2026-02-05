const admin = require("../config/firebase.js");

const send_push_notification = async (deviceTokens, title, body) => {
  if (!deviceTokens || deviceTokens.length === 0) {
    return;
  }
  const message = {
    notification: {
      title,
      body,
    },
    tokens: deviceTokens,
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    // console.log("Successfully sent push message:", response);
    return response;
  } catch (error) {
    // console.error("Error sending message:", error);
    throw error;
  }
};

module.exports = send_push_notification;
