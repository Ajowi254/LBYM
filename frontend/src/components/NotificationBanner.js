import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../context/UserContext';
import ExpenseBudApi from '../api/api';

// Import the CSS file if it's not already imported
import './Nav.css';

function NotificationBanner() {
  const { currentUser, notifications, setNotifications } = useContext(UserContext);

  // Add a state variable to control whether the banner is shown or not
  const [isShown, setIsShown] = useState(true);

  const handleDismissClick = async (notificationId) => {
    console.log('Dismissing notification:', notificationId);

    await ExpenseBudApi.markNotificationAsRead(currentUser.id, notificationId);

    setNotifications(notifications.filter(notification => notification.id !== notificationId));

    // Hide the banner immediately when the dismiss button is clicked
    setIsShown(false);
  };

  useEffect(() => {
    if (notifications.length > 0) {
      // Show the banner when there are notifications
      setIsShown(true);

      const timer = setTimeout(() => {
        // Hide the banner after 20 seconds
        setIsShown(false);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [notifications, setNotifications]);

  if (!Array.isArray(notifications) || notifications.length === 0) {
    return null;
  }

  const latestNotification = notifications[0];

  return (
    <div className={`notification-banner ${isShown ? 'show' : 'hide'}`} style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1001 }}>
      <div className="notification" style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '3px' }}>
        {latestNotification.message}
        <button onClick={() => handleDismissClick(latestNotification.id)}>Dismiss</button>
      </div>
    </div>
  );
}

export default NotificationBanner;
