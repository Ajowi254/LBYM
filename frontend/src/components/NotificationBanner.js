// NotificationBanner.js
import React, { useContext } from 'react';
import ExpenseBudApi from '../api/api'; // Import ExpenseBudApi
import UserContext from '../context/UserContext';

function NotificationBanner() {
  const { currentUser, notifications, setNotifications } = useContext(UserContext);
  console.log('Current user:', currentUser); // Log the current user
  console.log('Notifications:', notifications); // Log the notifications

  const handleDismissClick = async (notificationId) => {
    console.log('Dismissing notification:', notificationId); 
    // Mark the notification as read in the backend
    await ExpenseBudApi.markNotificationAsRead(currentUser.id, notificationId);

    // Remove the notification from the state
    setNotifications(notifications.filter(notification => notification.id !== notificationId));
  };

  // Check if notifications is an array before calling map
  if (!Array.isArray(notifications)) {
    return null; // or return a default component or a loading spinner
  }

  return (
    <div className="notification-banner">
      {notifications.map((notification, index) => (
        <div key={index} className="notification">
          {notification.message}
          <button onClick={() => handleDismissClick(notification.id)}>Dismiss</button> {/* Add a Dismiss button */}
        </div>
      ))}
    </div>
  );
}

export default NotificationBanner;
