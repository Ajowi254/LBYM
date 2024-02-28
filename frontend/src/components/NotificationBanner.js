//notificationbanner.js
import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../context/UserContext';
import socketIOClient from "socket.io-client";
import './Nav.css';
import ExpenseBudApi from '../api/api';

const ENDPOINT = "http://localhost:3001";

function NotificationBanner() {
  const { currentUser, notifications, setNotifications } = useContext(UserContext);
  const [isShown, setIsShown] = useState(true);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    socket.on('connect', () => {
      console.log('Successfully connected to the server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });

    socket.on("notifications_updated", data => {
      if (data.userId === currentUser.id) {
        setNotifications(data.notifications);
        setIsShown(true);
      }
    });

    return () => socket.disconnect();
  }, [currentUser, setNotifications]);

  const handleDismissClick = async (notificationId) => {
    console.log('Dismissing notification:', notificationId);

    await ExpenseBudApi.markNotificationAsRead(currentUser.id, notificationId);

    setNotifications(notifications.filter(notification => notification.id !== notificationId));
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
